import { prisma } from "../config/prisma.js";
import { aiService } from "./ai.service.js";

export type SearchItemType = "lesson" | "video" | "quiz";

export interface SearchResultItem {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  routeParams: any;
  score: number;
  semanticScore?: number;
  ftsScore?: number;
  semanticRank?: number;
  ftsRank?: number;
}

interface FullTextSearchRow {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  routeParams: any;
  ftsScore: number;
  ftsRank: number;
}

interface SemanticSearchRow {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  routeParams: any;
  semanticScore: number;
  semanticRank: number;
}

interface MissingEmbeddingRow {
  id: string;
  type: SearchItemType;
  searchText: string;
}

const SEARCH_TOP_K = 50;
const EMBEDDING_DIMENSIONS = 3072;
const SEMANTIC_THRESHOLD = 0.3;
const RRF_K = 60;
const SEMANTIC_RRF_WEIGHT = 1;
const FTS_RRF_WEIGHT = 1.15;

class SearchService {
  private isInitializing = false;
  private isSearchIndexReady = false;

  private itemKey(item: Pick<SearchResultItem, "id" | "type">) {
    return `${item.type}:${item.id}`;
  }

  private toPgVectorLiteral(embedding: number[]) {
    if (embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Expected ${EMBEDDING_DIMENSIONS} embedding dimensions, got ${embedding.length}`,
      );
    }

    return `[${embedding.join(",")}]`;
  }

  private fuseWithRrf(semanticResults: SearchResultItem[], ftsResults: SearchResultItem[]) {
    const fused = new Map<string, SearchResultItem>();

    for (const [index, item] of semanticResults.entries()) {
      const rank = item.semanticRank ?? index + 1;
      fused.set(this.itemKey(item), {
        ...item,
        score: SEMANTIC_RRF_WEIGHT / (RRF_K + rank),
        semanticRank: rank,
      });
    }

    for (const [index, item] of ftsResults.entries()) {
      const key = this.itemKey(item);
      const rank = item.ftsRank ?? index + 1;
      const rrfScore = FTS_RRF_WEIGHT / (RRF_K + rank);
      const existing = fused.get(key);

      if (existing) {
        fused.set(key, {
          ...existing,
          ftsScore: item.ftsScore,
          ftsRank: rank,
          score: existing.score + rrfScore,
        });
      } else {
        fused.set(key, {
          ...item,
          score: rrfScore,
          ftsRank: rank,
        });
      }
    }

    return [...fused.values()]
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.title || "").localeCompare(b.title || "");
      })
      .slice(0, SEARCH_TOP_K);
  }

  private async refreshFullTextIndex() {
    try {
      await prisma.$executeRaw`REFRESH MATERIALIZED VIEW CONCURRENTLY "search_documents"`;
    } catch (err) {
      console.warn(
        "⚠️ [SearchService] Could not refresh FTS materialized view. Run migrations if hybrid search was just added.",
        err,
      );
    }
  }

  private async backfillVectorColumns() {
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE "chapter_nodes"
        SET "embedding_vec" = ('[' || array_to_string("embedding", ',') || ']')::halfvec(${EMBEDDING_DIMENSIONS})
        WHERE
          "embedding_vec" IS NULL
          AND "embedding" IS NOT NULL
          AND array_length("embedding", 1) = ${EMBEDDING_DIMENSIONS};
      `);

      await prisma.$executeRawUnsafe(`
        UPDATE "movies"
        SET "embedding_vec" = ('[' || array_to_string("embedding", ',') || ']')::halfvec(${EMBEDDING_DIMENSIONS})
        WHERE
          "embedding_vec" IS NULL
          AND "embedding" IS NOT NULL
          AND array_length("embedding", 1) = ${EMBEDDING_DIMENSIONS};
      `);

      await prisma.$executeRawUnsafe(`
        UPDATE "quizzes"
        SET "embedding_vec" = ('[' || array_to_string("embedding", ',') || ']')::halfvec(${EMBEDDING_DIMENSIONS})
        WHERE
          "embedding_vec" IS NULL
          AND "embedding" IS NOT NULL
          AND array_length("embedding", 1) = ${EMBEDDING_DIMENSIONS};
      `);
    } catch (err) {
      console.warn(
        "⚠️ [SearchService] Could not backfill pgvector columns. Semantic search will fall back until migrations are applied.",
        err,
      );
    }
  }

  private async findDocumentsMissingEmbeddings() {
    try {
      return await prisma.$queryRaw<MissingEmbeddingRow[]>`
        SELECT
          cn."id"::TEXT AS "id",
          'lesson'::TEXT AS "type",
          CONCAT_WS(
            ' ',
            'Lesson:',
            cn."tieu_de_muc",
            'Muc:',
            cn."muc",
            'Chapter:',
            c."title",
            theory_cards."text"
          ) AS "searchText"
        FROM "chapter_nodes" cn
        INNER JOIN "chapters" c ON c."id" = cn."chapter_id"
        LEFT JOIN LATERAL (
          SELECT STRING_AGG(CONCAT_WS(' ', card->>'title', card->>'body'), ' ') AS "text"
          FROM jsonb_array_elements(COALESCE(cn."data"->'theoryCards', '[]'::jsonb)) AS card
        ) theory_cards ON TRUE
        WHERE cn."embedding" IS NULL OR array_length(cn."embedding", 1) IS NULL

        UNION ALL

        SELECT
          m."id"::TEXT AS "id",
          'video'::TEXT AS "type",
          CONCAT_WS(' ', 'Interactive Movie Video:', m."title", 'Muc:', m."muc", m."script"::TEXT)
            AS "searchText"
        FROM "movies" m
        WHERE m."embedding" IS NULL OR array_length(m."embedding", 1) IS NULL

        UNION ALL

        SELECT
          q."id"::TEXT AS "id",
          'quiz'::TEXT AS "type",
          CONCAT_WS(' ', 'Quiz Trắc nghiệm:', q."title", 'Questions:', quiz_questions."text")
            AS "searchText"
        FROM "quizzes" q
        LEFT JOIN LATERAL (
          SELECT STRING_AGG(CONCAT_WS(' ', qq."question", qq."explanation"), ' ') AS "text"
          FROM "quiz_questions" qq
          WHERE qq."quiz_id" = q."id"
        ) quiz_questions ON TRUE
        WHERE q."embedding" IS NULL OR array_length(q."embedding", 1) IS NULL;
      `;
    } catch (err) {
      console.warn("⚠️ [SearchService] Could not find missing embeddings:", err);
      return [];
    }
  }

  private async updateFloatEmbedding(item: MissingEmbeddingRow, embedding: number[]) {
    if (item.type === "lesson") {
      await prisma.chapterNode.update({ where: { id: item.id }, data: { embedding } });
      return;
    }

    if (item.type === "video") {
      await prisma.movie.update({ where: { id: item.id }, data: { embedding } });
      return;
    }

    await prisma.quiz.update({ where: { id: item.id }, data: { embedding } });
  }

  private async updateVectorEmbedding(item: MissingEmbeddingRow, embedding: number[]) {
    const vectorLiteral = this.toPgVectorLiteral(embedding);

    if (item.type === "lesson") {
      await prisma.$executeRawUnsafe(
        `UPDATE "chapter_nodes" SET "embedding_vec" = $1::halfvec(${EMBEDDING_DIMENSIONS}) WHERE "id" = $2::uuid`,
        vectorLiteral,
        item.id,
      );
      return;
    }

    if (item.type === "video") {
      await prisma.$executeRawUnsafe(
        `UPDATE "movies" SET "embedding_vec" = $1::halfvec(${EMBEDDING_DIMENSIONS}) WHERE "id" = $2::uuid`,
        vectorLiteral,
        item.id,
      );
      return;
    }

    await prisma.$executeRawUnsafe(
      `UPDATE "quizzes" SET "embedding_vec" = $1::halfvec(${EMBEDDING_DIMENSIONS}) WHERE "id" = $2::uuid`,
      vectorLiteral,
      item.id,
    );
  }

  private async backfillMissingEmbeddings() {
    const missingDocuments = await this.findDocumentsMissingEmbeddings();

    for (const item of missingDocuments) {
      try {
        console.warn(
          `[SearchService] Embedding missing for ${item.type} "${item.id}". Generating...`,
        );
        const embedding = await aiService.getEmbedding(item.searchText);
        await this.updateFloatEmbedding(item, embedding);
        await this.updateVectorEmbedding(item, embedding);
      } catch (err) {
        console.error(`❌ Failed to embed ${item.type} "${item.id}":`, err);
      }
    }
  }

  private async semanticSearch(query: string, type?: string): Promise<SearchResultItem[]> {
    try {
      const queryEmbedding = await aiService.getEmbedding(query);
      const vectorLiteral = this.toPgVectorLiteral(queryEmbedding);

      const rows = await prisma.$queryRawUnsafe<SemanticSearchRow[]>(
        `
          WITH query_embedding AS (
            SELECT $1::halfvec(${EMBEDDING_DIMENSIONS}) AS embedding
          ),
          semantic_documents AS (
            SELECT
              cn."id"::TEXT AS "id",
              'lesson'::TEXT AS "type",
              cn."tieu_de_muc" AS "title",
              ('Chương ' || REPLACE(c."code", 'chuong', '') || ' - Mục ' || cn."muc") AS "subtitle",
              jsonb_build_object(
                'chapter', REPLACE(c."code", 'chuong', ''),
                'muc', cn."muc"
              ) AS "routeParams",
              1 - (cn."embedding_vec" <=> query_embedding.embedding) AS "semanticScore"
            FROM "chapter_nodes" cn
            INNER JOIN "chapters" c ON c."id" = cn."chapter_id"
            CROSS JOIN query_embedding
            WHERE
              cn."embedding_vec" IS NOT NULL
              AND ($2::TEXT IS NULL OR $2::TEXT = 'all' OR $2::TEXT = 'lesson')

            UNION ALL

            SELECT
              m."id"::TEXT AS "id",
              'video'::TEXT AS "type",
              m."title",
              ('Video tương tác - Mục ' || m."muc") AS "subtitle",
              jsonb_build_object('muc', m."muc") AS "routeParams",
              1 - (m."embedding_vec" <=> query_embedding.embedding) AS "semanticScore"
            FROM "movies" m
            CROSS JOIN query_embedding
            WHERE
              m."embedding_vec" IS NOT NULL
              AND ($2::TEXT IS NULL OR $2::TEXT = 'all' OR $2::TEXT = 'video')

            UNION ALL

            SELECT
              q."id"::TEXT AS "id",
              'quiz'::TEXT AS "type",
              q."title",
              'Trắc nghiệm ôn tập'::TEXT AS "subtitle",
              jsonb_build_object(
                'quizId', q."id"::TEXT,
                'lessonId', q."lesson_id"::TEXT
              ) AS "routeParams",
              1 - (q."embedding_vec" <=> query_embedding.embedding) AS "semanticScore"
            FROM "quizzes" q
            CROSS JOIN query_embedding
            WHERE
              q."embedding_vec" IS NOT NULL
              AND ($2::TEXT IS NULL OR $2::TEXT = 'all' OR $2::TEXT = 'quiz')
          ),
          ranked AS (
            SELECT
              *,
              ROW_NUMBER() OVER (ORDER BY "semanticScore" DESC, "title" ASC)::INTEGER AS "semanticRank"
            FROM semantic_documents
            WHERE "semanticScore" > $3
          )
          SELECT
            "id",
            "type",
            "title",
            "subtitle",
            "routeParams",
            "semanticScore",
            "semanticRank"
          FROM ranked
          ORDER BY "semanticRank" ASC
          LIMIT $4;
        `,
        vectorLiteral,
        type ?? null,
        SEMANTIC_THRESHOLD,
        SEARCH_TOP_K,
      );

      return rows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        subtitle: row.subtitle,
        routeParams: row.routeParams,
        score: row.semanticScore,
        semanticScore: row.semanticScore,
        semanticRank: row.semanticRank,
      }));
    } catch (err) {
      console.error(`❌ pgvector semantic search failed for query "${query}":`, err);
      return [];
    }
  }

  private async fullTextSearch(query: string, type?: string): Promise<SearchResultItem[]> {
    try {
      const rows = await prisma.$queryRaw<FullTextSearchRow[]>`
        WITH search_query AS (
          SELECT websearch_to_tsquery('simple', ${query}) AS q
        ),
        ranked AS (
          SELECT
            sd."id",
            sd."type",
            sd."title",
            sd."subtitle",
            sd."route_params" AS "routeParams",
            ts_rank_cd(sd."fts_vector", search_query.q) AS "ftsScore"
          FROM "search_documents" sd
          CROSS JOIN search_query
          WHERE
            numnode(search_query.q) > 0
            AND sd."fts_vector" @@ search_query.q
            AND (
              CAST(${type ?? null} AS TEXT) IS NULL
              OR CAST(${type ?? null} AS TEXT) = 'all'
              OR sd."type" = CAST(${type ?? null} AS TEXT)
            )
        )
        SELECT
          "id",
          "type",
          "title",
          "subtitle",
          "routeParams",
          "ftsScore",
          ROW_NUMBER() OVER (ORDER BY "ftsScore" DESC, "title" ASC)::INTEGER AS "ftsRank"
        FROM ranked
        ORDER BY "ftsScore" DESC, "title" ASC
        LIMIT ${SEARCH_TOP_K};
      `;

      return rows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        subtitle: row.subtitle,
        routeParams: row.routeParams,
        score: row.ftsScore,
        ftsScore: row.ftsScore,
        ftsRank: row.ftsRank,
      }));
    } catch (err) {
      console.error(`❌ Full-text search failed for query "${query}":`, err);
      return [];
    }
  }

  private async keywordFallbackSearch(query: string, type?: string): Promise<SearchResultItem[]> {
    try {
      const rows = await prisma.$queryRaw<FullTextSearchRow[]>`
        SELECT
          sd."id",
          sd."type",
          sd."title",
          sd."subtitle",
          sd."route_params" AS "routeParams",
          1.0::DOUBLE PRECISION AS "ftsScore",
          ROW_NUMBER() OVER (ORDER BY sd."title" ASC)::INTEGER AS "ftsRank"
        FROM "search_documents" sd
        WHERE
          LOWER(sd."search_text") LIKE '%' || LOWER(${query}) || '%'
          AND (
            CAST(${type ?? null} AS TEXT) IS NULL
            OR CAST(${type ?? null} AS TEXT) = 'all'
            OR sd."type" = CAST(${type ?? null} AS TEXT)
          )
        ORDER BY sd."title" ASC
        LIMIT ${SEARCH_TOP_K};
      `;

      return rows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        subtitle: row.subtitle,
        routeParams: row.routeParams,
        score: 1 / (RRF_K + row.ftsRank),
        ftsScore: row.ftsScore,
        ftsRank: row.ftsRank,
      }));
    } catch (err) {
      console.error(`❌ Keyword fallback search failed for query "${query}":`, err);
      return [];
    }
  }

  /**
   * Prepares persisted search indexes. Embeddings are stored in Postgres/pgvector,
   * not retained in a Node.js in-memory vector cache.
   */
  async initializeSearchIndexes(force = false) {
    if ((this.isSearchIndexReady && !force) || this.isInitializing) return;
    this.isInitializing = true;

    try {
      console.warn("🌱 [SearchService] Initializing hybrid search indexes...");
      const startTime = Date.now();

      await this.refreshFullTextIndex();
      await this.backfillVectorColumns();
      await this.backfillMissingEmbeddings();

      this.isSearchIndexReady = true;
      console.warn(
        `✅ [SearchService] Hybrid search indexes ready in ${((Date.now() - startTime) / 1000).toFixed(2)}s.`,
      );
    } catch (err) {
      console.error("❌ [SearchService] Failed to initialize hybrid search indexes:", err);
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Search for items matching the query using PostgreSQL FTS + pgvector semantic
   * similarity, then fuse both rankings with Reciprocal Rank Fusion.
   */
  async search(query: string, type?: string) {
    if (!query?.trim()) {
      return [];
    }

    if (!this.isSearchIndexReady) {
      await this.initializeSearchIndexes();
    }

    const [semanticResults, ftsResults] = await Promise.all([
      this.semanticSearch(query, type),
      this.fullTextSearch(query, type),
    ]);

    if (semanticResults.length || ftsResults.length) {
      return this.fuseWithRrf(semanticResults, ftsResults);
    }

    return this.keywordFallbackSearch(query, type);
  }
}

export const searchService = new SearchService();

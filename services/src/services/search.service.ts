import { prisma } from "../config/prisma.js";
import { aiService } from "./ai.service.js";

export type SearchItemType = "lesson" | "video" | "quiz";

export interface SearchCacheItem {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string; // muc or lesson info
  routeParams: any; // parameters for navigation
  searchText: string;
  embedding: number[];
}

class SearchService {
  private cache: SearchCacheItem[] = [];
  private isInitializing = false;
  private isCacheLoaded = false;

  /**
   * Helper to calculate Cosine Similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Loads all lessons, movies, and quizzes from database,
   * gets embeddings for them, and caches them in memory.
   */
  async initializeVectorCache() {
    if (this.isCacheLoaded || this.isInitializing) return;
    this.isInitializing = true;

    try {
      console.warn("🌱 [SearchService] Initializing Semantic Search vector cache...");
      const startTime = Date.now();

      const newCache: SearchCacheItem[] = [];

      // 1. Load Chapter Nodes (Lessons)
      const nodes = await prisma.chapterNode.findMany({
        include: { chapter: true },
      });

      for (const node of nodes) {
        const data = node.data as any;
        const theoryCards = data?.theoryCards || [];
        const theoryText = theoryCards.map((c: any) => c.body).join(" ");
        const searchText = `Lesson: ${node.title}. Muc: ${node.muc}. Chapter: ${node.chapter.title}. Content: ${theoryText}`;

        try {
          let embedding = node.embedding;
          if (!embedding || embedding.length === 0) {
            console.warn(
              `[SearchService] Embedding missing for lesson "${node.title}". Generating...`,
            );
            embedding = await aiService.getEmbedding(searchText);
            await prisma.chapterNode.update({
              where: { id: node.id },
              data: { embedding },
            });
          }

          newCache.push({
            id: node.id,
            type: "lesson",
            title: node.title,
            subtitle: `Chương ${node.chapter.code.replace("chuong", "")} - Mục ${node.muc}`,
            routeParams: {
              chapter: node.chapter.code.replace("chuong", ""),
              muc: node.muc,
            },
            searchText,
            embedding,
          });
        } catch (err) {
          console.error(`❌ Failed to embed lesson "${node.title}":`, err);
        }
      }

      // 2. Load Movies (Videos)
      const movies = await prisma.movie.findMany();
      for (const movie of movies) {
        const searchText = `Interactive Movie Video: ${movie.title}. Muc: ${movie.muc}`;
        try {
          let embedding = movie.embedding;
          if (!embedding || embedding.length === 0) {
            console.warn(
              `[SearchService] Embedding missing for movie "${movie.title}". Generating...`,
            );
            embedding = await aiService.getEmbedding(searchText);
            await prisma.movie.update({
              where: { id: movie.id },
              data: { embedding },
            });
          }

          newCache.push({
            id: movie.id,
            type: "video",
            title: movie.title,
            subtitle: `Video tương tác - Mục ${movie.muc}`,
            routeParams: {
              muc: movie.muc,
            },
            searchText,
            embedding,
          });
        } catch (err) {
          console.error(`❌ Failed to embed movie "${movie.title}":`, err);
        }
      }

      // 3. Load Quizzes
      const quizzes = await prisma.quiz.findMany({
        include: {
          questions: {
            include: { options: true },
          },
        },
      });
      for (const quiz of quizzes) {
        const questionsText = quiz.questions
          .map((q) => `${q.question} ${q.explanation || ""}`)
          .join(" ");
        const searchText = `Quiz Trắc nghiệm: ${quiz.title}. Questions: ${questionsText}`;
        try {
          let embedding = quiz.embedding;
          if (!embedding || embedding.length === 0) {
            console.warn(
              `[SearchService] Embedding missing for quiz "${quiz.title}". Generating...`,
            );
            embedding = await aiService.getEmbedding(searchText);
            await prisma.quiz.update({
              where: { id: quiz.id },
              data: { embedding },
            });
          }

          newCache.push({
            id: quiz.id,
            type: "quiz",
            title: quiz.title,
            subtitle: `Trắc nghiệm ôn tập`,
            routeParams: {
              quizId: quiz.id,
              lessonId: quiz.lessonId,
            },
            searchText,
            embedding,
          });
        } catch (err) {
          console.error(`❌ Failed to embed quiz "${quiz.title}":`, err);
        }
      }

      this.cache = newCache;
      this.isCacheLoaded = true;
      console.warn(
        `✅ [SearchService] Vector cache initialized successfully with ${this.cache.length} items in ${((Date.now() - startTime) / 1000).toFixed(2)}s.`,
      );
    } catch (err) {
      console.error("❌ [SearchService] Failed to initialize Vector cache:", err);
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Search for items matching the query using semantic similarity
   */
  async search(query: string, type?: string) {
    if (!query?.trim()) {
      return [];
    }

    // Lazy load vector cache if not yet loaded
    if (!this.isCacheLoaded) {
      await this.initializeVectorCache();
    }

    try {
      const queryEmbedding = await aiService.getEmbedding(query);

      const results = this.cache
        .map((item) => {
          const score = this.cosineSimilarity(queryEmbedding, item.embedding);
          return {
            id: item.id,
            type: item.type,
            title: item.title,
            subtitle: item.subtitle,
            routeParams: item.routeParams,
            score,
          };
        })
        // Filter out very low matches
        .filter((item) => item.score > 0.3)
        // If type filter is provided, filter by it
        .filter((item) => !type || type === "all" || item.type === type)
        // Sort by highest score first
        .sort((a, b) => b.score - a.score);

      return results;
    } catch (err) {
      console.error(`❌ Semantic search failed for query "${query}":`, err);
      // Fallback: simple text match if Gemini is offline
      const normalizedQuery = query.toLowerCase().trim();
      return this.cache
        .filter((item) => item.searchText.toLowerCase().includes(normalizedQuery))
        .filter((item) => !type || type === "all" || item.type === type)
        .map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          routeParams: item.routeParams,
          score: 1.0,
        }));
    }
  }
}

export const searchService = new SearchService();

-- Hybrid Search: PostgreSQL FTS document index for lessons, videos, and quizzes.
-- Semantic embeddings remain on the source tables; this materialized view powers
-- the keyword/FTS side that is fused with semantic search in the API.

CREATE MATERIALIZED VIEW "search_documents" AS
WITH lesson_documents AS (
    SELECT
        cn."id"::TEXT AS "id",
        'lesson'::TEXT AS "type",
        cn."tieu_de_muc" AS "title",
        ('Chương ' || REPLACE(c."code", 'chuong', '') || ' - Mục ' || cn."muc") AS "subtitle",
        jsonb_build_object(
            'chapter', REPLACE(c."code", 'chuong', ''),
            'muc', cn."muc"
        ) AS "route_params",
        CONCAT_WS(
            ' ',
            'Lesson:',
            cn."tieu_de_muc",
            'Muc:',
            cn."muc",
            'Chapter:',
            c."title",
            theory_cards."text"
        ) AS "search_text",
        (
            setweight(to_tsvector('simple', COALESCE(cn."tieu_de_muc", '')), 'A') ||
            setweight(to_tsvector('simple', COALESCE(cn."muc", '')), 'A') ||
            setweight(to_tsvector('simple', COALESCE(c."title", '')), 'B') ||
            setweight(to_tsvector('simple', COALESCE(theory_cards."text", '')), 'C')
        ) AS "fts_vector"
    FROM "chapter_nodes" cn
    INNER JOIN "chapters" c ON c."id" = cn."chapter_id"
    LEFT JOIN LATERAL (
        SELECT STRING_AGG(CONCAT_WS(' ', card->>'title', card->>'body'), ' ') AS "text"
        FROM jsonb_array_elements(COALESCE(cn."data"->'theoryCards', '[]'::jsonb)) AS card
    ) theory_cards ON TRUE
),
movie_documents AS (
    SELECT
        m."id"::TEXT AS "id",
        'video'::TEXT AS "type",
        m."title",
        ('Video tương tác - Mục ' || m."muc") AS "subtitle",
        jsonb_build_object('muc', m."muc") AS "route_params",
        CONCAT_WS(
            ' ',
            'Interactive Movie Video:',
            m."title",
            'Muc:',
            m."muc",
            m."script"::TEXT
        ) AS "search_text",
        (
            setweight(to_tsvector('simple', COALESCE(m."title", '')), 'A') ||
            setweight(to_tsvector('simple', COALESCE(m."muc", '')), 'A') ||
            setweight(to_tsvector('simple', COALESCE(m."script"::TEXT, '')), 'C')
        ) AS "fts_vector"
    FROM "movies" m
),
quiz_documents AS (
    SELECT
        q."id"::TEXT AS "id",
        'quiz'::TEXT AS "type",
        q."title",
        'Trắc nghiệm ôn tập'::TEXT AS "subtitle",
        jsonb_build_object(
            'quizId', q."id"::TEXT,
            'lessonId', q."lesson_id"::TEXT
        ) AS "route_params",
        CONCAT_WS(
            ' ',
            'Quiz Trắc nghiệm:',
            q."title",
            'Questions:',
            quiz_questions."text"
        ) AS "search_text",
        (
            setweight(to_tsvector('simple', COALESCE(q."title", '')), 'A') ||
            setweight(to_tsvector('simple', COALESCE(quiz_questions."text", '')), 'B')
        ) AS "fts_vector"
    FROM "quizzes" q
    LEFT JOIN LATERAL (
        SELECT STRING_AGG(CONCAT_WS(' ', qq."question", qq."explanation"), ' ') AS "text"
        FROM "quiz_questions" qq
        WHERE qq."quiz_id" = q."id"
    ) quiz_questions ON TRUE
)
SELECT * FROM lesson_documents
UNION ALL
SELECT * FROM movie_documents
UNION ALL
SELECT * FROM quiz_documents;

CREATE UNIQUE INDEX "search_documents_type_id_key" ON "search_documents"("type", "id");
CREATE INDEX "search_documents_type_idx" ON "search_documents"("type");
CREATE INDEX "search_documents_fts_vector_idx" ON "search_documents" USING GIN ("fts_vector");

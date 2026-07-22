-- Store semantic embeddings in pgvector so semantic search can run in Postgres
-- instead of loading all vectors into Node.js memory.

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "chapter_nodes"
ADD COLUMN IF NOT EXISTS "embedding_vec" halfvec(3072);

ALTER TABLE "movies"
ADD COLUMN IF NOT EXISTS "embedding_vec" halfvec(3072);

ALTER TABLE "quizzes"
ADD COLUMN IF NOT EXISTS "embedding_vec" halfvec(3072);

UPDATE "chapter_nodes"
SET "embedding_vec" = ('[' || array_to_string("embedding", ',') || ']')::halfvec(3072)
WHERE
    "embedding_vec" IS NULL
    AND "embedding" IS NOT NULL
    AND array_length("embedding", 1) = 3072;

UPDATE "movies"
SET "embedding_vec" = ('[' || array_to_string("embedding", ',') || ']')::halfvec(3072)
WHERE
    "embedding_vec" IS NULL
    AND "embedding" IS NOT NULL
    AND array_length("embedding", 1) = 3072;

UPDATE "quizzes"
SET "embedding_vec" = ('[' || array_to_string("embedding", ',') || ']')::halfvec(3072)
WHERE
    "embedding_vec" IS NULL
    AND "embedding" IS NOT NULL
    AND array_length("embedding", 1) = 3072;

CREATE INDEX IF NOT EXISTS "chapter_nodes_embedding_vec_hnsw_idx"
ON "chapter_nodes"
USING hnsw ("embedding_vec" halfvec_cosine_ops);

CREATE INDEX IF NOT EXISTS "movies_embedding_vec_hnsw_idx"
ON "movies"
USING hnsw ("embedding_vec" halfvec_cosine_ops);

CREATE INDEX IF NOT EXISTS "quizzes_embedding_vec_hnsw_idx"
ON "quizzes"
USING hnsw ("embedding_vec" halfvec_cosine_ops);

-- Align the database with the current Prisma schema after older cleanup
-- migrations were applied to a partially migrated database.

ALTER TABLE "movies"
ADD COLUMN IF NOT EXISTS "chapter_node_id" UUID;

CREATE UNIQUE INDEX IF NOT EXISTS "movies_chapter_node_id_key"
ON "movies"("chapter_node_id");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'movies_chapter_node_id_fkey'
    ) THEN
        ALTER TABLE "movies"
        ADD CONSTRAINT "movies_chapter_node_id_fkey"
        FOREIGN KEY ("chapter_node_id")
        REFERENCES "chapter_nodes"("id")
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "topic_perspectives" (
    "id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "perspective_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topic_perspectives_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "topic_perspectives_topic_id_perspective_type_key"
ON "topic_perspectives"("topic_id", "perspective_type");

CREATE INDEX IF NOT EXISTS "topic_perspectives_topic_id_idx"
ON "topic_perspectives"("topic_id");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'topic_perspectives_topic_id_fkey'
    ) THEN
        ALTER TABLE "topic_perspectives"
        ADD CONSTRAINT "topic_perspectives_topic_id_fkey"
        FOREIGN KEY ("topic_id")
        REFERENCES "topics"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;
END $$;

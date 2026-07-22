-- Chapter lesson progress table expected by the current Prisma schema.

CREATE TABLE IF NOT EXISTS "user_chapter_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "chapter_node_id" UUID NOT NULL,
    "muc" VARCHAR(100) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'locked',
    "score" INTEGER,
    "review" JSONB,
    "draft" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_chapter_progress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_chapter_progress_user_id_chapter_node_id_key"
ON "user_chapter_progress"("user_id", "chapter_node_id");

CREATE INDEX IF NOT EXISTS "user_chapter_progress_user_id_chapter_id_idx"
ON "user_chapter_progress"("user_id", "chapter_id");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_chapter_progress_user_id_fkey'
    ) THEN
        ALTER TABLE "user_chapter_progress"
        ADD CONSTRAINT "user_chapter_progress_user_id_fkey"
        FOREIGN KEY ("user_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_chapter_progress_chapter_id_fkey'
    ) THEN
        ALTER TABLE "user_chapter_progress"
        ADD CONSTRAINT "user_chapter_progress_chapter_id_fkey"
        FOREIGN KEY ("chapter_id")
        REFERENCES "chapters"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_chapter_progress_chapter_node_id_fkey'
    ) THEN
        ALTER TABLE "user_chapter_progress"
        ADD CONSTRAINT "user_chapter_progress_chapter_node_id_fkey"
        FOREIGN KEY ("chapter_node_id")
        REFERENCES "chapter_nodes"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
    END IF;
END $$;

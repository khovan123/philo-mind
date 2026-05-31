-- DropIndex
DROP INDEX "bookmarks_user_id_idx";

-- CreateIndex
CREATE INDEX "topics_created_at_idx" ON "topics"("created_at");

-- CreateIndex
CREATE INDEX "story_scenarios_created_at_idx" ON "story_scenarios"("created_at");

-- CreateIndex
CREATE INDEX "user_progress_user_id_status_idx" ON "user_progress"("user_id", "status");

-- Merge duplicate badge definitions before enforcing uniqueness.
WITH "ranked_badges" AS (
    SELECT
        "id",
        FIRST_VALUE("id") OVER (PARTITION BY "condition_type" ORDER BY "id") AS "canonical_id"
    FROM "badges"
)
DELETE FROM "user_badges" AS "duplicate_user_badges"
USING "ranked_badges" AS "duplicate_badges"
WHERE "duplicate_user_badges"."badge_id" = "duplicate_badges"."id"
  AND "duplicate_badges"."id" <> "duplicate_badges"."canonical_id"
  AND EXISTS (
      SELECT 1
      FROM "user_badges" AS "canonical_user_badges"
      WHERE "canonical_user_badges"."user_id" = "duplicate_user_badges"."user_id"
        AND "canonical_user_badges"."badge_id" = "duplicate_badges"."canonical_id"
  );

WITH "ranked_badges" AS (
    SELECT
        "id",
        FIRST_VALUE("id") OVER (PARTITION BY "condition_type" ORDER BY "id") AS "canonical_id"
    FROM "badges"
)
UPDATE "user_badges" AS "user_badges"
SET "badge_id" = "ranked_badges"."canonical_id"
FROM "ranked_badges"
WHERE "user_badges"."badge_id" = "ranked_badges"."id"
  AND "ranked_badges"."id" <> "ranked_badges"."canonical_id";

WITH "ranked_badges" AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (PARTITION BY "condition_type" ORDER BY "id") AS "badge_rank"
    FROM "badges"
)
DELETE FROM "badges"
USING "ranked_badges"
WHERE "badges"."id" = "ranked_badges"."id"
  AND "ranked_badges"."badge_rank" > 1;

-- CreateIndex
CREATE UNIQUE INDEX "badges_condition_type_key" ON "badges"("condition_type");

-- CreateIndex
CREATE INDEX "bookmarks_user_id_created_at_idx" ON "bookmarks"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "bookmarks_user_id_target_type_created_at_idx" ON "bookmarks"("user_id", "target_type", "created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_type_created_at_idx" ON "notifications"("user_id", "type", "created_at");

-- CreateIndex
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at");

-- CreateIndex
CREATE INDEX "reports_status_target_type_created_at_idx" ON "reports"("status", "target_type", "created_at");

-- CreateIndex
CREATE INDEX "reports_target_type_created_at_idx" ON "reports"("target_type", "created_at");

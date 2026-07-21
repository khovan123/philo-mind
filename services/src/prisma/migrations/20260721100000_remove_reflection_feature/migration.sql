DELETE FROM "activity_logs"
WHERE "activity_type" = 'WRITE_REFLECTION' OR "target_type" = 'REFLECTION';

DELETE FROM "bookmarks"
WHERE "target_type" = 'REFLECTION';

DELETE FROM "reports"
WHERE "target_type" = 'REFLECTION';

DROP TABLE IF EXISTS "reflection_entries";

CREATE TYPE "TargetType_new" AS ENUM (
  'LESSON',
  'SHORT_LESSON',
  'STORY',
  'TOPIC',
  'MINDMAP_NODE',
  'QUIZ',
  'MINI_GAME'
);

ALTER TABLE "bookmarks"
  ALTER COLUMN "target_type" TYPE "TargetType_new"
  USING ("target_type"::text::"TargetType_new");

ALTER TABLE "activity_logs"
  ALTER COLUMN "target_type" TYPE "TargetType_new"
  USING ("target_type"::text::"TargetType_new");

ALTER TABLE "reports"
  ALTER COLUMN "target_type" TYPE "TargetType_new"
  USING ("target_type"::text::"TargetType_new");

ALTER TYPE "TargetType" RENAME TO "TargetType_old";
ALTER TYPE "TargetType_new" RENAME TO "TargetType";
DROP TYPE "TargetType_old";

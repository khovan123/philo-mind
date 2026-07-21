/*
  Warnings:

  - The values [DEBATE,ARGUMENT,AI_CHAT,SCENARIO] on the enum `TargetType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ai_characters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_chat_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_chat_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `debate_arguments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `debate_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `debate_votes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `debates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `real_life_scenarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scenario_frameworks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scenario_perspectives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scenario_responses` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `perspective_type` on the `topic_perspectives` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Purge rows referencing deprecated TargetType values before the enum is altered.
-- DEBATE, ARGUMENT, AI_CHAT, SCENARIO are being removed; any existing rows
-- with these values would cause the USING cast below to fail.
DELETE FROM "bookmarks"     WHERE "target_type"::text IN ('DEBATE', 'ARGUMENT', 'AI_CHAT', 'SCENARIO');
DELETE FROM "activity_logs" WHERE "target_type"::text IN ('DEBATE', 'ARGUMENT', 'AI_CHAT', 'SCENARIO');
DELETE FROM "reports"       WHERE "target_type"::text IN ('DEBATE', 'ARGUMENT', 'AI_CHAT', 'SCENARIO');

-- AlterEnum
BEGIN;
CREATE TYPE "TargetType_new" AS ENUM ('LESSON', 'SHORT_LESSON', 'STORY', 'TOPIC', 'MINDMAP_NODE', 'REFLECTION', 'QUIZ', 'MINI_GAME');
ALTER TABLE "bookmarks" ALTER COLUMN "target_type" TYPE "TargetType_new" USING ("target_type"::text::"TargetType_new");
ALTER TABLE "activity_logs" ALTER COLUMN "target_type" TYPE "TargetType_new" USING ("target_type"::text::"TargetType_new");
ALTER TABLE "reports" ALTER COLUMN "target_type" TYPE "TargetType_new" USING ("target_type"::text::"TargetType_new");
ALTER TYPE "TargetType" RENAME TO "TargetType_old";
ALTER TYPE "TargetType_new" RENAME TO "TargetType";
DROP TYPE "public"."TargetType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ai_chat_messages" DROP CONSTRAINT IF EXISTS "ai_chat_messages_session_id_fkey";

-- DropForeignKey
ALTER TABLE "ai_chat_sessions" DROP CONSTRAINT IF EXISTS "ai_chat_sessions_character_id_fkey";

-- DropForeignKey
ALTER TABLE "ai_chat_sessions" DROP CONSTRAINT IF EXISTS "ai_chat_sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "debate_arguments" DROP CONSTRAINT IF EXISTS "debate_arguments_debate_id_fkey";

-- DropForeignKey
ALTER TABLE "debate_arguments" DROP CONSTRAINT IF EXISTS "debate_arguments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "debate_comments" DROP CONSTRAINT IF EXISTS "debate_comments_argument_id_fkey";

-- DropForeignKey
ALTER TABLE "debate_comments" DROP CONSTRAINT IF EXISTS "debate_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "debate_votes" DROP CONSTRAINT IF EXISTS "debate_votes_argument_id_fkey";

-- DropForeignKey
ALTER TABLE "debate_votes" DROP CONSTRAINT IF EXISTS "debate_votes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "debates" DROP CONSTRAINT IF EXISTS "debates_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "password_resets" DROP CONSTRAINT IF EXISTS "fk_password_resets_user";

-- DropForeignKey
ALTER TABLE "real_life_scenarios" DROP CONSTRAINT IF EXISTS "real_life_scenarios_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "scenario_frameworks" DROP CONSTRAINT IF EXISTS "scenario_frameworks_scenario_id_fkey";

-- DropForeignKey
ALTER TABLE "scenario_perspectives" DROP CONSTRAINT IF EXISTS "scenario_perspectives_scenario_id_fkey";

-- DropForeignKey
ALTER TABLE "scenario_responses" DROP CONSTRAINT IF EXISTS "scenario_responses_scenario_id_fkey";

-- DropForeignKey
ALTER TABLE "scenario_responses" DROP CONSTRAINT IF EXISTS "scenario_responses_user_id_fkey";

-- AlterTable
ALTER TABLE "mini_games" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "password_resets" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "expires_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "used_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "embedding" DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "topic_perspectives" DROP COLUMN "perspective_type",
ADD COLUMN     "perspective_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deletion_requested_at" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE IF EXISTS "ai_characters";

-- DropTable
DROP TABLE IF EXISTS "ai_chat_messages";

-- DropTable
DROP TABLE IF EXISTS "ai_chat_sessions";

-- DropTable
DROP TABLE IF EXISTS "debate_arguments";

-- DropTable
DROP TABLE IF EXISTS "debate_comments";

-- DropTable
DROP TABLE IF EXISTS "debate_votes";

-- DropTable
DROP TABLE IF EXISTS "debates";

-- DropTable
DROP TABLE IF EXISTS "real_life_scenarios";

-- DropTable
DROP TABLE IF EXISTS "scenario_frameworks";

-- DropTable
DROP TABLE IF EXISTS "scenario_perspectives";

-- DropTable
DROP TABLE IF EXISTS "scenario_responses";

-- DropEnum
DROP TYPE IF EXISTS "DebateStance";

-- DropEnum
DROP TYPE IF EXISTS "DebateStatus";

-- DropEnum
DROP TYPE IF EXISTS "PerspectiveType";

-- DropEnum
DROP TYPE IF EXISTS "SenderType";

-- DropEnum
DROP TYPE IF EXISTS "VoteValue";

-- CreateTable
CREATE TABLE "chapters" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "order" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter_nodes" (
    "id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "muc" VARCHAR(100) NOT NULL,
    "tieu_de_muc" VARCHAR(200) NOT NULL,
    "data" JSONB NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" UUID NOT NULL,
    "chapter_id" UUID,
    "muc" VARCHAR(100) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "script" JSONB NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_sessions" (
    "id" UUID NOT NULL,
    "movie_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "thien_cam" INTEGER NOT NULL DEFAULT 50,
    "uy_tin" INTEGER NOT NULL DEFAULT 50,
    "correct_n" INTEGER NOT NULL DEFAULT 0,
    "is_passed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chapters_code_key" ON "chapters"("code");

-- CreateIndex
CREATE INDEX "chapters_code_idx" ON "chapters"("code");

-- CreateIndex
CREATE UNIQUE INDEX "chapter_nodes_chapter_id_muc_key" ON "chapter_nodes"("chapter_id", "muc");

-- CreateIndex
CREATE INDEX "movies_muc_idx" ON "movies"("muc");

-- CreateIndex
CREATE INDEX "movie_sessions_movie_id_user_id_idx" ON "movie_sessions"("movie_id", "user_id");

-- CreateIndex
CREATE INDEX "movie_sessions_user_id_idx" ON "movie_sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "topic_perspectives_topic_id_perspective_type_key" ON "topic_perspectives"("topic_id", "perspective_type");

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_nodes" ADD CONSTRAINT "chapter_nodes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_sessions" ADD CONSTRAINT "movie_sessions_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_sessions" ADD CONSTRAINT "movie_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_password_resets_email" RENAME TO "password_resets_email_idx";

-- RenameIndex
ALTER INDEX "idx_password_resets_user_id" RENAME TO "password_resets_user_id_idx";

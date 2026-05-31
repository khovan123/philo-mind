-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_active_at" TIMESTAMP(3),
ADD COLUMN     "streak_count" INTEGER NOT NULL DEFAULT 0;

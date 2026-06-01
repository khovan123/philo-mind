-- AlterTable
ALTER TABLE "mini_games"
ADD COLUMN "topic_id" UUID,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "mini_games_topic_id_idx" ON "mini_games"("topic_id");

-- CreateIndex
CREATE INDEX "mini_games_game_type_idx" ON "mini_games"("game_type");

-- AddForeignKey
ALTER TABLE "mini_games"
ADD CONSTRAINT "mini_games_topic_id_fkey"
FOREIGN KEY ("topic_id") REFERENCES "topics"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- T-D01: Story Mode Engine — Schema migration
-- Adds: AnalysisTabType enum, PhilosophyTag, StoryLearnCard, StoryLearnCardTag, AnalysisTab
-- Strategy: additive — existing story_consequences columns are untouched

-- CreateEnum
CREATE TYPE "AnalysisTabType" AS ENUM ('ETHICAL', 'PHILOSOPHICAL', 'POLITICAL_ECONOMIC', 'HISTORICAL');

-- CreateTable
CREATE TABLE "philosophy_tags" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "philosophy_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_learn_cards" (
    "id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "source_ref" VARCHAR(200),
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_learn_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_learn_card_tags" (
    "card_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "story_learn_card_tags_pkey" PRIMARY KEY ("card_id", "tag_id")
);

-- CreateTable
CREATE TABLE "analysis_tabs" (
    "id" UUID NOT NULL,
    "consequence_id" UUID NOT NULL,
    "tab_type" "AnalysisTabType" NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_tabs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "philosophy_tags_name_key" ON "philosophy_tags"("name");

-- CreateIndex
CREATE INDEX "philosophy_tags_name_idx" ON "philosophy_tags"("name");

-- CreateIndex
CREATE INDEX "story_learn_cards_story_id_order_idx" ON "story_learn_cards"("story_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_tabs_consequence_id_tab_type_key" ON "analysis_tabs"("consequence_id", "tab_type");

-- CreateIndex
CREATE INDEX "analysis_tabs_consequence_id_order_idx" ON "analysis_tabs"("consequence_id", "order");

-- AddForeignKey
ALTER TABLE "story_learn_cards" ADD CONSTRAINT "story_learn_cards_story_id_fkey"
    FOREIGN KEY ("story_id") REFERENCES "story_scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_learn_card_tags" ADD CONSTRAINT "story_learn_card_tags_card_id_fkey"
    FOREIGN KEY ("card_id") REFERENCES "story_learn_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_learn_card_tags" ADD CONSTRAINT "story_learn_card_tags_tag_id_fkey"
    FOREIGN KEY ("tag_id") REFERENCES "philosophy_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_tabs" ADD CONSTRAINT "analysis_tabs_consequence_id_fkey"
    FOREIGN KEY ("consequence_id") REFERENCES "story_consequences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

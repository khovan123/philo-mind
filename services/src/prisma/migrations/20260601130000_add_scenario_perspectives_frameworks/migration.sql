-- AlterTable
ALTER TABLE "scenario_responses" ADD COLUMN     "initial_position" TEXT NOT NULL,
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "reflection" TEXT,
ADD COLUMN     "revised_position" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "selected_decision" DROP NOT NULL;

-- DropTable
DROP TABLE "scenario_analyses";

-- CreateTable
CREATE TABLE "scenario_perspectives" (
    "id" UUID NOT NULL,
    "scenario_id" UUID NOT NULL,
    "perspective_type" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scenario_perspectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_frameworks" (
    "id" UUID NOT NULL,
    "scenario_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scenario_frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scenario_responses_user_id_scenario_id_key" ON "scenario_responses"("user_id", "scenario_id");

-- CreateIndex
CREATE INDEX "scenario_perspectives_scenario_id_idx" ON "scenario_perspectives"("scenario_id");

-- CreateIndex
CREATE INDEX "scenario_frameworks_scenario_id_idx" ON "scenario_frameworks"("scenario_id");

-- AddForeignKey
ALTER TABLE "scenario_perspectives" ADD CONSTRAINT "scenario_perspectives_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "real_life_scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_frameworks" ADD CONSTRAINT "scenario_frameworks_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "real_life_scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

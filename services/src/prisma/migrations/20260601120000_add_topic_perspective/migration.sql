-- CreateEnum
CREATE TYPE "PerspectiveType" AS ENUM ('TECH', 'ETHICAL', 'ECONOMIC', 'SOCIAL', 'PHILOSOPHICAL');

-- CreateTable
CREATE TABLE "topic_perspectives" (
    "id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "perspective_type" "PerspectiveType" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topic_perspectives_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "topic_perspectives_topic_id_perspective_type_key" ON "topic_perspectives"("topic_id", "perspective_type");

-- CreateIndex
CREATE INDEX "topic_perspectives_topic_id_idx" ON "topic_perspectives"("topic_id");

-- AddForeignKey
ALTER TABLE "topic_perspectives" ADD CONSTRAINT "topic_perspectives_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

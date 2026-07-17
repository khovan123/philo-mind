import type { PrismaClient } from "../prisma/generated/client.js";
import { seedSkip } from "./utils/index.js";

export async function seedStories(prisma: PrismaClient): Promise<void> {
  void prisma;
  seedSkip("StoryScenario", "story seed data removed");
}

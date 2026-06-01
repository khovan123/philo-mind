/**
 * Seed: 10 Badges
 * Issue: #64 — T-C10
 *
 * Source: BADGE_DEFINITIONS in badge.service.ts (single source of truth for conditionType)
 * Dependencies: none
 *
 * Idempotency: upsert on conditionType (unique) — safe to run multiple times.
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { BADGE_DEFINITIONS } from "../services/badge.service.js";
import { seedLog } from "./utils/index.js";

export async function seedBadges(prisma: PrismaClient): Promise<void> {
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { conditionType: badge.conditionType },
      update: {
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
      },
      create: {
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        conditionType: badge.conditionType,
      },
    });
  }

  seedLog("Badge", BADGE_DEFINITIONS.length);
}

export { BADGE_DEFINITIONS };

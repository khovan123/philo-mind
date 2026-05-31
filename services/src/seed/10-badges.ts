/**
 * Seed: Badges
 * Source: data/10-badges.csv
 * Dependencies: none
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { readCsv, seedLog, seedSkip } from "./utils/index.js";

interface BadgeRow {
  tên: string;
  mô_tả: string;
  icon: string;
  điều_kiện: string;
}

export async function seedBadges(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.badge.count();
  if (existing > 0) {
    seedSkip("Badge", `already has ${existing} records`);
    return;
  }

  const rows = readCsv<BadgeRow>("10-badges.csv");

  for (const row of rows) {
    await prisma.badge.create({
      data: {
        name: row.tên,
        description: row.mô_tả,
        iconUrl: row.icon, // Emoji or URL
        conditionType: row.điều_kiện,
      },
    });
  }

  seedLog("Badge", rows.length);
}

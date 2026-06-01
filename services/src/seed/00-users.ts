/**
 * Seed: Users
 * Dependencies: none (root entity)
 */
import type { PrismaClient } from "../prisma/generated/client.js";
import { seedLog, seedSkip } from "./utils/index.js";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.user.count();
  if (existing > 0) {
    seedSkip("User", `already has ${existing} records`);
    return;
  }

  // Password hash for 'Password123'
  const passwordHash = await bcrypt.hash("Password123", BCRYPT_ROUNDS);

  const usersData = [
    {
      fullName: "Người học PhiloMind",
      email: "user@philomind.com",
      passwordHash,
      role: "USER" as const,
    },
    {
      fullName: "Quản trị viên PhiloMind",
      email: "admin@philomind.com",
      passwordHash,
      role: "ADMIN" as const,
    },
  ];

  for (const user of usersData) {
    await prisma.user.create({
      data: user,
    });
  }

  seedLog("User", usersData.length);
}

import { Prisma } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";
import type { CreatePhilosophyTagInput } from "../validators/philosophy-tag.validator.js";

// ── T-D01: PhilosophyTag Service ─────────────────────────────

export class PhilosophyTagError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "PhilosophyTagError";
  }
}

export class PhilosophyTagService {
  async listAll() {
    return prisma.philosophyTag.findMany({
      orderBy: { name: "asc" },
    });
  }

  async create(input: CreatePhilosophyTagInput) {
    try {
      return await prisma.philosophyTag.create({ data: input });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new PhilosophyTagError(
          "TAG_DUPLICATE",
          `Tag với tên "${input.name}" đã tồn tại`,
          409,
        );
      }
      throw err;
    }
  }

  async delete(tagId: string) {
    const result = await prisma.philosophyTag.deleteMany({ where: { id: tagId } });
    if (result.count === 0) {
      throw new PhilosophyTagError("TAG_NOT_FOUND", "Không tìm thấy philosophy tag", 404);
    }
  }
}

export const philosophyTagService = new PhilosophyTagService();

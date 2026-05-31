import { prisma } from "../config/prisma.js";

// ── T-D04: Consequence Service ────────────────────────────────

export class ConsequenceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ConsequenceError";
  }
}

export class ConsequenceService {
  /**
   * Get the consequence of a specific choice, including its nested analysis tabs
   */
  async getConsequenceByChoice(choiceId: string) {
    // 1. Verify choice exists
    const choice = await prisma.storyChoice.findUnique({
      where: { id: choiceId },
      select: { id: true },
    });

    if (!choice) {
      throw new ConsequenceError("CHOICE_NOT_FOUND", "Lựa chọn không tồn tại", 404);
    }

    // 2. Fetch consequence
    const consequence = await prisma.storyConsequence.findFirst({
      where: { choiceId },
      include: {
        analysisTabs: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!consequence) {
      throw new ConsequenceError(
        "CONSEQUENCE_NOT_FOUND",
        "Hệ quả chưa được thiết lập cho lựa chọn này",
        404,
      );
    }

    return consequence;
  }
}

export const consequenceService = new ConsequenceService();

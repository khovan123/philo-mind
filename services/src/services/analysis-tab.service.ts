import { Prisma } from "../prisma/generated/client.js";
import { prisma } from "../config/prisma.js";
import type {
  CreateAnalysisTabInput,
  UpdateAnalysisTabInput,
} from "../validators/analysis-tab.validator.js";

// ── T-D01: AnalysisTab Service ───────────────────────────────

export class AnalysisTabError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AnalysisTabError";
  }
}

export class AnalysisTabService {
  async listByConsequence(consequenceId: string) {
    await this.ensureConsequenceExists(consequenceId);
    return prisma.analysisTab.findMany({
      where: { consequenceId },
      orderBy: { order: "asc" },
    });
  }

  async create(consequenceId: string, input: CreateAnalysisTabInput) {
    await this.ensureConsequenceExists(consequenceId);
    try {
      return await prisma.analysisTab.create({
        data: { consequenceId, ...input },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AnalysisTabError(
          "TAB_DUPLICATE",
          `Tab loại "${input.tabType}" đã tồn tại cho consequence này`,
          409,
        );
      }
      throw err;
    }
  }

  async update(consequenceId: string, tabId: string, input: UpdateAnalysisTabInput) {
    await this.ensureTabBelongsToConsequence(tabId, consequenceId);
    return prisma.analysisTab.update({
      where: { id: tabId },
      data: input,
    });
  }

  async delete(consequenceId: string, tabId: string) {
    await this.ensureTabBelongsToConsequence(tabId, consequenceId);
    await prisma.analysisTab.delete({ where: { id: tabId } });
  }

  // ── Private helpers ─────────────────────────────────────────

  private async ensureConsequenceExists(consequenceId: string) {
    const consequence = await prisma.storyConsequence.findUnique({
      where: { id: consequenceId },
      select: { id: true },
    });
    if (!consequence) {
      throw new AnalysisTabError(
        "CONSEQUENCE_NOT_FOUND",
        "Không tìm thấy story consequence",
        404,
      );
    }
  }

  private async ensureTabBelongsToConsequence(tabId: string, consequenceId: string) {
    const tab = await prisma.analysisTab.findUnique({
      where: { id: tabId },
      select: { id: true, consequenceId: true },
    });
    if (!tab) {
      throw new AnalysisTabError("TAB_NOT_FOUND", "Không tìm thấy analysis tab", 404);
    }
    if (tab.consequenceId !== consequenceId) {
      throw new AnalysisTabError(
        "TAB_CONSEQUENCE_MISMATCH",
        "Analysis tab không thuộc consequence này",
        403,
      );
    }
  }
}

export const analysisTabService = new AnalysisTabService();

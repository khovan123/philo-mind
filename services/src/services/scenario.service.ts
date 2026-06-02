import { prisma } from "../config/prisma.js";
import { ActivityLogService } from "./activity-log.service.js";
import { invalidateCachePattern } from "../middleware/cache.middleware.js";
import type { TargetType } from "../prisma/generated/enums.js";
import type {
  RespondScenarioInput,
  RethinkScenarioInput,
} from "../validators/scenario.validator.js";

// ── T-F02: Scenario Service ────────────────────────────────────

export class ScenarioError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ScenarioError";
  }
}

export class ScenarioService {
  /**
   * List all real-life scenarios (paginated & optionally filtered by topicId)
   */
  async listScenarios(query: { topicId?: string }, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where = {
      ...(query.topicId ? { topicId: query.topicId } : {}),
    };

    const [scenarios, total] = await Promise.all([
      prisma.realLifeScenario.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.realLifeScenario.count({ where }),
    ]);

    return {
      scenarios,
      total,
    };
  }

  /**
   * Get single real-life scenario detail with perspectives, frameworks, and user response
   */
  async getScenarioDetail(id: string, userId?: string | null) {
    const scenario = await prisma.realLifeScenario.findUnique({
      where: { id },
      include: {
        perspectives: true,
        frameworks: true,
      },
    });

    if (!scenario) {
      throw new ScenarioError("SCENARIO_NOT_FOUND", "Không tìm thấy tình huống thực tế này", 404);
    }

    let userResponse = null;
    if (userId) {
      userResponse = await prisma.scenarioResponse.findUnique({
        where: {
          userId_scenarioId: {
            userId,
            scenarioId: id,
          },
        },
      });
    }

    return {
      ...scenario,
      userResponse,
    };
  }

  /**
   * Record initial stance response and calculate perspective stats
   */
  async respondScenario(id: string, userId: string, input: RespondScenarioInput) {
    // 1. Verify scenario exists
    const scenarioExists = await prisma.realLifeScenario.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!scenarioExists) {
      throw new ScenarioError("SCENARIO_NOT_FOUND", "Không tìm thấy tình huống thực tế này", 404);
    }

    // 2. Check if user already responded to this scenario
    const existing = await prisma.scenarioResponse.findUnique({
      where: {
        userId_scenarioId: {
          userId,
          scenarioId: id,
        },
      },
    });
    if (existing) {
      throw new ScenarioError(
        "SCENARIO_RESPONSE_ALREADY_EXISTS",
        "Bạn đã phản hồi lập trường cho tình huống này rồi. Hãy dùng tính năng cập nhật lập trường (rethink).",
        409,
      );
    }

    // 3. Save initial stance response
    const savedResponse = await prisma.scenarioResponse.create({
      data: {
        scenarioId: id,
        userId,
        initialPosition: input.initialPosition,
        reasoning: input.reasoning || null,
      },
    });

    // 4. Calculate stats (counts & percentages of community responses)
    const statsGroup = await prisma.scenarioResponse.groupBy({
      by: ["initialPosition"],
      where: { scenarioId: id },
      _count: {
        _all: true,
      },
    });

    const totalResponses = statsGroup.reduce((sum, item) => sum + item._count._all, 0);
    const perspectiveStats = statsGroup.map((item) => ({
      perspectiveType: item.initialPosition,
      count: item._count._all,
      percentage: totalResponses > 0 ? Math.round((item._count._all / totalResponses) * 100) : 0,
    }));

    // 5. Log activity
    try {
      await ActivityLogService.logActivity(
        userId,
        "RESPOND_SCENARIO",
        "SCENARIO" as TargetType,
        id,
        { initialPosition: input.initialPosition },
      );
    } catch (error) {
      console.error("❌ Failed to log activity for scenario respond:", error);
    }

    // 6. Invalidate caches
    await invalidateCachePattern("cache:api:/api/v1/scenarios*");
    await invalidateCachePattern("cache:api:/api/v1/stats*");

    return {
      response: savedResponse,
      perspectiveStats,
    };
  }

  /**
   * Rethink and record revised stance response
   */
  async rethinkScenario(id: string, userId: string, input: RethinkScenarioInput) {
    // 1. Verify scenario exists
    const scenarioExists = await prisma.realLifeScenario.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!scenarioExists) {
      throw new ScenarioError("SCENARIO_NOT_FOUND", "Không tìm thấy tình huống thực tế này", 404);
    }

    // 2. Fetch existing response
    const response = await prisma.scenarioResponse.findUnique({
      where: {
        userId_scenarioId: {
          userId,
          scenarioId: id,
        },
      },
    });
    if (!response) {
      throw new ScenarioError(
        "SCENARIO_RESPONSE_NOT_FOUND",
        "Bạn chưa thực hiện phản hồi ban đầu cho tình huống này. Vui lòng phản hồi trước.",
        404,
      );
    }

    // 3. Update stance response
    const updatedResponse = await prisma.scenarioResponse.update({
      where: { id: response.id },
      data: {
        revisedPosition: input.revisedPosition,
        reflection: input.reflection || null,
        updatedAt: new Date(),
      },
    });

    // 4. Log activity
    try {
      await ActivityLogService.logActivity(
        userId,
        "RETHINK_SCENARIO",
        "SCENARIO" as TargetType,
        id,
        { revisedPosition: input.revisedPosition },
      );
    } catch (error) {
      console.error("❌ Failed to log activity for scenario rethink:", error);
    }

    // 5. Invalidate caches
    await invalidateCachePattern("cache:api:/api/v1/scenarios*");
    await invalidateCachePattern("cache:api:/api/v1/stats*");

    return updatedResponse;
  }
}

export const scenarioService = new ScenarioService();

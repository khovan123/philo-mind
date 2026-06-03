import { jest } from "@jest/globals";
import {
  listScenariosSchema,
  respondScenarioSchema,
  rethinkScenarioSchema,
} from "../validators/scenario.validator.js";

// Mock env
jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    PORT: 3001,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci",
    JWT_SECRET: "test-secret-at-least-32-characters-long",
    LOG_LEVEL: "error",
  },
}));

// Mock prisma client calls
const mockFindMany = jest.fn() as any;
const mockCount = jest.fn() as any;
const mockFindUnique = jest.fn() as any;
const mockCreate = jest.fn() as any;
const mockUpdate = jest.fn() as any;
const mockGroupBy = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    realLifeScenario: {
      findMany: mockFindMany,
      count: mockCount,
      findUnique: mockFindUnique,
    },
    scenarioResponse: {
      findUnique: mockFindUnique,
      create: mockCreate,
      update: mockUpdate,
      groupBy: mockGroupBy,
    },
  },
}));

// Mock cache invalidator
jest.unstable_mockModule("../middleware/cache.middleware.js", () => ({
  invalidateCachePattern: (jest.fn() as any).mockResolvedValue(undefined),
  cacheMiddleware: () => (req: any, res: any, next: any) => next(),
}));

// Mock ActivityLogService to prevent DB log calls
jest.unstable_mockModule("../services/activity-log.service.js", () => ({
  ActivityLogService: {
    logActivity: (jest.fn() as any).mockResolvedValue({}),
  },
}));

const { ScenarioService, ScenarioError } = await import("../services/scenario.service.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("Scenario Validator Schemas", () => {
  describe("listScenariosSchema", () => {
    it("accepts valid list query", () => {
      const result = listScenariosSchema.safeParse({
        query: { topicId: VALID_UUID, page: "2", limit: "5" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid topicId uuid", () => {
      const result = listScenariosSchema.safeParse({
        query: { topicId: "not-a-uuid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("respondScenarioSchema", () => {
    it("accepts a valid respond payload", () => {
      const result = respondScenarioSchema.safeParse({
        params: { id: VALID_UUID },
        body: { initialPosition: "thực_dụng", reasoning: "This is pragmatism." },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty initialPosition", () => {
      const result = respondScenarioSchema.safeParse({
        params: { id: VALID_UUID },
        body: { initialPosition: "   " },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("rethinkScenarioSchema", () => {
    it("accepts a valid rethink payload", () => {
      const result = rethinkScenarioSchema.safeParse({
        params: { id: VALID_UUID },
        body: { revisedPosition: "nghĩa_vụ", reflection: "Reflecting on duty." },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty revisedPosition", () => {
      const result = rethinkScenarioSchema.safeParse({
        params: { id: VALID_UUID },
        body: { revisedPosition: "" },
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("ScenarioService", () => {
  const service = new ScenarioService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listScenarios", () => {
    it("returns scenarios and total count", async () => {
      mockFindMany.mockResolvedValue([{ id: VALID_UUID, title: "Scenario Test" }] as any);
      mockCount.mockResolvedValue(1 as any);

      const result = await service.listScenarios({}, 1, 10);

      expect(mockFindMany).toHaveBeenCalledTimes(1);
      expect(mockCount).toHaveBeenCalledTimes(1);
      expect(result.scenarios).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe("getScenarioDetail", () => {
    it("returns scenario detail and user response if available", async () => {
      mockFindUnique
        .mockResolvedValueOnce({ id: VALID_UUID, title: "Test Title" } as any) // scenario lookup
        .mockResolvedValueOnce({ id: "response-uuid", initialPosition: "thực_dụng" } as any); // response lookup

      const result = await service.getScenarioDetail(VALID_UUID, "user-uuid");

      expect(result.title).toBe("Test Title");
      expect(result.userResponse).not.toBeNull();
      expect(result.userResponse?.id).toBe("response-uuid");
    });

    it("throws 404 if scenario does not exist", async () => {
      mockFindUnique.mockResolvedValueOnce(null);

      await expect(service.getScenarioDetail(VALID_UUID)).rejects.toThrow(
        new ScenarioError("SCENARIO_NOT_FOUND", "Không tìm thấy tình huống thực tế này", 404),
      );
    });
  });

  describe("respondScenario", () => {
    it("creates response and returns stats on happy path", async () => {
      // 1. check scenarioExists lookup -> true
      mockFindUnique.mockResolvedValueOnce({ id: VALID_UUID } as any);
      // 2. check existingResponse lookup -> null
      mockFindUnique.mockResolvedValueOnce(null);
      // 3. create response -> returns response object
      mockCreate.mockResolvedValue({ id: "res-uuid", initialPosition: "đức_hạnh" } as any);
      // 4. groupBy for stats -> returns stats array
      mockGroupBy.mockResolvedValue([
        { initialPosition: "đức_hạnh", _count: { _all: 3 } },
        { initialPosition: "quan_tâm", _count: { _all: 1 } },
      ]);

      const result = await service.respondScenario(VALID_UUID, "user-uuid", {
        initialPosition: "đức_hạnh",
        reasoning: "Reason",
      });

      expect(result.response.id).toBe("res-uuid");
      expect(result.perspectiveStats).toHaveLength(2);
      expect(result.perspectiveStats[0]).toEqual({
        perspectiveType: "đức_hạnh",
        count: 3,
        percentage: 75,
      });
    });

    it("throws 409 Conflict if response already exists", async () => {
      // 1. check scenarioExists lookup -> true
      mockFindUnique.mockResolvedValueOnce({ id: VALID_UUID } as any);
      // 2. check existingResponse lookup -> true
      mockFindUnique.mockResolvedValueOnce({ id: "existing-res" } as any);

      await expect(
        service.respondScenario(VALID_UUID, "user-uuid", {
          initialPosition: "đức_hạnh",
        }),
      ).rejects.toThrow(
        new ScenarioError(
          "SCENARIO_RESPONSE_ALREADY_EXISTS",
          "Bạn đã phản hồi lập trường cho tình huống này rồi. Hãy dùng tính năng cập nhật lập trường (rethink).",
          409,
        ),
      );
    });
  });

  describe("rethinkScenario", () => {
    it("updates response on happy path", async () => {
      // 1. check scenarioExists lookup -> true
      mockFindUnique.mockResolvedValueOnce({ id: VALID_UUID } as any);
      // 2. check existingResponse lookup -> returns existing response
      mockFindUnique.mockResolvedValueOnce({ id: "existing-res", userId: "user-uuid" } as any);
      // 3. update response
      mockUpdate.mockResolvedValue({
        id: "existing-res",
        revisedPosition: "quan_tâm",
        reflection: "Reflection text",
      } as any);

      const result = await service.rethinkScenario(VALID_UUID, "user-uuid", {
        revisedPosition: "quan_tâm",
        reflection: "Reflection text",
      });

      expect(result.revisedPosition).toBe("quan_tâm");
      expect(result.reflection).toBe("Reflection text");
    });

    it("throws 404 if response does not exist yet", async () => {
      // 1. check scenarioExists lookup -> true
      mockFindUnique.mockResolvedValueOnce({ id: VALID_UUID } as any);
      // 2. check existingResponse lookup -> null
      mockFindUnique.mockResolvedValueOnce(null);

      await expect(
        service.rethinkScenario(VALID_UUID, "user-uuid", {
          revisedPosition: "quan_tâm",
        }),
      ).rejects.toThrow(
        new ScenarioError(
          "SCENARIO_RESPONSE_NOT_FOUND",
          "Bạn chưa thực hiện phản hồi ban đầu cho tình huống này. Vui lòng phản hồi trước.",
          404,
        ),
      );
    });
  });
});

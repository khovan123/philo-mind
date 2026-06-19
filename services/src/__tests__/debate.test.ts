import { jest } from "@jest/globals";
import {
  listDebatesSchema,
  createArgumentSchema,
  voteArgumentSchema,
  createCommentSchema,
} from "../validators/debate.validator.js";

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
const mockUpsert = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    debate: {
      findMany: mockFindMany,
      count: mockCount,
      findUnique: mockFindUnique,
    },
    debateArgument: {
      create: mockCreate,
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
    debateVote: {
      upsert: mockUpsert,
      count: mockCount,
    },
    debateComment: {
      create: mockCreate,
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
  ActivityType: {
    POST_ARGUMENT: "POST_ARGUMENT",
  },
}));

const { DebateService, DebateError } = await import("../services/debate.service.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("Debate Validator Schemas", () => {
  describe("listDebatesSchema", () => {
    it("accepts valid list query", () => {
      const result = listDebatesSchema.safeParse({
        query: { topicId: VALID_UUID, stance: "FOR", page: "1", limit: "10" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid topicId uuid", () => {
      const result = listDebatesSchema.safeParse({
        query: { topicId: "not-a-uuid" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createArgumentSchema", () => {
    it("accepts a valid argument payload", () => {
      const result = createArgumentSchema.safeParse({
        params: { id: VALID_UUID },
        body: { stance: "FOR", content: "This is a great point.", sources: "Book A" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty content", () => {
      const result = createArgumentSchema.safeParse({
        params: { id: VALID_UUID },
        body: { stance: "AGAINST", content: "   " },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("voteArgumentSchema", () => {
    it("accepts a valid vote payload", () => {
      const result = voteArgumentSchema.safeParse({
        params: { id: VALID_UUID },
        body: { value: "UP" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid vote value", () => {
      const result = voteArgumentSchema.safeParse({
        params: { id: VALID_UUID },
        body: { value: "INVALID" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createCommentSchema", () => {
    it("accepts a valid comment payload", () => {
      const result = createCommentSchema.safeParse({
        params: { id: VALID_UUID },
        body: { commentText: "I agree with this argument." },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty comment text", () => {
      const result = createCommentSchema.safeParse({
        params: { id: VALID_UUID },
        body: { commentText: "" },
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("DebateService", () => {
  const service = new DebateService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listDebates", () => {
    it("returns debates with stance counts and total count", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: VALID_UUID,
          title: "Debate Test",
          description: "Desc",
          status: "OPEN",
          createdAt: new Date(),
          arguments: [{ stance: "AGREE" }, { stance: "DISAGREE" }],
        },
      ] as any);
      mockCount.mockResolvedValue(1 as any);

      const result = await service.listDebates({}, 1, 10);

      expect(mockFindMany).toHaveBeenCalledTimes(1);
      expect(result.debates).toHaveLength(1);
      expect(result.debates[0].counts).toEqual({
        total: 2,
        agree: 1,
        disagree: 1,
        neutral: 0,
        alternative: 0,
      });
      expect(result.total).toBe(1);
    });
  });

  describe("getDebateDetail", () => {
    it("returns debate detail with formatted arguments", async () => {
      mockFindUnique.mockResolvedValue({
        id: VALID_UUID,
        title: "Test Title",
        description: "Desc",
        status: "OPEN",
        createdAt: new Date(),
        arguments: [
          {
            id: "arg-uuid",
            debateId: VALID_UUID,
            userId: "user-a",
            stance: "AGREE",
            argumentText: "Agree text",
            voteCount: 5,
            createdAt: new Date(),
            user: { id: "user-a", fullName: "User A" },
            comments: [],
            votes: [{ userId: "user-a", value: "UP" }],
          },
        ],
      } as any);

      const result = await service.getDebateDetail(VALID_UUID, "user-a");

      expect(result.title).toBe("Test Title");
      expect(result.arguments).toHaveLength(1);
      expect(result.arguments[0].userVote).toBe("UP");
      expect(result.arguments[0].voteStats).toEqual({ up: 1, down: 0 });
    });

    it("throws 404 if debate not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(service.getDebateDetail(VALID_UUID)).rejects.toThrow(
        new DebateError("DEBATE_NOT_FOUND", "Không tìm thấy phiên tranh luận này", 404),
      );
    });
  });

  describe("createArgument", () => {
    it("creates argument successfully", async () => {
      mockFindUnique.mockResolvedValue({ id: VALID_UUID, status: "OPEN" } as any);
      mockCreate.mockResolvedValue({
        id: "new-arg-uuid",
        stance: "AGREE",
        argumentText: "Text",
        user: { id: "user-uuid", fullName: "User Name" },
      } as any);

      const result = await service.createArgument(VALID_UUID, "user-uuid", {
        stance: "AGREE" as any,
        content: "My argument content",
      });

      expect(result.id).toBe("new-arg-uuid");
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it("throws 400 if debate is closed", async () => {
      mockFindUnique.mockResolvedValue({ id: VALID_UUID, status: "CLOSED" } as any);

      await expect(
        service.createArgument(VALID_UUID, "user-uuid", {
          stance: "AGREE" as any,
          content: "Content",
        }),
      ).rejects.toThrow(new DebateError("DEBATE_CLOSED", "Phiên tranh luận này đã đóng", 400));
    });
  });

  describe("voteArgument", () => {
    it("votes successfully and updates voteCount", async () => {
      mockFindUnique.mockResolvedValue({ id: "arg-uuid" } as any);
      mockUpsert.mockResolvedValue({} as any);
      mockCount
        .mockResolvedValueOnce(3) // UP votes
        .mockResolvedValueOnce(1); // DOWN votes
      mockUpdate.mockResolvedValue({ id: "arg-uuid", voteCount: 2 } as any);

      const result = await service.voteArgument("arg-uuid", "user-uuid", "UP" as any);

      expect(result.voteCount).toBe(2);
      expect(result.userVote).toBe("UP");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { voteCount: 2 },
        }),
      );
    });
  });

  describe("createComment", () => {
    it("creates comment successfully", async () => {
      mockFindUnique.mockResolvedValue({ id: "arg-uuid" } as any);
      mockCreate.mockResolvedValue({
        id: "comm-uuid",
        commentText: "Comment text",
        user: { id: "user-uuid", fullName: "User" },
      } as any);

      const result = await service.createComment("arg-uuid", "user-uuid", "Comment text");

      expect(result.id).toBe("comm-uuid");
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });
});

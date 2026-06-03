import { jest } from "@jest/globals";

// ── Mock env ────────────────────────────────────────────────────
jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    PORT: 3001,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci",
    JWT_SECRET: "test-secret-at-least-32-characters-long",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    LOG_LEVEL: "error",
  },
}));

// ── Mock Prisma ─────────────────────────────────────────────────
const mockReportCreate = jest.fn() as any;
const mockReportFindUnique = jest.fn() as any;
const mockReportFindMany = jest.fn() as any;
const mockReportCount = jest.fn() as any;
const mockReportUpdate = jest.fn() as any;

const mockModerationActionCreate = jest.fn() as any;

const mockTransaction = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    report: {
      create: mockReportCreate,
      findUnique: mockReportFindUnique,
      findMany: mockReportFindMany,
      count: mockReportCount,
      update: mockReportUpdate,
    },
    moderationAction: {
      create: mockModerationActionCreate,
    },
    $transaction: mockTransaction,
  },
}));

// Mock the enum imports
jest.unstable_mockModule("../prisma/generated/enums.js", () => ({
  ReportStatus: {
    PENDING: "PENDING",
    RESOLVED: "RESOLVED",
    REJECTED: "REJECTED",
  },
  ModerationActionType: {
    HIDE: "HIDE",
    DELETE: "DELETE",
    WARN: "WARN",
    BAN: "BAN",
    RESTORE: "RESTORE",
    NO_ACTION: "NO_ACTION",
  },
}));

const { ModerationService } = await import("../services/moderation.service.js");

const USER_ID = "660e8400-e29b-41d4-a716-446655440099";
const REPORT_ID = "770e8400-e29b-41d4-a716-446655440011";
const MODERATOR_ID = "880e8400-e29b-41d4-a716-446655440022";
const TARGET_ID = "990e8400-e29b-41d4-a716-446655440033";

// ── T-A18: ModerationService Unit Tests ─────────────────────────

describe("T-A18: ModerationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("autoFlagContent", () => {
    it("flags content containing offensive words", async () => {
      mockReportCreate.mockResolvedValue({ id: REPORT_ID });

      const flagged = await ModerationService.autoFlagContent(
        USER_ID,
        "SHORT_LESSON" as any,
        TARGET_ID,
        "Đây là nội dung chửi thề và xúc phạm người khác",
      );

      expect(flagged).toBe(true);
      expect(mockReportCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          reporterId: USER_ID,
          targetType: "SHORT_LESSON",
          targetId: TARGET_ID,
          status: "PENDING",
          reason: expect.stringContaining("chửi thề"),
        }),
      });
    });

    it("does not flag clean content", async () => {
      const flagged = await ModerationService.autoFlagContent(
        USER_ID,
        "SHORT_LESSON" as any,
        TARGET_ID,
        "Đây là nội dung sạch sẽ và hữu ích",
      );

      expect(flagged).toBe(false);
      expect(mockReportCreate).not.toHaveBeenCalled();
    });

    it("returns false for empty content", async () => {
      const flagged = await ModerationService.autoFlagContent(
        USER_ID,
        "LESSON" as any,
        TARGET_ID,
        "",
      );
      expect(flagged).toBe(false);
    });

    it("is case-insensitive", async () => {
      mockReportCreate.mockResolvedValue({ id: REPORT_ID });

      const flagged = await ModerationService.autoFlagContent(
        USER_ID,
        "DEBATE" as any,
        TARGET_ID,
        "This contains HATEFUL speech",
      );

      expect(flagged).toBe(true);
    });

    it("detects multiple offensive words", async () => {
      mockReportCreate.mockResolvedValue({ id: REPORT_ID });

      await ModerationService.autoFlagContent(
        USER_ID,
        "DEBATE" as any,
        TARGET_ID,
        "Bạn thật ngu ngốc và khốn nạn",
      );

      const reason = mockReportCreate.mock.calls[0][0].data.reason;
      expect(reason).toContain("ngu ngốc");
      expect(reason).toContain("khốn nạn");
    });
  });

  describe("createReport", () => {
    it("creates a manual report", async () => {
      const created = {
        id: REPORT_ID,
        reporterId: USER_ID,
        targetType: "LESSON",
        targetId: TARGET_ID,
        reason: "Inappropriate content",
        status: "PENDING",
      };
      mockReportCreate.mockResolvedValue(created);

      const result = await ModerationService.createReport(
        USER_ID,
        "LESSON" as any,
        TARGET_ID,
        "Inappropriate content",
      );

      expect(result).toEqual(created);
      expect(mockReportCreate).toHaveBeenCalledWith({
        data: {
          reporterId: USER_ID,
          targetType: "LESSON",
          targetId: TARGET_ID,
          reason: "Inappropriate content",
          status: "PENDING",
        },
      });
    });
  });

  describe("getReports", () => {
    it("returns paginated reports with filters", async () => {
      const mockReports = [{ id: REPORT_ID, status: "PENDING" }];
      mockTransaction.mockResolvedValue([mockReports, 1]);

      const result = await ModerationService.getReports("PENDING" as any, undefined, 1, 10);

      expect(result.reports).toEqual(mockReports);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
    });

    it("returns all reports when no filters", async () => {
      mockTransaction.mockResolvedValue([[], 0]);

      const result = await ModerationService.getReports();
      expect(result.reports).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });

    it("calculates totalPages correctly", async () => {
      mockTransaction.mockResolvedValue([[], 25]);

      const result = await ModerationService.getReports(undefined, undefined, 1, 10);
      expect(result.pagination.totalPages).toBe(3);
    });
  });

  describe("takeAction", () => {
    it("applies action and resolves report", async () => {
      mockReportFindUnique.mockResolvedValue({ id: REPORT_ID, status: "PENDING" });
      mockModerationActionCreate.mockResolvedValue({ id: "action-1" });
      mockReportUpdate.mockResolvedValue({ id: REPORT_ID, status: "RESOLVED" });

      const result = await ModerationService.takeAction(
        REPORT_ID,
        MODERATOR_ID,
        "HIDE" as any,
        "Hiding inappropriate content",
      );

      expect(result.reportId).toBe(REPORT_ID);
      expect(result.actionType).toBe("HIDE");
      expect(result.status).toBe("RESOLVED");
    });

    it("sets status to REJECTED for NO_ACTION", async () => {
      mockReportFindUnique.mockResolvedValue({ id: REPORT_ID, status: "PENDING" });
      mockModerationActionCreate.mockResolvedValue({ id: "action-2" });
      mockReportUpdate.mockResolvedValue({ id: REPORT_ID, status: "REJECTED" });

      const result = await ModerationService.takeAction(
        REPORT_ID,
        MODERATOR_ID,
        "NO_ACTION" as any,
      );

      expect(result.status).toBe("REJECTED");
      expect(mockReportUpdate).toHaveBeenCalledWith({
        where: { id: REPORT_ID },
        data: { status: "REJECTED" },
      });
    });

    it("throws when report not found", async () => {
      mockReportFindUnique.mockResolvedValue(null);

      await expect(
        ModerationService.takeAction(REPORT_ID, MODERATOR_ID, "HIDE" as any),
      ).rejects.toThrow(`Report not found with id: ${REPORT_ID}`);
    });

    it("stores note in moderation action", async () => {
      mockReportFindUnique.mockResolvedValue({ id: REPORT_ID });
      mockModerationActionCreate.mockResolvedValue({ id: "action-3" });
      mockReportUpdate.mockResolvedValue({});

      await ModerationService.takeAction(
        REPORT_ID,
        MODERATOR_ID,
        "WARN" as any,
        "First warning issued",
      );

      expect(mockModerationActionCreate).toHaveBeenCalledWith({
        data: {
          reportId: REPORT_ID,
          moderatorId: MODERATOR_ID,
          actionType: "WARN",
          note: "First warning issued",
        },
      });
    });
  });
});

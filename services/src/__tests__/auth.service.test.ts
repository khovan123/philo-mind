import { jest } from "@jest/globals";

// Mock env before any module that imports it runs process.exit
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

const mockTransaction = jest.fn() as any;
const mockUserUpdate = jest.fn((args) => args) as any;
const mockSessionUpdateMany = jest.fn((args) => args) as any;
const mockTokenUpdateMany = jest.fn((args) => args) as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    $transaction: mockTransaction,
    user: {
      update: mockUserUpdate,
    },
    userSession: {
      updateMany: mockSessionUpdateMany,
    },
    refreshToken: {
      updateMany: mockTokenUpdateMany,
    },
  },
}));

const { AuthService } = await import("../services/auth.service.js");

describe("AuthService.deleteAccount", () => {
  beforeEach(() => {
    mockTransaction.mockReset();
  });

  it("soft deletes the user and revokes sessions and refresh tokens", async () => {
    mockTransaction.mockResolvedValue([{}, {}, {}] as any);

    const service = new AuthService();
    await service.deleteAccount("test-user-id");

    expect(mockTransaction).toHaveBeenCalledTimes(1);
    const transactionArg = mockTransaction.mock.calls[0][0] as any;
    expect(Array.isArray(transactionArg)).toBe(true);
    expect(transactionArg).toHaveLength(3);

    expect(transactionArg[0]).toMatchObject({
      where: { id: "test-user-id" },
      data: expect.objectContaining({
        isActive: false,
        deletedAt: expect.any(Date),
        deletionRequestedAt: expect.any(Date),
      }),
    });

    expect(transactionArg[1]).toMatchObject({
      where: { userId: "test-user-id", status: "ACTIVE" },
      data: { status: "REVOKED", revokedAt: expect.any(Date) },
    });

    expect(transactionArg[2]).toMatchObject({
      where: { userId: "test-user-id", revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });
});

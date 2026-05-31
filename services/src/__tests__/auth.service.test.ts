import { jest } from "@jest/globals";

const mockTransaction = jest.fn();

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    $transaction: mockTransaction,
  },
}));

const { AuthService } = await import("../services/auth.service.js");

describe("AuthService.deleteAccount", () => {
  beforeEach(() => {
    mockTransaction.mockReset();
  });

  it("soft deletes the user and revokes sessions and refresh tokens", async () => {
    mockTransaction.mockResolvedValue([{}, {}, {}]);

    const service = new AuthService();
    await service.deleteAccount("test-user-id");

    expect(mockTransaction).toHaveBeenCalledTimes(1);
    const transactionArg = mockTransaction.mock.calls[0][0];
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

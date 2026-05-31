import { jest } from "@jest/globals";

// ── Prisma mocks ───────────────────────────────────────────
const mockCreate = jest.fn() as any;
const mockFindFirst = jest.fn() as any;
const mockUpdate = jest.fn() as any;
const mockUserFindUnique = jest.fn() as any;
const mockUserUpdate = jest.fn() as any;
const mockSessionUpdateMany = jest.fn() as any;
const mockTokenUpdateMany = jest.fn() as any;
const mockTransaction = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    passwordReset: {
      create: mockCreate,
      findFirst: mockFindFirst,
      update: mockUpdate,
    },
    user: {
      findUnique: mockUserFindUnique,
      update: mockUserUpdate,
    },
    userSession: { updateMany: mockSessionUpdateMany },
    refreshToken: { updateMany: mockTokenUpdateMany },
    $transaction: mockTransaction,
  },
}));

jest.unstable_mockModule("../utils/email.js", () => ({
  sendResetEmail: (jest.fn() as any).mockResolvedValue(undefined),
}));

const { AuthService, AuthError } = await import("../services/auth.service.js");

// ── Helpers ────────────────────────────────────────────────
import crypto from "crypto";
function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

const FUTURE = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now
const PAST = new Date(Date.now() - 1); // already expired

// ── sendPasswordReset ──────────────────────────────────────
describe("AuthService.sendPasswordReset", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockUserFindUnique.mockReset();
  });

  it("creates a PasswordReset record when email exists", async () => {
    mockUserFindUnique.mockResolvedValue({ id: "user-1" } as any);
    mockCreate.mockResolvedValue({} as any);

    const svc = new AuthService();
    await svc.sendPasswordReset("user@example.com");

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const data = mockCreate.mock.calls[0][0].data;
    expect(data.userId).toBe("user-1");
    expect(data.email).toBe("user@example.com");
    expect(data.codeHash).toBeTruthy();
    expect(data.tokenHash).toBeTruthy();
    expect(data.expiresAt).toBeInstanceOf(Date);
  });

  it("creates a PasswordReset record even when email does not exist (anti-enumeration)", async () => {
    mockUserFindUnique.mockResolvedValue(null as any);
    mockCreate.mockResolvedValue({} as any);

    const svc = new AuthService();
    await svc.sendPasswordReset("noone@example.com");

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const data = mockCreate.mock.calls[0][0].data;
    expect(data.userId).toBeNull();
  });

  it("does NOT include the resetToken in the email (security)", async () => {
    mockUserFindUnique.mockResolvedValue(null as any);
    mockCreate.mockResolvedValue({} as any);

    const { sendResetEmail } = await import("../utils/email.js");
    (sendResetEmail as jest.Mock).mockClear();

    const svc = new AuthService();
    await svc.sendPasswordReset("test@example.com");

    // sendResetEmail should be called with exactly 2 args: (to, code)
    expect(sendResetEmail).toHaveBeenCalledWith(
      "test@example.com",
      expect.stringMatching(/^\d{6}$/),
    );
  });
});

// ── verifyPasswordReset ────────────────────────────────────
describe("AuthService.verifyPasswordReset", () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
    mockUpdate.mockReset();
  });

  it("throws RESET_NOT_FOUND when no valid record exists", async () => {
    mockFindFirst.mockResolvedValue(null as any);

    const svc = new AuthService();
    await expect(svc.verifyPasswordReset("x@x.com", "123456")).rejects.toMatchObject({
      code: "RESET_NOT_FOUND",
    });
  });

  it("throws OTP_MAX_ATTEMPTS when attempts >= 5", async () => {
    mockFindFirst.mockResolvedValue({
      id: "r1",
      codeHash: sha256("111111"),
      attempts: 5,
      expiresAt: FUTURE,
    } as any);

    const svc = new AuthService();
    await expect(svc.verifyPasswordReset("x@x.com", "111111")).rejects.toMatchObject({
      code: "OTP_MAX_ATTEMPTS",
    });
    // Should NOT increment attempts further
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("increments attempts and throws INVALID_OTP on wrong OTP", async () => {
    mockFindFirst.mockResolvedValue({
      id: "r1",
      codeHash: sha256("111111"),
      attempts: 2,
      expiresAt: FUTURE,
    } as any);
    mockUpdate.mockResolvedValue({} as any);

    const svc = new AuthService();
    await expect(svc.verifyPasswordReset("x@x.com", "999999")).rejects.toMatchObject({
      code: "INVALID_OTP",
    });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { attempts: { increment: 1 } } }),
    );
  });

  it("returns a new resetToken on correct OTP", async () => {
    const otp = "654321";
    mockFindFirst.mockResolvedValue({
      id: "r1",
      codeHash: sha256(otp),
      attempts: 0,
      expiresAt: FUTURE,
    } as any);
    mockUpdate.mockResolvedValue({} as any);

    const svc = new AuthService();
    const result = await svc.verifyPasswordReset("x@x.com", otp);

    expect(result).toHaveProperty("resetToken");
    expect(typeof result.resetToken).toBe("string");
    expect(result.resetToken.length).toBeGreaterThan(8);
    // tokenHash in DB should be updated
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "r1" },
        data: expect.objectContaining({ tokenHash: expect.any(String) }),
      }),
    );
  });
});

// ── resetPassword ──────────────────────────────────────────
describe("AuthService.resetPassword", () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
    mockTransaction.mockReset();
    mockUserUpdate.mockReset();
    mockSessionUpdateMany.mockReset();
    mockTokenUpdateMany.mockReset();
  });

  it("throws INVALID_RESET when no valid record found", async () => {
    mockFindFirst.mockResolvedValue(null as any);

    const svc = new AuthService();
    await expect(svc.resetPassword("x@x.com", "bad-token", "newpass123")).rejects.toMatchObject({
      code: "INVALID_RESET",
    });
  });

  it("throws INVALID_RESET when record has no userId (unknown email)", async () => {
    const token = crypto.randomUUID();
    mockFindFirst.mockResolvedValue({
      id: "r1",
      userId: null,
      tokenHash: sha256(token),
      expiresAt: FUTURE,
      usedAt: null,
    } as any);

    const svc = new AuthService();
    await expect(svc.resetPassword("x@x.com", token, "newpass123")).rejects.toMatchObject({
      code: "INVALID_RESET",
    });
  });

  it("updates password, marks reset used, and revokes sessions in a transaction", async () => {
    const token = crypto.randomUUID();
    mockFindFirst.mockResolvedValue({
      id: "r1",
      userId: "user-1",
      tokenHash: sha256(token),
      expiresAt: FUTURE,
      usedAt: null,
    } as any);
    mockTransaction.mockResolvedValue([{}, {}, {}, {}] as any);

    // Capture args passed to each prisma call so we can assert on them
    mockUserUpdate.mockImplementation((args: any) => args);
    mockUpdate.mockImplementation((args: any) => args);
    mockSessionUpdateMany.mockImplementation((args: any) => args);
    mockTokenUpdateMany.mockImplementation((args: any) => args);

    const svc = new AuthService();
    await svc.resetPassword("x@x.com", token, "newSecurePass1");

    expect(mockTransaction).toHaveBeenCalledTimes(1);

    // Verify each individual prisma call was made with correct args
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-1" },
        data: { passwordHash: expect.any(String) },
      }),
    );
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "r1" }, data: { usedAt: expect.any(Date) } }),
    );
    expect(mockSessionUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1", status: "ACTIVE" } }),
    );
    expect(mockTokenUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1", revokedAt: null } }),
    );
  });
});

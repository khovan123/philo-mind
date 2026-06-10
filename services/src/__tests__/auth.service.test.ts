import { jest } from "@jest/globals";

// Mock env before any module that imports it runs process.exit
jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    PORT: 3001,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci",
    JWT_SECRET: "test-secret-at-least-32-characters-long",
    JWT_REFRESH_SECRET: "test-refresh-secret-at-least-32-characters-long-refresh",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    LOG_LEVEL: "error",
  },
}));

// Declare mocks for Prisma
const mockTransaction = jest.fn() as any;
const mockUserFindUnique = jest.fn() as any;
const mockUserCreate = jest.fn() as any;
const mockUserUpdate = jest.fn() as any;
const mockSessionCreate = jest.fn() as any;
const mockSessionUpdate = jest.fn() as any;
const mockSessionUpdateMany = jest.fn() as any;
const mockTokenFindUnique = jest.fn() as any;
const mockTokenCreate = jest.fn() as any;
const mockTokenUpdate = jest.fn() as any;
const mockTokenUpdateMany = jest.fn() as any;
const mockResetCreate = jest.fn() as any;
const mockResetFindFirst = jest.fn() as any;
const mockResetUpdate = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    $transaction: mockTransaction,
    user: {
      findUnique: mockUserFindUnique,
      create: mockUserCreate,
      update: mockUserUpdate,
    },
    userSession: {
      create: mockSessionCreate,
      update: mockSessionUpdate,
      updateMany: mockSessionUpdateMany,
    },
    refreshToken: {
      findUnique: mockTokenFindUnique,
      create: mockTokenCreate,
      update: mockTokenUpdate,
      updateMany: mockTokenUpdateMany,
    },
    passwordReset: {
      create: mockResetCreate,
      findFirst: mockResetFindFirst,
      update: mockResetUpdate,
    },
  },
}));

// Declare mocks for other utilities
const mockSendResetEmail = jest.fn() as any;
jest.unstable_mockModule("../utils/email.js", () => ({
  sendResetEmail: mockSendResetEmail,
}));

// Mock bcrypt to avoid slow password hashing
const mockHash = jest.fn() as any;
const mockCompare = jest.fn() as any;
jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: mockHash,
    compare: mockCompare,
  },
}));

// Mock jwt utilities to isolate verify & generate
const mockVerifyRefreshToken = jest.fn() as any;
const mockGenerateTokenPair = jest.fn() as any;
jest.unstable_mockModule("../utils/jwt.js", () => ({
  verifyRefreshToken: mockVerifyRefreshToken,
  generateTokenPair: mockGenerateTokenPair,
  verifyAccessToken: jest.fn(),
  decodeToken: jest.fn(),
}));

const { AuthService } = await import("../services/auth.service.js");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("registers a user successfully and returns user and tokens", async () => {
      mockUserFindUnique.mockResolvedValue(null);
      mockHash.mockResolvedValue("hashed-password" as any);

      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
        avatarUrl: null,
        createdAt: new Date(),
      };
      mockUserCreate.mockResolvedValue(mockUser);

      mockSessionCreate.mockResolvedValue({ id: "session-123" } as any);
      mockTokenCreate.mockResolvedValue({ id: "token-123" } as any);
      mockGenerateTokenPair.mockReturnValue({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      });

      const service = new AuthService();
      const result = await service.register({
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      });

      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(mockHash).toHaveBeenCalledWith("password123", 12);
      expect(mockUserCreate).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          passwordHash: "hashed-password",
          fullName: "Test User",
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
      });
      expect(result.user).toEqual(mockUser);
      expect(result.tokens).toHaveProperty("accessToken");
      expect(result.tokens).toHaveProperty("refreshToken");
    });

    it("throws AuthError (409) if email already exists", async () => {
      mockUserFindUnique.mockResolvedValue({ id: "existing-id" } as any);

      const service = new AuthService();
      await expect(
        service.register({
          email: "test@example.com",
          password: "password123",
          fullName: "Test User",
        }),
      ).rejects.toThrow(
        expect.objectContaining({
          code: "EMAIL_EXISTS",
          statusCode: 409,
        }),
      );
    });
  });

  describe("login", () => {
    it("logs in successfully with valid credentials", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
        avatarUrl: null,
        passwordHash: "hashed-password",
        isActive: true,
        createdAt: new Date(),
      };
      mockUserFindUnique.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true as any);
      mockSessionCreate.mockResolvedValue({ id: "session-123" } as any);
      mockTokenCreate.mockResolvedValue({ id: "token-123" } as any);
      mockGenerateTokenPair.mockReturnValue({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      });

      const service = new AuthService();
      const result = await service.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        select: expect.any(Object),
      });
      expect(mockCompare).toHaveBeenCalledWith("password123", "hashed-password");
      expect(result.user).not.toHaveProperty("passwordHash");
      expect(result.user.email).toBe("test@example.com");
      expect(result.tokens).toHaveProperty("accessToken");
    });

    it("throws AuthError (401) if user not found", async () => {
      mockUserFindUnique.mockResolvedValue(null);

      const service = new AuthService();
      await expect(
        service.login({ email: "test@example.com", password: "password123" }),
      ).rejects.toThrow(
        expect.objectContaining({
          code: "INVALID_CREDENTIALS",
          statusCode: 401,
        }),
      );
    });

    it("throws AuthError (403) if account is inactive", async () => {
      mockUserFindUnique.mockResolvedValue({
        email: "test@example.com",
        isActive: false,
      } as any);

      const service = new AuthService();
      await expect(
        service.login({ email: "test@example.com", password: "password123" }),
      ).rejects.toThrow(
        expect.objectContaining({
          code: "ACCOUNT_DISABLED",
          statusCode: 403,
        }),
      );
    });

    it("throws AuthError (401) if password check fails", async () => {
      mockUserFindUnique.mockResolvedValue({
        email: "test@example.com",
        isActive: true,
        passwordHash: "hashed-password",
      } as any);
      mockCompare.mockResolvedValue(false as any);

      const service = new AuthService();
      await expect(
        service.login({ email: "test@example.com", password: "wrong-password" }),
      ).rejects.toThrow(
        expect.objectContaining({
          code: "INVALID_CREDENTIALS",
          statusCode: 401,
        }),
      );
    });
  });

  describe("refreshToken", () => {
    it("rotates refresh token successfully", async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: "user-123", role: "USER" });
      mockTokenFindUnique.mockResolvedValue({
        id: "token-1",
        sessionId: "session-1",
        revokedAt: null,
        session: { status: "ACTIVE" },
      } as any);
      mockTokenUpdate.mockResolvedValue({} as any);
      mockGenerateTokenPair.mockReturnValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });
      mockTokenCreate.mockResolvedValue({} as any);

      const service = new AuthService();
      const result = await service.refreshToken("old-refresh-token");

      expect(mockVerifyRefreshToken).toHaveBeenCalledWith("old-refresh-token");
      expect(mockTokenFindUnique).toHaveBeenCalled();
      expect(mockTokenUpdate).toHaveBeenCalledWith({
        where: { id: "token-1" },
        data: { revokedAt: expect.any(Date) },
      });
      expect(mockTokenCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-123",
          sessionId: "session-1",
        }),
      });
      expect(result.tokens.accessToken).toBe("new-access-token");
      expect(result.tokens.refreshToken).toBe("new-refresh-token");
    });

    it("throws AuthError (401) if JWT verification fails", async () => {
      mockVerifyRefreshToken.mockImplementation(() => {
        throw new Error("Invalid JWT");
      });

      const service = new AuthService();
      await expect(service.refreshToken("invalid-token")).rejects.toThrow(
        expect.objectContaining({
          code: "INVALID_REFRESH_TOKEN",
          statusCode: 401,
        }),
      );
    });

    it("throws AuthError (401) if token is already revoked or not found", async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: "user-123", role: "USER" });
      mockTokenFindUnique.mockResolvedValue({
        id: "token-1",
        revokedAt: new Date(),
      } as any);

      const service = new AuthService();
      await expect(service.refreshToken("revoked-token")).rejects.toThrow(
        expect.objectContaining({
          code: "TOKEN_REVOKED",
          statusCode: 401,
        }),
      );
    });

    it("throws AuthError (401) if session is inactive", async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: "user-123", role: "USER" });
      mockTokenFindUnique.mockResolvedValue({
        id: "token-1",
        revokedAt: null,
        session: { status: "REVOKED" },
      } as any);

      const service = new AuthService();
      await expect(service.refreshToken("inactive-session-token")).rejects.toThrow(
        expect.objectContaining({
          code: "SESSION_INACTIVE",
          statusCode: 401,
        }),
      );
    });
  });

  describe("logout", () => {
    it("revokes specific session and refresh tokens if sessionId is provided", async () => {
      mockSessionUpdate.mockResolvedValue({} as any);
      mockTokenUpdateMany.mockResolvedValue({} as any);

      const service = new AuthService();
      await service.logout("user-123", "session-123");

      expect(mockSessionUpdate).toHaveBeenCalledWith({
        where: { id: "session-123", userId: "user-123" },
        data: { status: "REVOKED", revokedAt: expect.any(Date) },
      });
      expect(mockTokenUpdateMany).toHaveBeenCalledWith({
        where: { sessionId: "session-123", revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it("revokes all sessions and refresh tokens if no sessionId is provided", async () => {
      mockSessionUpdateMany.mockResolvedValue({} as any);
      mockTokenUpdateMany.mockResolvedValue({} as any);

      const service = new AuthService();
      await service.logout("user-123");

      expect(mockSessionUpdateMany).toHaveBeenCalledWith({
        where: { userId: "user-123", status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: expect.any(Date) },
      });
      expect(mockTokenUpdateMany).toHaveBeenCalledWith({
        where: { userId: "user-123", revokedAt: null },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe("deleteAccount", () => {
    it("soft deletes the user and revokes sessions and refresh tokens", async () => {
      mockUserUpdate.mockImplementation((args: any) => args as any);
      mockSessionUpdateMany.mockImplementation((args: any) => args as any);
      mockTokenUpdateMany.mockImplementation((args: any) => args as any);
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

  describe("sendPasswordReset", () => {
    it("creates a password reset record and sends email (user exists)", async () => {
      mockUserFindUnique.mockResolvedValue({ id: "user-123" } as any);
      mockResetCreate.mockResolvedValue({} as any);
      mockSendResetEmail.mockResolvedValue({} as any);

      const service = new AuthService();
      await service.sendPasswordReset("user@example.com");

      expect(mockUserFindUnique).toHaveBeenCalledWith({ where: { email: "user@example.com" } });
      expect(mockResetCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-123",
          email: "user@example.com",
          codeHash: expect.any(String),
          tokenHash: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
    });

    it("creates a password reset record even if user does not exist (mitigate email enumeration)", async () => {
      mockUserFindUnique.mockResolvedValue(null);
      mockResetCreate.mockResolvedValue({} as any);

      const service = new AuthService();
      await service.sendPasswordReset("nonexistent@example.com");

      expect(mockResetCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: null,
          email: "nonexistent@example.com",
        }),
      });
    });
  });

  describe("verifyPasswordReset", () => {
    it("verifies reset code successfully and returns fresh token", async () => {
      const otpHash = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

      mockResetFindFirst.mockResolvedValue({
        id: "reset-123",
        codeHash: otpHash,
        attempts: 0,
      } as any);
      mockResetUpdate.mockResolvedValue({} as any);

      const service = new AuthService();
      const result = await service.verifyPasswordReset("user@example.com", "123456");

      expect(mockResetFindFirst).toHaveBeenCalled();
      expect(mockResetUpdate).toHaveBeenCalledWith({
        where: { id: "reset-123" },
        data: { tokenHash: expect.any(String) },
      });
      expect(result).toHaveProperty("resetToken");
    });

    it("throws AuthError (400) if no active reset request found", async () => {
      mockResetFindFirst.mockResolvedValue(null);

      const service = new AuthService();
      await expect(service.verifyPasswordReset("user@example.com", "123456")).rejects.toThrow(
        expect.objectContaining({
          code: "RESET_NOT_FOUND",
          statusCode: 400,
        }),
      );
    });

    it("throws AuthError (429) if attempts >= 5", async () => {
      mockResetFindFirst.mockResolvedValue({
        id: "reset-123",
        attempts: 5,
      } as any);

      const service = new AuthService();
      await expect(service.verifyPasswordReset("user@example.com", "123456")).rejects.toThrow(
        expect.objectContaining({
          code: "OTP_MAX_ATTEMPTS",
          statusCode: 429,
        }),
      );
    });

    it("throws AuthError (400), increments attempts if OTP mismatches", async () => {
      mockResetFindFirst.mockResolvedValue({
        id: "reset-123",
        codeHash: "actual-hash",
        attempts: 2,
      } as any);
      mockResetUpdate.mockResolvedValue({} as any);

      const service = new AuthService();
      await expect(service.verifyPasswordReset("user@example.com", "wrong-otp")).rejects.toThrow(
        expect.objectContaining({
          code: "INVALID_OTP",
          statusCode: 400,
        }),
      );

      expect(mockResetUpdate).toHaveBeenCalledWith({
        where: { id: "reset-123" },
        data: { attempts: { increment: 1 } },
      });
    });
  });

  describe("resetPassword", () => {
    it("resets password and revokes all sessions successfully", async () => {
      mockResetFindFirst.mockResolvedValue({
        id: "reset-123",
        userId: "user-123",
      } as any);
      mockHash.mockResolvedValue("new-hashed-password" as any);
      mockTransaction.mockResolvedValue([{}, {}, {}, {}] as any);

      const service = new AuthService();
      await service.resetPassword("user@example.com", "reset-token-123", "newpassword");

      expect(mockResetFindFirst).toHaveBeenCalled();
      expect(mockHash).toHaveBeenCalledWith("newpassword", 12);
      expect(mockTransaction).toHaveBeenCalledTimes(1);
    });

    it("throws AuthError (400) if token invalid or expired", async () => {
      mockResetFindFirst.mockResolvedValue(null);

      const service = new AuthService();
      await expect(
        service.resetPassword("user@example.com", "invalid-token", "newpassword"),
      ).rejects.toThrow(
        expect.objectContaining({
          code: "INVALID_RESET",
          statusCode: 400,
        }),
      );
    });
  });

  describe("updateProfile", () => {
    it("updates full name and avatar successfully", async () => {
      const mockUpdatedUser = {
        id: "user-123",
        fullName: "Updated Name",
        avatarUrl: "new-avatar",
      };
      mockUserUpdate.mockResolvedValue(mockUpdatedUser);

      const service = new AuthService();
      const result = await service.updateProfile("user-123", {
        fullName: "Updated Name",
        avatarUrl: "new-avatar",
      });

      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: {
          fullName: "Updated Name",
          avatarUrl: "new-avatar",
        },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe("changePassword", () => {
    it("changes password successfully", async () => {
      mockUserFindUnique.mockResolvedValue({ passwordHash: "old-hashed-password" } as any);
      mockCompare.mockResolvedValue(true as any);
      mockHash.mockResolvedValue("new-hashed-password" as any);
      mockUserUpdate.mockResolvedValue({} as any);

      const service = new AuthService();
      await service.changePassword("user-123", "current-pass", "new-pass");

      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: { passwordHash: true },
      });
      expect(mockCompare).toHaveBeenCalledWith("current-pass", "old-hashed-password");
      expect(mockHash).toHaveBeenCalledWith("new-pass", 12);
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { passwordHash: "new-hashed-password" },
      });
    });

    it("throws AuthError (404) if user not found", async () => {
      mockUserFindUnique.mockResolvedValue(null);

      const service = new AuthService();
      await expect(service.changePassword("user-123", "current-pass", "new-pass")).rejects.toThrow(
        expect.objectContaining({
          code: "USER_NOT_FOUND",
          statusCode: 404,
        }),
      );
    });

    it("throws AuthError (400) if current password incorrect", async () => {
      mockUserFindUnique.mockResolvedValue({ passwordHash: "old-hashed" } as any);
      mockCompare.mockResolvedValue(false as any);

      const service = new AuthService();
      await expect(service.changePassword("user-123", "wrong-pass", "new-pass")).rejects.toThrow(
        expect.objectContaining({
          code: "INVALID_CREDENTIALS",
          statusCode: 400,
        }),
      );
    });
  });

  describe("getMe", () => {
    it("retrieves current user details successfully", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        fullName: "Test User",
      };
      mockUserFindUnique.mockResolvedValue(mockUser);

      const service = new AuthService();
      const result = await service.getMe("user-123");

      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });

    it("throws AuthError (404) if user not found", async () => {
      mockUserFindUnique.mockResolvedValue(null);

      const service = new AuthService();
      await expect(service.getMe("user-123")).rejects.toThrow(
        expect.objectContaining({
          code: "USER_NOT_FOUND",
          statusCode: 404,
        }),
      );
    });
  });
});

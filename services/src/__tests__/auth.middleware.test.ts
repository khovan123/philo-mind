import { jest } from "@jest/globals";

// Mock env before imports
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

// Mock Prisma
const mockUserFindUnique = jest.fn() as any;
jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: mockUserFindUnique,
    },
  },
}));

// Mock jwt utility
const mockVerifyAccessToken = jest.fn() as any;
jest.unstable_mockModule("../utils/jwt.js", () => ({
  verifyAccessToken: mockVerifyAccessToken,
}));

// Mock response utility
const mockSendError = jest.fn() as any;
jest.unstable_mockModule("../utils/response.js", () => ({
  sendError: mockSendError,
  sendSuccess: jest.fn(),
}));

const { authGuard, roleGuard, optionalAuth } = await import("../middleware/auth.middleware.js");

describe("Auth Middleware", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
  });

  describe("authGuard", () => {
    it("should return 401 UNAUTHORIZED if authorization header is missing", async () => {
      await authGuard(req, res, next);
      expect(mockSendError).toHaveBeenCalledWith(
        res,
        "UNAUTHORIZED",
        "Token không được cung cấp",
        401,
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 UNAUTHORIZED if authorization header does not start with Bearer", async () => {
      req.headers.authorization = "Basic token123";
      await authGuard(req, res, next);
      expect(mockSendError).toHaveBeenCalledWith(
        res,
        "UNAUTHORIZED",
        "Token không được cung cấp",
        401,
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 UNAUTHORIZED if token part is empty", async () => {
      req.headers.authorization = "Bearer ";
      await authGuard(req, res, next);
      expect(mockSendError).toHaveBeenCalledWith(res, "UNAUTHORIZED", "Token không hợp lệ", 401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 TOKEN_EXPIRED if token has expired", async () => {
      req.headers.authorization = "Bearer expired-token";
      const expiredError = new Error("Token expired");
      expiredError.name = "TokenExpiredError";
      mockVerifyAccessToken.mockImplementation(() => {
        throw expiredError;
      });

      await authGuard(req, res, next);
      expect(mockSendError).toHaveBeenCalledWith(res, "TOKEN_EXPIRED", "Token đã hết hạn", 401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 INVALID_TOKEN if token validation fails for other reasons", async () => {
      req.headers.authorization = "Bearer invalid-token";
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      await authGuard(req, res, next);
      expect(mockSendError).toHaveBeenCalledWith(res, "INVALID_TOKEN", "Token không hợp lệ", 401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 USER_NOT_FOUND if user is not found in database", async () => {
      req.headers.authorization = "Bearer valid-token";
      mockVerifyAccessToken.mockReturnValue({ sub: "user-123", email: "test@example.com" });
      mockUserFindUnique.mockResolvedValue(null);

      await authGuard(req, res, next);
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      });
      expect(mockSendError).toHaveBeenCalledWith(
        res,
        "USER_NOT_FOUND",
        "Người dùng không tồn tại",
        401,
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 USER_NOT_FOUND if user is found but inactive", async () => {
      req.headers.authorization = "Bearer valid-token";
      mockVerifyAccessToken.mockReturnValue({ sub: "user-123", email: "test@example.com" });
      mockUserFindUnique.mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        fullName: "Test User",
        role: "user",
        isActive: false,
      });

      await authGuard(req, res, next);
      expect(mockSendError).toHaveBeenCalledWith(
        res,
        "USER_NOT_FOUND",
        "Người dùng không tồn tại",
        401,
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should attach user and payload and call next() if token is valid and user is active", async () => {
      req.headers.authorization = "Bearer valid-token";
      const mockPayload = { sub: "user-123", email: "test@example.com" };
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        fullName: "Test User",
        role: "user",
        isActive: true,
      };
      mockVerifyAccessToken.mockReturnValue(mockPayload);
      mockUserFindUnique.mockResolvedValue(mockUser);

      await authGuard(req, res, next);
      expect(req.user).toEqual(mockUser);
      expect(req.tokenPayload).toEqual(mockPayload);
      expect(next).toHaveBeenCalledTimes(1);
      expect(mockSendError).not.toHaveBeenCalled();
    });

    it("should return 500 AUTH_ERROR if database query throws an error", async () => {
      req.headers.authorization = "Bearer valid-token";
      mockVerifyAccessToken.mockReturnValue({ sub: "user-123" });
      mockUserFindUnique.mockRejectedValue(new Error("Database connection error"));

      await authGuard(req, res, next);
      expect(mockSendError).toHaveBeenCalledWith(res, "AUTH_ERROR", "Lỗi xác thực", 500);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("roleGuard", () => {
    it("should return 401 UNAUTHORIZED if user is not attached to request", () => {
      const guard = roleGuard("admin");
      guard(req, res, next);

      expect(mockSendError).toHaveBeenCalledWith(res, "UNAUTHORIZED", "Chưa xác thực", 401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 FORBIDDEN if user role is not permitted", () => {
      req.user = { id: "user-123", role: "user" };
      const guard = roleGuard("admin", "moderator");
      guard(req, res, next);

      expect(mockSendError).toHaveBeenCalledWith(
        res,
        "FORBIDDEN",
        "Bạn không có quyền truy cập tài nguyên này",
        403,
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() if user role is permitted", () => {
      req.user = { id: "user-123", role: "admin" };
      const guard = roleGuard("admin", "moderator");
      guard(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(mockSendError).not.toHaveBeenCalled();
    });
  });

  describe("optionalAuth", () => {
    it("should call next() without attaching user if authorization header is missing", async () => {
      await optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
      expect(mockUserFindUnique).not.toHaveBeenCalled();
    });

    it("should call next() without attaching user if header format is invalid", async () => {
      req.headers.authorization = "Basic token123";
      await optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
      expect(mockUserFindUnique).not.toHaveBeenCalled();
    });

    it("should call next() without attaching user if token part is empty", async () => {
      req.headers.authorization = "Bearer ";
      await optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should call next() without attaching user if verification fails", async () => {
      req.headers.authorization = "Bearer invalid-token";
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid");
      });

      await optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
      expect(mockUserFindUnique).not.toHaveBeenCalled();
    });

    it("should call next() without attaching user if user not found in DB", async () => {
      req.headers.authorization = "Bearer valid-token";
      mockVerifyAccessToken.mockReturnValue({ sub: "user-123" });
      mockUserFindUnique.mockResolvedValue(null);

      await optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should call next() without attaching user if user found but is inactive", async () => {
      req.headers.authorization = "Bearer valid-token";
      mockVerifyAccessToken.mockReturnValue({ sub: "user-123" });
      mockUserFindUnique.mockResolvedValue({
        id: "user-123",
        role: "user",
        isActive: false,
      });

      await optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should attach user and call next() if token is valid and user is active", async () => {
      req.headers.authorization = "Bearer valid-token";
      const mockPayload = { sub: "user-123" };
      const mockUser = {
        id: "user-123",
        role: "user",
        isActive: true,
      };
      mockVerifyAccessToken.mockReturnValue(mockPayload);
      mockUserFindUnique.mockResolvedValue(mockUser);

      await optionalAuth(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(req.tokenPayload).toEqual(mockPayload);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("should call next() silently even if database query throws", async () => {
      req.headers.authorization = "Bearer valid-token";
      mockVerifyAccessToken.mockReturnValue({ sub: "user-123" });
      mockUserFindUnique.mockRejectedValue(new Error("DB Error"));

      await optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

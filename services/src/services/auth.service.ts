import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/prisma.js";
import { sendResetEmail } from "../utils/email.js";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.js";
import type { RegisterInput, LoginInput } from "../validators/auth.validator.js";

// ── T-001: Auth Service ────────────────────────────────────

const BCRYPT_ROUNDS = 12;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function emailMatches(email: string) {
  return {
    email: {
      equals: normalizeEmail(email),
      mode: "insensitive" as const,
    },
  };
}

export class AuthService {
  /**
   * Register a new user.
   */
  async register(input: RegisterInput) {
    const normalizedEmail = normalizeEmail(input.email);

    // Check duplicate email
    const existing = await prisma.user.findFirst({
      where: emailMatches(normalizedEmail),
    });

    if (existing) {
      throw new AuthError("EMAIL_EXISTS", "Email đã được sử dụng", 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: input.fullName,
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

    // Generate tokens & create session
    const tokens = await this.createSession(user.id, user.role);

    return { user, tokens };
  }

  /**
   * Login with email + password.
   */
  async login(input: LoginInput) {
    const normalizedEmail = normalizeEmail(input.email);

    const user = await prisma.user.findFirst({
      where: emailMatches(normalizedEmail),
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        passwordHash: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AuthError("INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng", 401);
    }

    if (!user.isActive) {
      throw new AuthError("ACCOUNT_DISABLED", "Tài khoản đã bị vô hiệu hóa", 403);
    }

    const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new AuthError("INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng", 401);
    }

    // Generate tokens & create session
    const tokens = await this.createSession(user.id, user.role);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  /**
   * Refresh token — rotate (new pair, revoke old).
   */
  async refreshToken(refreshToken: string) {
    // Verify the refresh token JWT
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthError("INVALID_REFRESH_TOKEN", "Refresh token không hợp lệ", 401);
    }

    // Find the stored refresh token by hash
    const tokenHash = this.hashToken(refreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { session: true },
    });

    if (!storedToken || storedToken.revokedAt) {
      throw new AuthError("TOKEN_REVOKED", "Token đã bị thu hồi", 401);
    }

    if (storedToken.session.status !== "ACTIVE") {
      throw new AuthError("SESSION_INACTIVE", "Phiên đã kết thúc", 401);
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new token pair
    const tokens = generateTokenPair(payload.sub, payload.role);
    const newTokenHash = this.hashToken(tokens.refreshToken);

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        sessionId: storedToken.sessionId,
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { tokens };
  }

  /**
   * Logout — revoke session + all refresh tokens.
   */
  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      // Revoke specific session
      await prisma.userSession.update({
        where: { id: sessionId, userId },
        data: { status: "REVOKED", revokedAt: new Date() },
      });

      await prisma.refreshToken.updateMany({
        where: { sessionId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else {
      // Revoke all sessions
      await prisma.userSession.updateMany({
        where: { userId, status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: new Date() },
      });

      await prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  }

  async deleteAccount(userId: string) {
    const now = new Date();

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          deletedAt: now,
          deletionRequestedAt: now,
        },
      }),
      prisma.userSession.updateMany({
        where: { userId, status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: now },
      }),
      prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: now },
      }),
    ]);
  }

  /**
   * Start password reset: create OTP + reset token store (no enumeration)
   */
  async sendPasswordReset(email: string) {
    const normalizedEmail = normalizeEmail(email);
    const user = await prisma.user.findFirst({ where: emailMatches(normalizedEmail) });

    // Always create a reset record (even if user not found) to avoid email enumeration
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const codeHash = this.hashToken(code);
    const tokenHash = this.hashToken(resetToken);

    await prisma.passwordReset.create({
      data: {
        userId: user?.id || null,
        email: normalizedEmail,
        codeHash,
        tokenHash,
        expiresAt,
      },
    });
    // send email in background (or console fallback) to avoid blocking the HTTP request due to SMTP latency
    sendResetEmail(normalizedEmail, code).catch((err) => {
      console.error("[Email] Background send failed:", err);
    });
  }

  async verifyPasswordReset(email: string, otp: string) {
    const now = new Date();
    const normalizedEmail = normalizeEmail(email);
    const reset = await prisma.passwordReset.findFirst({
      where: { email: normalizedEmail, usedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: "desc" },
    });

    if (!reset) {
      throw new AuthError("RESET_NOT_FOUND", "Mã OTP không hợp lệ hoặc đã hết hạn", 400);
    }

    // Block after 5 failed attempts
    if (reset.attempts >= 5) {
      throw new AuthError(
        "OTP_MAX_ATTEMPTS",
        "Đã vượt quá số lần thử. Vui lòng yêu cầu mã mới",
        429,
      );
    }

    const otpHash = this.hashToken(otp);
    if (otpHash !== reset.codeHash) {
      await prisma.passwordReset.update({
        where: { id: reset.id },
        data: { attempts: { increment: 1 } },
      });
      throw new AuthError("INVALID_OTP", "OTP không hợp lệ", 400);
    }

    // Return the reset token (originally stored). For security we return a freshly generated token.
    const newResetToken = crypto.randomUUID();
    const newTokenHash = this.hashToken(newResetToken);

    await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { tokenHash: newTokenHash },
    });

    return { resetToken: newResetToken };
  }

  async resetPassword(email: string, resetToken: string, newPassword: string) {
    const now = new Date();
    const normalizedEmail = normalizeEmail(email);
    const tokenHash = this.hashToken(resetToken);

    const reset = await prisma.passwordReset.findFirst({
      where: { email: normalizedEmail, tokenHash, usedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: "desc" },
    });

    if (!reset || !reset.userId) {
      throw new AuthError("INVALID_RESET", "Reset token không hợp lệ hoặc đã hết hạn", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await prisma.$transaction([
      prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
      prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
      prisma.userSession.updateMany({
        where: { userId: reset.userId, status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: new Date() },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: reset.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  /**
   * Update user profile (fullName, avatarUrl).
   */
  async updateProfile(userId: string, input: { fullName?: string; avatarUrl?: string | null }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.fullName !== undefined && { fullName: input.fullName }),
        ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
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

    return user;
  }

  /**
   * Change password — requires current password verification.
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new AuthError("USER_NOT_FOUND", "Không tìm thấy người dùng", 404);
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new AuthError("INVALID_CREDENTIALS", "Mật khẩu hiện tại không đúng", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  }

  async googleLogin(email: string, fullName: string, avatarUrl: string | null) {
    const normalizedEmail = normalizeEmail(email);
    let user = await prisma.user.findFirst({
      where: emailMatches(normalizedEmail),
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (user) {
      if (!user.isActive) {
        throw new AuthError("ACCOUNT_DISABLED", "Tài khoản đã bị vô hiệu hóa", 403);
      }

      if (!user.avatarUrl && avatarUrl) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            avatarUrl: true,
            isActive: true,
            createdAt: true,
          },
        });
      }
    } else {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const passwordHash = await bcrypt.hash(randomPassword, BCRYPT_ROUNDS);

      const created = await prisma.user.create({
        data: {
          email: normalizedEmail,
          fullName: fullName || "Google User",
          avatarUrl,
          passwordHash,
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

      user = {
        ...created,
        isActive: true,
      };
    }
    const tokens = await this.createSession(user.id, user.role);

    const { isActive: _, ...userWithoutIsActive } = user;
    return { user: userWithoutIsActive, tokens };
  }

  /**
   * Get current user profile.
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AuthError("USER_NOT_FOUND", "Không tìm thấy người dùng", 404);
    }

    return user;
  }

  // ── Private Helpers ────────────────────────────────────────

  private async createSession(userId: string, role: string) {
    const tokens = generateTokenPair(userId, role);
    const tokenHash = this.hashToken(tokens.refreshToken);

    // Create session
    const session = await prisma.userSession.create({
      data: {
        userId,
        status: "ACTIVE",
        lastActiveAt: new Date(),
      },
    });

    // Store refresh token hash
    await prisma.refreshToken.create({
      data: {
        userId,
        sessionId: session.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}

// ── Auth Error Class ───────────────────────────────────────

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const authService = new AuthService();

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../config/prisma.js";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.js";
import type { RegisterInput, LoginInput } from "../validators/auth.validator.js";

// ── T-001: Auth Service ────────────────────────────────────

const BCRYPT_ROUNDS = 12;

export class AuthService {
  /**
   * Register a new user.
   */
  async register(input: RegisterInput) {
    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new AuthError("EMAIL_EXISTS", "Email đã được sử dụng", 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
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
    const user = await prisma.user.findUnique({
      where: { email: input.email },
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

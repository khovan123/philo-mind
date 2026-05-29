import jwt from "jsonwebtoken";

// ── T-001 (partial): JWT Utilities ─────────────────────────

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret-change-me";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export interface JwtPayload {
  sub: string; // userId
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate an access + refresh token pair.
 */
export function generateTokenPair(userId: string, role: string) {
  const accessToken = jwt.sign({ sub: userId, role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ sub: userId, role }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
}

/**
 * Verify an access token. Throws on invalid/expired.
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

/**
 * Verify a refresh token. Throws on invalid/expired.
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
}

/**
 * Decode without verifying (for debugging).
 */
export function decodeToken(token: string): JwtPayload | null {
  return jwt.decode(token) as JwtPayload | null;
}

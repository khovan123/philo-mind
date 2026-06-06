import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, refreshSchema } from "../validators/auth.validator.js";
import {
  forgotSchema,
  verifyOtpSchema,
  resetSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/auth.validator.js";
import { emailRateLimit } from "../middleware/rateLimit.middleware.js";

// ── T-001: Auth Routes ─────────────────────────────────────

export const authRouter = Router();

// Public routes
authRouter.post("/register", validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next),
);

authRouter.post("/login", validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next),
);

authRouter.get("/google", (req, res, next) =>
  authController.initiateGoogleAuth(req, res, next),
);

authRouter.get("/google/callback", (req, res, next) =>
  authController.googleCallback(req, res, next),
);

authRouter.post("/refresh", validate(refreshSchema), (req, res, next) =>
  authController.refreshToken(req, res, next),
);

// Password reset (email OTP flow)
authRouter.post("/forgot", emailRateLimit, validate(forgotSchema), (req, res, next) =>
  authController.forgotPassword(req, res, next),
);
authRouter.post("/verify-otp", validate(verifyOtpSchema), (req, res, next) =>
  authController.verifyOtp(req, res, next),
);
authRouter.post("/reset", validate(resetSchema), (req, res, next) =>
  authController.resetPassword(req, res, next),
);

// Protected routes
authRouter.post("/logout", authGuard, (req, res, next) => authController.logout(req, res, next));

// Profile management (authenticated)
authRouter.patch("/me", authGuard, validate(updateProfileSchema), (req, res, next) =>
  authController.updateProfile(req, res, next),
);
authRouter.post(
  "/me/change-password",
  authGuard,
  validate(changePasswordSchema),
  (req, res, next) => authController.changePassword(req, res, next),
);

// Soft delete the authenticated user account with 30-day grace semantics
authRouter.delete("/me", authGuard, (req, res, next) =>
  authController.deleteAccount(req, res, next),
);

authRouter.get("/me", authGuard, (req, res, next) => authController.getMe(req, res, next));

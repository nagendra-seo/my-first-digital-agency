import { Router } from "express";
import * as ctrl from "../controllers/adminAuthController.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, verify2faSchema } from "../validators/admin.js";
import { adminLoginLimiter, admin2faLimiter } from "../middleware/rateLimiters.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.post("/login", adminLoginLimiter, validateBody(loginSchema), asyncHandler(ctrl.login));
router.post("/login/verify-2fa", admin2faLimiter, validateBody(verify2faSchema), asyncHandler(ctrl.verify2fa));
router.post("/logout", asyncHandler(ctrl.logout));
router.get("/session", asyncHandler(ctrl.getSessionStatus));

router.get("/sessions", requireAdmin({ requireCsrf: false }), asyncHandler(ctrl.listSessions));
router.delete("/sessions/:id", requireAdmin(), asyncHandler(ctrl.revokeSession));

export default router;

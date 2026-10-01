import { Router } from "express";
import * as ctrl from "../controllers/adminSettingsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateBody } from "../middleware/validate.js";
import { setup2faVerifySchema } from "../validators/admin.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/overview", requireAdmin({ requireCsrf: false }), asyncHandler(ctrl.getOverview));
router.post("/2fa/setup", requireAdmin(), asyncHandler(ctrl.setup2fa));
router.post("/2fa/verify", requireAdmin(), validateBody(setup2faVerifySchema), asyncHandler(ctrl.verify2faSetup));
router.post("/time-slots/:id/toggle", requireAdmin(), asyncHandler(ctrl.toggleTimeSlot));

export default router;

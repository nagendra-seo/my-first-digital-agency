import { Router } from "express";
import { listActivity } from "../controllers/adminActivityController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();
router.get("/", requireAdmin({ requireCsrf: false }), asyncHandler(listActivity));

export default router;

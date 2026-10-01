import { Router } from "express";
import { getDashboardStats } from "../controllers/adminDashboardController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();
router.get("/", requireAdmin({ requireCsrf: false }), asyncHandler(getDashboardStats));

export default router;

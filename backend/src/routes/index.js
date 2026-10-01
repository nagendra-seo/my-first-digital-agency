import { Router } from "express";
import bookingRoutes from "./bookingRoutes.js";
import adminAuthRoutes from "./adminAuthRoutes.js";
import adminBookingRoutes from "./adminBookingRoutes.js";
import adminSettingsRoutes from "./adminSettingsRoutes.js";
import adminActivityRoutes from "./adminActivityRoutes.js";
import adminDashboardRoutes from "./adminDashboardRoutes.js";

const router = Router();

router.use("/bookings", bookingRoutes);
router.use("/admin", adminAuthRoutes);
router.use("/admin/bookings", adminBookingRoutes);
router.use("/admin/settings", adminSettingsRoutes);
router.use("/admin/activity", adminActivityRoutes);
router.use("/admin/dashboard", adminDashboardRoutes);

router.get("/health", (req, res) => res.json({ ok: true }));

export default router;

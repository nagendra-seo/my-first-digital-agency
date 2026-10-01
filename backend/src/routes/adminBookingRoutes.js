import { Router } from "express";
import * as ctrl from "../controllers/adminBookingController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { bookingListQuerySchema, rescheduleSchema, cancelSchema, notesSchema } from "../validators/booking.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", requireAdmin({ requireCsrf: false }), validateQuery(bookingListQuerySchema), asyncHandler(ctrl.listBookings));
router.get("/export", requireAdmin({ requireCsrf: false }), validateQuery(bookingListQuerySchema.partial()), asyncHandler(ctrl.exportBookings));
router.get("/:id", requireAdmin({ requireCsrf: false }), asyncHandler(ctrl.getBooking));
router.post("/:id/confirm", requireAdmin(), asyncHandler(ctrl.confirmBooking));
router.post("/:id/cancel", requireAdmin(), validateBody(cancelSchema.partial()), asyncHandler(ctrl.cancelBooking));
router.post("/:id/reschedule", requireAdmin(), validateBody(rescheduleSchema), asyncHandler(ctrl.rescheduleBooking));
router.post("/:id/complete", requireAdmin(), asyncHandler(ctrl.completeBooking));
router.post("/:id/notes", requireAdmin(), validateBody(notesSchema), asyncHandler(ctrl.updateNotes));

export default router;

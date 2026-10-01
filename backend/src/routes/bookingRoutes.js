import { Router } from "express";
import { createBooking } from "../controllers/bookingController.js";
import { validateBody } from "../middleware/validate.js";
import { createBookingSchema } from "../validators/booking.js";
import { bookingLimiter } from "../middleware/rateLimiters.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.post("/", bookingLimiter, validateBody(createBookingSchema), asyncHandler(createBooking));

export default router;

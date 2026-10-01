import { z } from "zod";
import { DEFAULT_TIME_SLOTS } from "../utils/constants.js";

const allowedTimeValues = DEFAULT_TIME_SLOTS.map((s) => s.value);
const phonePattern = /^[+]?[\d\s-]{7,20}$/;

// Server-side source of truth for a new audit-request submission. Frontend
// validation exists only for UX — every field is re-checked here.
export const createBookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  businessName: z.string().trim().min(2, "Enter your business name").max(160),
  websiteUrl: z
    .string().trim().max(300).optional().or(z.literal(""))
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || /^https?:\/\/.+\..+/i.test(v), "Enter a full URL, e.g. https://example.com"),
  phone: z
    .string().trim().max(20).optional().or(z.literal(""))
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || phonePattern.test(v), "Enter a valid phone number"),
  message: z.string().trim().min(10, "Tell us a little more about what you'd like to improve").max(2000),
  preferredDate: z
    .string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date")
    .refine((v) => {
      const chosen = new Date(`${v}T00:00:00+05:30`);
      const now = new Date();
      const todayIst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      todayIst.setHours(0, 0, 0, 0);
      return chosen.getTime() >= todayIst.getTime();
    }, "Choose today or a future date"),
  preferredTime: z.enum(allowedTimeValues, { errorMap: () => ({ message: "Choose one of the available time slots" }) }),
  turnstileToken: z.string().min(1, "Please complete the verification challenge"),
  // Honeypot — real visitors never fill this in.
  website: z.string().max(0, "Spam check failed").optional().or(z.literal("")),
});

export const rescheduleSchema = z.object({
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.enum(allowedTimeValues),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const cancelSchema = z.object({
  reason: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const notesSchema = z.object({
  adminNotes: z.string().trim().max(4000),
});

export const bookingListQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "RESCHEDULED", "COMPLETED", "ALL"]).optional().default("ALL"),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sort: z.enum(["newest", "oldest", "appointment"]).optional().default("newest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

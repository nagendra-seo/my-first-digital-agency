import rateLimit from "express-rate-limit";

// Express runs as one persistent process here (not serverless functions),
// so an in-memory store is genuinely correct and needs no extra
// infrastructure. If you ever scale to multiple instances behind a load
// balancer, swap the store for rate-limit-redis without changing call sites.
const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again shortly." },
};

export const bookingLimiter = rateLimit({
  ...commonOptions,
  windowMs: 10 * 60 * 1000,
  max: 5,
});

export const adminLoginLimiter = rateLimit({
  ...commonOptions,
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Please try again later." },
});

export const admin2faLimiter = rateLimit({
  ...commonOptions,
  windowMs: 10 * 60 * 1000,
  max: 8,
  message: { error: "Too many attempts. Please try again later." },
});

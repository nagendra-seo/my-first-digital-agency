import { logger } from "../utils/logger.js";

/** Wraps an async route handler so a thrown error is forwarded to Express's
 *  error middleware instead of crashing the process or hanging the request. */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/** Centralized error handler — the ONLY place that decides what a client
 *  sees on failure. Never leaks stack traces, database errors, or internal
 *  paths; those go to the server log only. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message || err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Please check the form and try again.",
      fieldErrors: err.flatten?.().fieldErrors,
    });
  }
  if (err.code === 11000) {
    // Mongo duplicate key
    return res.status(409).json({ error: "That record already exists." });
  }

  res.status(err.status || 500).json({ error: "Something went wrong on our end. Please try again shortly." });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found." });
}

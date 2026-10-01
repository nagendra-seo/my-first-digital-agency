/** Validates req.body against a Zod schema, replacing it with the parsed
 *  (typed, defaulted, trimmed) result. Validation errors are forwarded to
 *  the central error handler. */
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Please check the form and try again.",
        fieldErrors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid query parameters." });
    }
    req.query = result.data;
    next();
  };
}

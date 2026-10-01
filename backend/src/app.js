import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// Trust the first proxy hop (Render/Railway/etc. sit behind one) so
// req.ip reflects the real client IP for rate limiting and audit logs.
app.set("trust proxy", 1);

app.use(
  helmet({
    // The API serves JSON only — no HTML is rendered here, so a
    // content security policy on this origin isn't meaningful the way it
    // is on the frontend. Helmet's other protections (nosniff, frameguard,
    // hsts, etc.) still apply.
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips any $ / . operators from user input — blocks NoSQL injection
app.use(hpp()); // blocks HTTP parameter pollution (?status=A&status=B tricks)

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

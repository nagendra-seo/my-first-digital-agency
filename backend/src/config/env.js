import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Every environment variable the server relies on is validated once, at
// startup, so a missing/blank secret fails loudly and clearly instead of
// causing a confusing bug later. This never runs in the browser.
const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  FRONTEND_URL: z.string().url(),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  TOTP_ENCRYPTION_KEY: z.string().min(32, "TOTP_ENCRYPTION_KEY must be at least 32 characters"),

  ADMIN_EMAIL: z.string().email().optional(),

  BREVO_API_KEY: z.string().min(1, "BREVO_API_KEY is required"),
  BREVO_SENDER_EMAIL: z.string().email("BREVO_SENDER_EMAIL must be a valid email"),
  BREVO_SENDER_NAME: z.string().min(1).default("My First Digital Agency"),
  ADMIN_NOTIFICATION_EMAIL: z.string().email(),

  TURNSTILE_SECRET_KEY: z.string().min(1, "TURNSTILE_SECRET_KEY is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  // Startup failures are the one place a server-side console.error is
  // appropriate — this never runs in a browser, only in your terminal.
  console.error(`Invalid environment configuration. Check .env against .env.example:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;

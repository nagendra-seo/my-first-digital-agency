import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import { logger } from "./src/utils/logger.js";

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server:", err.message);
  process.exit(1);
});

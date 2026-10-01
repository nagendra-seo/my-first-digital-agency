/**
 * Minimal server-side-only logger. This runs in your terminal / hosting
 * provider's log viewer — never in a visitor's browser console. Kept
 * deliberately small: a timestamp + level + message, nothing fancier.
 */
const isProd = process.env.NODE_ENV === "production";

function line(level, args) {
  const ts = new Date().toISOString();
  return [`[${ts}] [${level}]`, ...args];
}

export const logger = {
  info: (...args) => {
    if (!isProd) console.log(...line("INFO", args));
  },
  warn: (...args) => console.warn(...line("WARN", args)),
  error: (...args) => console.error(...line("ERROR", args)),
};

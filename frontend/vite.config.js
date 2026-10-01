import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
  },
  esbuild: {
    // Belt-and-suspenders: strip any console.* / debugger statement from
    // the production bundle even if one slipped into the source, so
    // nothing ever prints to a visitor's browser console.
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));

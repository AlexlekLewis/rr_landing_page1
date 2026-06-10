import { defineConfig } from "vitest/config";

// Isolated from the app's vite.config.js — the scoring engine is pure logic, so
// these run in a plain Node environment with no React/DOM plugins.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});

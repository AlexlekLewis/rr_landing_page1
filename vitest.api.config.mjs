// The main vitest config only includes src/**, so nothing under api/ has ever
// been run by `npm test`. This second config runs the serverless-function tests.
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['api/**/*.test.js'], environment: 'node' },
});

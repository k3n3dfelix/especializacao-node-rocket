import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: "src",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "src/use-cases",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          dir: "src/http/controllers",
          environment: "./prisma/vitest-environment-prisma/prisma-test-environment.ts"
        },
      }
    ],
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.mjs",
  },
});

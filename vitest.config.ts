import { defineConfig } from "vitest/config";

process.loadEnvFile();

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  }
});
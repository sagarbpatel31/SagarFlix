import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node by default so the bulk of the suite stays fast; hook and component
    // tests opt into jsdom with a `@vitest-environment jsdom` docblock.
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  // tsconfig sets jsx: "preserve" for Next's compiler, so Vite needs its own
  // JSX transform for the hook/component tests.
  plugins: [react()],
});

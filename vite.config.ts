import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// ⛔️ DO NOT import "./server" here.
// We will dynamically import it inside configureServer.

import type { UserConfig } from "vitest/config";

const vitestConfig: UserConfig["test"] = {
  globals: true,
  environment: "jsdom",
  setupFiles: "./client/tests/setup.ts",
};

export default defineConfig(() => ({
  test: vitestConfig,
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: { outDir: "dist/spa" },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(vite) {
      // ✅ Import lazy: executed only when dev server starts (after env is loaded)
      const { createServer } = await import("./server/index.ts");
      const app = createServer();

      // health check
      app.get("/api/__health", (_req, res) => res.json({ ok: true }));

      vite.middlewares.use(app);
    },
  };
}

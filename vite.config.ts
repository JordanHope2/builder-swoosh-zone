import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// ⛔️ DO NOT import "./server" here.
// We will dynamically import it inside configureServer.

export default defineConfig(() => ({
  server: {
    host: "::",
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
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
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

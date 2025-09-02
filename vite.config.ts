/// <reference types="vitest" />
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import dotenv from 'dotenv';

// Load .env files to make them available to Vite's config process
dotenv.config({ path: './.env.test' });
dotenv.config({ path: './.env' });

// ⛔️ DO NOT import "./server" here.
// We will dynamically import it inside configureServer.

export default defineConfig(() => ({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    // Exclude node_modules and E2E tests from the test run
    exclude: ['e2e/**', 'node_modules/**'],
    // Configure test coverage reporting
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['server/**', 'client/**'],
      exclude: [
        'server/dev.ts',
        'server/node-build.ts',
        'tests/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
        '.storybook/**',
        'stories/**'
      ],
      all: true,
    }
  },
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    sourcemap: true,
  },
  plugins: [
    react(),
    // The express plugin is disabled during tests to prevent the server from starting
    process.env.VITEST !== 'true' && expressPlugin(),
    // The Sentry plugin is disabled if the auth token is not present
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: "jordanhope2",
      project: "jobequal-ch",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@components": path.resolve(__dirname, "./client/components"),
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

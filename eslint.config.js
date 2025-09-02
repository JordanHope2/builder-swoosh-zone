import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist/**", "node_modules/**", ".vite/**", "storybook-static/**", "server/dist/**"],
  },
  // 1. Vite App Code (TS/TSX) - Type-aware
  {
    files: ["client/**/*.ts", "client/**/*.tsx", "server/**/*.ts", "shared/**/*.ts", "vite.config.ts", "vite.config.server.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": "off",
    },
  },
  // 2. Other TS Code - Basic
  {
    files: ["src/**/*.ts", "src/**/*.tsx", "*.ts", ".storybook/*.ts", "e2e/*.ts", "netlify/functions/*.ts", "tests/*.ts", "playwright.config.ts", "tailwind.config.ts"],
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.node, ...globals.browser }, // src might have browser code
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
  },
  // 3. Config Files (JS/MJS/CJS) - Basic
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      globals: { ...globals.node },
    }
  },
];

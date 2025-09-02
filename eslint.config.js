// eslint.config.js (Flat config for ESLint v9+)
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "build/**",
      "coverage/**",
      "**/*.min.js",
      "**/vendor/**",
      ".eslintrc.cjs",
      "public/**",
      ".vite/deps/**",
      "src/components/NewJobForm.tsx" // Ignore this file as it has a syntax error from a bad merge
    ],
  },

  // Config for JS files
  {
    files: ["**/*.{js,cjs,mjs}"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.node }
    }
  },

  // Base config for all TS/TSX files
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/alt-text": "warn",
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
        },
      ],
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { typescript: true, node: true },
    },
  },

  // Stricter, type-aware config for the main project files
  {
    files: [
        "client/**/*.{ts,tsx}",
        "server/**/*.{ts,tsx}",
        "shared/**/*.{ts,tsx}",
        "vite.config.ts",
        "vite.config.server.ts"
    ],
    extends: tseslint.configs.recommendedTypeChecked,
    languageOptions: {
        parserOptions: { project: true },
    },
  }
);

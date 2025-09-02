import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact_recommended from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      "dist/",
      "node_modules/",
      "storybook-static/",
      ".env.*",
      ".vite/",
      "playwright-report/",
      "e2e/",
      "eslint.config.js",
    ],
  },

  // Base configuration for JS files
  {
    files: ["**/*.{js,mjs,cjs}"],
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Configuration for TS config files (non-type-aware)
  {
    files: ["**/*.config.ts", ".storybook/**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },

  // Type-aware configuration for application source code
  {
    files: ["client/**/*.{ts,tsx}", "server/**/*.{ts,tsx}", "shared/**/*.{ts,tsx}"],
    ...pluginReact_recommended,
    languageOptions: {
      ...pluginReact_recommended.languageOptions,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: true, // Automatically find tsconfig.json
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      ...pluginReact_recommended.plugins,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.strictTypeChecked.rules,
      ...tseslint.configs.stylisticTypeChecked.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);

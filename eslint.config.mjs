import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ── Global ignores (must be standalone, before other configs) ──
  {
    ignores: [
      "**/dist/",
      "**/node_modules/",
      "webapp/",
      ".code-review-graph/",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.cjs",
      "services/src/prisma/generated/**",
    ],
  },

  // ── Base configs ──────────────────────────────────────────
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  // ── Backend (services) ────────────────────────────────────
  {
    files: ["services/src/**/*.ts", "libs/*/src/**/*.ts"],
    plugins: {
      prettier,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Prettier
      "prettier/prettier": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
);

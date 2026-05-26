import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // ── Base configs ──────────────────────────────────────────
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  // ── Project-specific ──────────────────────────────────────
  {
    files: ["src/**/*.ts"],
    plugins: {
      prettier,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Prettier as ESLint rule
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

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // ── Ignore patterns ───────────────────────────────────────
  {
    ignores: ["dist/", "node_modules/", "*.js", "*.mjs"],
  },
);

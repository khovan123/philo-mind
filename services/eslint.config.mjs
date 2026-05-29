import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ── Global ignores (must be standalone, before other configs) ──
  {
    ignores: ["dist/", "node_modules/", "*.js", "*.mjs", "src/prisma/generated/**"],
  },

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
);

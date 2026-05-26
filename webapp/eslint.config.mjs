import expo from "eslint-config-expo/flat.js";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";

export default [
  // ── Expo base config (flat) ───────────────────────────────
  ...expo,

  // ── Disable style rules that conflict with Prettier ───────
  prettierConfig,

  // ── Project-specific ──────────────────────────────────────
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // Prettier as ESLint rule
      "prettier/prettier": "warn",

      // React Native
      "react/react-in-jsx-scope": "off",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["*.config.js", "*.config.mjs", "*.config.cjs"],
    rules: {
      "import/order": "off",
    },
  },

  // ── Ignore patterns ───────────────────────────────────────
  {
    ignores: [
      "**/node_modules/",
      ".expo/",
      "**/dist/",
      "scripts/",
      "metro.config.js",
      "postcss.config.mjs",
    ],
  },
];

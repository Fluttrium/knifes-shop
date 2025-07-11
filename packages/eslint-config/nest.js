import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for NestJS applications.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nestJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
]; 
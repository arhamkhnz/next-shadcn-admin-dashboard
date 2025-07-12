import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";
import securityPlugin from "eslint-plugin-security";
import prettier from "eslint-plugin-prettier";
import unicorn from "eslint-plugin-unicorn";
import sonarjs from "eslint-plugin-sonarjs";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: [".github/", ".husky/", "node_modules/", ".next/", "src/components/ui", "*.config.ts", "*.mjs"] },
  {
    languageOptions: {
      globals: globals.browser,
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      import: pluginImport,
      security: securityPlugin,
      prettier: prettier,
      unicorn: unicorn,
      react: pluginReact,
      sonarjs: sonarjs,
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  securityPlugin.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Prettier integration rules
      "prettier/prettier": "warn",

      // File Naming
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["^.*\\.config\\.(js|ts|mjs)$", "^.*\\.d\\.ts$"],
        },
      ],

      // Custom Rules (Not covered by plugins)
      "spaced-comment": ["error", "always", { exceptions: ["-", "+"] }],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "no-useless-rename": "error",

      // Import/Export Rules
      "import/no-mutable-exports": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "{next,next/**}",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: [],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",
      "import/no-unresolved": [
        "error",
        {
          caseSensitive: true,
        },
      ],
      "no-duplicate-imports": ["error", { includeExports: true }],
      "import/no-cycle": ["error", { maxDepth: 2 }],

      // Whitespace and Punctuation (Style Rules)
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-in-parens": ["error", "never"],
      "array-bracket-spacing": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "func-call-spacing": ["error", "never"],
      "computed-property-spacing": ["error", "never"],

      // Naming Conventions
      "no-underscore-dangle": ["error", { allow: ["_id", "__dirname"] }],

      // Complexity
      complexity: ["error", { max: 10 }],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-depth": ["error", 4],

      // TypeScript-Specific Rules (customized)
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn"],

      // React unnecessary import rules
      "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],

      // React JSX Pascal Case Rule
      "react/jsx-pascal-case": [
        "error",
        {
          allowAllCaps: false,
          ignore: [],
        },
      ],

      // React: Prevent nesting component definitions inside another component
      "react/no-unstable-nested-components": ["error", { allowAsProps: true }],

      // React: Prevent re-renders by ensuring context values are memoized
      "react/jsx-no-constructed-context-values": "error",

      // React: Disallow array index as key in JSX
      "react/no-array-index-key": "warn",

      // SonarJS: Detect commented-out code
      "sonarjs/no-commented-code": "warn",
    },
  },
];

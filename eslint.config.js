import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Apply type-aware rules only to TS files included in tsconfig.json
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "no-restricted-syntax": [
        "warn",
        {
          selector: "CallExpression[callee.property.name='forEach']",
          message: "Prefer for...of instead of forEach",
        },
      ],
    },
  },
  {
    ignores: ["eslint.config.js", "dist", "build", "node_modules"],
  }
);

import { defineConfig } from 'oxfmt';

// Prettier's defaults as @eddlondon/eslint-config-react 5 used them, written
// out where oxfmt's own defaults differ. `useTabs` and `endOfLine` are left
// unset on purpose: oxfmt reads indent style from the project's .editorconfig,
// and line endings are a per-project choice (oxfmt has no `auto`).
//
//   import { defineConfig } from 'oxfmt';
//   import edd from '@eddlondon/oxlint-config/oxfmt';
//   export default defineConfig({ ...edd, endOfLine: 'lf' });
export default defineConfig({
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  insertFinalNewline: true,
  sortPackageJson: true,
  sortImports: {
    newlinesBetween: true,
    groups: [
      'value-builtin',
      'value-external',
      ['value-internal', 'type-internal'],
      ['value-parent', 'type-parent'],
      ['value-sibling', 'type-sibling'],
      ['value-index', 'type-index'],
      'type-import',
      'unknown',
    ],
  },
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/generated/**',
  ],
});

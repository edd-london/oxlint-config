import { defineConfig } from 'oxfmt';

// Prettier's defaults as @eddlondon/eslint-config-react 5 used them, spelled
// out where oxfmt's defaults differ. `useTabs` is unset so .editorconfig
// decides; `endOfLine` is unset because oxfmt has no `auto`.
//
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

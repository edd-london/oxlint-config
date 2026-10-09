import { defineConfig, type OxfmtConfig } from 'oxfmt';

// Prettier's defaults as @eddlondon/eslint-config-react 5 used them, spelled
// out where oxfmt's defaults differ. `useTabs` is unset so .editorconfig
// decides; `endOfLine` is unset because oxfmt has no `auto`.
//
//   import edd from '@eddlondon/oxlint-config/oxfmt';
//   export default defineConfig({ ...edd, endOfLine: 'lf' });
//
// Typed as OxfmtConfig for a small .d.ts; ignorePatterns stays required so
// consumers can spread it.
const config: OxfmtConfig & { ignorePatterns: string[] } = defineConfig({
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

export default config;

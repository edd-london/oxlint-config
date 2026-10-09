import { defineConfig, type OxlintConfig } from 'oxlint';

import eslint from './plugins/eslint.js';
import importPlugin from './plugins/import.js';
import typescript from './plugins/typescript.js';
import unicorn from './plugins/unicorn.js';

// Framework-free entry: the eslint, typescript, unicorn and import rules of
// @eddlondon/eslint-config-react 5. Every rule is listed and `correctness` is
// off, so oxlint's own defaults never apply.
//
// No `ignorePatterns`: oxlint reads them only from the config file it loads,
// never from `extends` or a parent config. Consumers declare their own.
//
// Entries are typed as `OxlintConfig` so the published .d.ts is a type
// reference instead of every rule of every extended entry.
//
//   import base from '@eddlondon/oxlint-config/base';
//   export default defineConfig({ extends: [base] });
const config: OxlintConfig = defineConfig({
  categories: { correctness: 'off' },
  env: { builtin: true },
  extends: [eslint, typescript, unicorn, importPlugin],
  overrides: [
    {
      // Every project has CommonJS config files. Widen the glob locally if
      // CommonJS lives elsewhere too.
      files: ['**/*.cjs', '**/*.config.js'],
      plugins: ['typescript', 'unicorn'],
      rules: {
        'typescript/no-require-imports': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-export-from': 'off',
      },
    },
  ],
});

export default config;

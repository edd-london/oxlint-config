import { defineConfig } from 'oxlint';

import eslint from './plugins/eslint.js';
import importPlugin from './plugins/import.js';
import typescript from './plugins/typescript.js';
import unicorn from './plugins/unicorn.js';

// Framework-free entry: the eslint, typescript, unicorn and import rules of
// @eddlondon/eslint-config-react 5. Every rule is listed explicitly and
// `correctness` is off, so oxlint's own defaults never leak in.
//
//   import { defineConfig } from 'oxlint';
//   import base from '@eddlondon/oxlint-config/base';
//   export default defineConfig({ extends: [base] });
export default defineConfig({
  categories: { correctness: 'off' },
  env: { builtin: true },
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/generated/**',
  ],
  extends: [eslint, typescript, unicorn, importPlugin],
});

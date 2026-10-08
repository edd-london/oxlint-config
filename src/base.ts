import { defineConfig } from 'oxlint';

import eslint from './plugins/eslint.js';
import importPlugin from './plugins/import.js';
import typescript from './plugins/typescript.js';
import unicorn from './plugins/unicorn.js';

// Framework-free entry: the eslint, typescript, unicorn and import rules of
// @eddlondon/eslint-config-react 5. Every rule is listed explicitly and
// `correctness` is off, so oxlint's own defaults never leak in.
//
// No `ignorePatterns` here on purpose: oxlint 1.87 only honours ignorePatterns
// declared directly in the config it loads. They are not merged from `extends`
// (object or file), and nested configs do not inherit the root's either.
// Consumers set ignores in every config file oxlint loads.
//
//   import { defineConfig } from 'oxlint';
//   import base from '@eddlondon/oxlint-config/base';
//   export default defineConfig({ extends: [base] });
export default defineConfig({
  categories: { correctness: 'off' },
  env: { builtin: true },
  extends: [eslint, typescript, unicorn, importPlugin],
  overrides: [
    {
      // CommonJS config files are a fact of life in every project (from the
      // website and edd-ui). Projects with CommonJS elsewhere widen the glob.
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

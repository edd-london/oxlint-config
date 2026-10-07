// Re-export of index.json for `oxlint.config.ts` consumers:
//
//   import { defineConfig } from 'oxlint';
//   import edd from '@eddlondon/oxlint-config';
//   export default defineConfig({ extends: [edd] });
//
// JSON consumers extend the file directly:
//
//   { "extends": ["./node_modules/@eddlondon/oxlint-config/index.json"] }
import config from './index.json' with { type: 'json' };

export default config;

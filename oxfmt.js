// Re-export of oxfmt.json for `oxfmt.config.ts` consumers. oxfmt has no
// `extends`, so spread this object and add project settings after it:
//
//   import { defineConfig } from 'oxfmt';
//   import edd from '@eddlondon/oxlint-config/oxfmt';
//   export default defineConfig({ ...edd, endOfLine: 'lf' });
import config from './oxfmt.json' with { type: 'json' };

export default config;

import { defineConfig, type OxlintConfig } from 'oxlint';

import nextjs from './plugins/nextjs.js';
import react from './react.js';

// Next.js entry: `react` plus oxlint's port of @next/eslint-plugin-next at
// its recommended and core-web-vitals severities.
//
//   import nextjs from '@eddlondon/oxlint-config/nextjs';
//   export default defineConfig({ extends: [nextjs] });
const config: OxlintConfig = defineConfig({
  extends: [react, nextjs],
});

export default config;

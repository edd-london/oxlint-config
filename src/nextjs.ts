import { defineConfig } from 'oxlint';

import nextjs from './plugins/nextjs.js';
import react from './react.js';

// Next.js entry: everything in `react` plus oxlint's port of
// @next/eslint-plugin-next at its recommended and core-web-vitals severities.
//
//   import { defineConfig } from 'oxlint';
//   import nextjs from '@eddlondon/oxlint-config/nextjs';
//   export default defineConfig({ extends: [nextjs] });
export default defineConfig({
  extends: [react, nextjs],
});

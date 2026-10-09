import { defineConfig, type OxlintConfig } from 'oxlint';

import nextjs from './plugins/nextjs.js';
import react from './react.js';

// Next.js entry: everything in `react` plus oxlint's port of
// @next/eslint-plugin-next at its recommended and core-web-vitals severities.
//
//   import { defineConfig } from 'oxlint';
//   import nextjs from '@eddlondon/oxlint-config/nextjs';
//   export default defineConfig({ extends: [nextjs] });
//
// Annotated with oxlint's own type so the published .d.ts is a type
// reference, not every rule of every entry this one extends.
const config: OxlintConfig = defineConfig({
  extends: [react, nextjs],
});

export default config;

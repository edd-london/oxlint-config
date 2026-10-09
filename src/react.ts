import { defineConfig, type OxlintConfig } from 'oxlint';

import base from './base.js';
import react from './plugins/react.js';

// React entry: everything in `base` plus the react, react-hooks and jsx-a11y
// rules of @eddlondon/eslint-config-react 5.
//
//   import { defineConfig } from 'oxlint';
//   import react from '@eddlondon/oxlint-config/react';
//   export default defineConfig({ extends: [react] });
//
// Annotated with oxlint's own type so the published .d.ts is a type
// reference, not every rule of every entry this one extends.
const config: OxlintConfig = defineConfig({
  extends: [base, react],
});

export default config;

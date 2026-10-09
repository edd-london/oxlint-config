import { defineConfig, type OxlintConfig } from 'oxlint';

import base from './base.js';
import react from './plugins/react.js';

// React entry: `base` plus the react, react-hooks and jsx-a11y rules of
// @eddlondon/eslint-config-react 5.
//
//   import react from '@eddlondon/oxlint-config/react';
//   export default defineConfig({ extends: [react] });
const config: OxlintConfig = defineConfig({
  extends: [base, react],
});

export default config;

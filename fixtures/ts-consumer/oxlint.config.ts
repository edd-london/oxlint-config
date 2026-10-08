// Simulates a project on `oxlint.config.ts`. A real consumer imports
// '@eddlondon/oxlint-config/react'; here the compiled entry is reached by path.
import { defineConfig } from 'oxlint';

import react from '../../dist/react.js';

export default defineConfig({
  extends: [react],
  // Consumers declare their own ignores; the package cannot ship them.
  ignorePatterns: ['**/ignored/**'],
});

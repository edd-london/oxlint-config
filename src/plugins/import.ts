import { defineConfig, type OxlintConfig } from 'oxlint';

// eslint-plugin-import as eslint-config-react 5 used it. import/order is not in
// oxlint; oxfmt sortImports replaces it.
// Annotated with oxlint's own type so the published .d.ts is a type
// reference, not every rule of every entry this one extends.
const config: OxlintConfig = defineConfig({
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
      plugins: ['import'],
      rules: {
        'import/no-cycle': 'error',
        // Advisory additions from nexus.
        'import/no-duplicates': 'warn',
        'import/no-named-as-default': 'warn',
      },
    },
  ],
});

export default config;

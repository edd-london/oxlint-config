import { defineConfig, type OxlintConfig } from 'oxlint';

// eslint-plugin-import as eslint-config-react 5 used it. `import/order` has
// no oxlint equivalent; oxfmt's `sortImports` replaces it.
const config: OxlintConfig = defineConfig({
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
      plugins: ['import'],
      rules: {
        'import/no-cycle': 'error',
        // Additions beyond the ESLint package, advisory only.
        'import/no-duplicates': 'warn',
        'import/no-named-as-default': 'warn',
      },
    },
  ],
});

export default config;

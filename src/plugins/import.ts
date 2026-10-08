import { defineConfig } from 'oxlint';

// eslint-plugin-import as eslint-config-react 5 used it. import/order is not in
// oxlint; oxfmt sortImports replaces it.
export default defineConfig({
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
      plugins: ['import'],
      rules: {
        'import/no-cycle': 'error',
      },
    },
  ],
});

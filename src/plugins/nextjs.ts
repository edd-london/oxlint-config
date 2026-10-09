import { defineConfig, type OxlintConfig } from 'oxlint';

// oxlint's port of @next/eslint-plugin-next at the severities of its
// `recommended` and `core-web-vitals` presets.
const config: OxlintConfig = defineConfig({
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
      plugins: ['nextjs'],
      rules: {
        'nextjs/google-font-display': 'warn',
        'nextjs/google-font-preconnect': 'warn',
        'nextjs/inline-script-id': 'error',
        'nextjs/next-script-for-ga': 'warn',
        'nextjs/no-assign-module-variable': 'error',
        'nextjs/no-async-client-component': 'warn',
        'nextjs/no-before-interactive-script-outside-document': 'warn',
        'nextjs/no-css-tags': 'warn',
        'nextjs/no-document-import-in-page': 'error',
        'nextjs/no-duplicate-head': 'error',
        'nextjs/no-head-element': 'warn',
        'nextjs/no-head-import-in-document': 'error',
        // `core-web-vitals` raises this and no-sync-scripts to error.
        'nextjs/no-html-link-for-pages': 'error',
        'nextjs/no-img-element': 'warn',
        'nextjs/no-page-custom-font': 'warn',
        'nextjs/no-script-component-in-head': 'error',
        'nextjs/no-styled-jsx-in-document': 'warn',
        'nextjs/no-sync-scripts': 'error',
        'nextjs/no-title-in-document-head': 'warn',
        'nextjs/no-typos': 'warn',
        'nextjs/no-unwanted-polyfillio': 'warn',
      },
    },
  ],
});

export default config;

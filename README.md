# EDD oxlint Config

EDD London's shared [oxlint](https://oxc.rs/docs/guide/usage/linter.html) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) configuration. It is the oxlint version of [`@eddlondon/eslint-config-react`](https://www.npmjs.com/package/@eddlondon/eslint-config-react) 5: the same rules and the same decisions, translated one to one, with nothing project-specific added.

[https://www.npmjs.com/package/@eddlondon/oxlint-config](https://www.npmjs.com/package/@eddlondon/oxlint-config)

**Requirements:**

- oxlint 1.87+
- oxfmt 0.72+ (optional, for formatting)
- oxlint-tsgolint 7+ (optional, for type-aware rules)
- Node 20+

## Installation

```bash
npm i -D oxlint oxfmt @eddlondon/oxlint-config
# or
pnpm add -D oxlint oxfmt @eddlondon/oxlint-config
# or
yarn add -D oxlint oxfmt @eddlondon/oxlint-config
```

## Usage

### Linting with `.oxlintrc.json`

oxlint's JSON `extends` takes file paths, not package names, so point it at the file inside `node_modules`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@eddlondon/oxlint-config/index.json"],
  "rules": {
    // project overrides go here
  }
}
```

### Linting with `oxlint.config.ts`

Needs the Node-based `oxlint` package and Node 22.18+. Also the route for Yarn PnP projects, which have no `node_modules` folder.

```ts
import { defineConfig } from 'oxlint';
import edd from '@eddlondon/oxlint-config';

export default defineConfig({
  extends: [edd],
  rules: {
    // project overrides go here
  },
});
```

### Formatting

oxfmt has no `extends`. Import the config object in `oxfmt.config.ts` and spread it, then add your project's settings after it:

```ts
import { defineConfig } from 'oxfmt';
import edd from '@eddlondon/oxlint-config/oxfmt';

export default defineConfig({
  ...edd,
  endOfLine: 'lf',
});
```

Or copy `node_modules/@eddlondon/oxlint-config/oxfmt.json` to `.oxfmtrc.json` and edit it. The `$schema` entry in that file points at `./node_modules/oxfmt/configuration_schema.json`, which resolves correctly from a project root.

### Scripts

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:types": "oxlint --type-aware",
    "format": "oxfmt",
    "format:check": "oxfmt --check"
  }
}
```

Type-aware linting needs `oxlint-tsgolint` installed in the project. oxlint only reads type-aware options from the project's own root config, so this package does not set any.

### Editor

Install the [oxc VS Code extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) and disable the ESLint and Prettier extensions for the workspace.

## What is in the config

### Lint rules

Translated from `@eddlondon/eslint-config-react` 5 with `@oxlint/migrate`, pinned to the plugin versions that package declares, then checked line by line.

| ESLint source | oxlint |
| --- | --- |
| `@eslint/js` recommended | the same `eslint/*` rules, listed individually |
| `typescript-eslint` recommended | the same `typescript/*` rules, plus its `*.ts, *.tsx, *.mts, *.cts` override that turns off checks TypeScript already does and enables `no-var`, `prefer-const`, `prefer-rest-params`, `prefer-spread` |
| `eslint-plugin-react` recommended | the same `react/*` rules; `react/react-in-jsx-scope` off |
| `eslint-plugin-react-hooks` 5 recommended | `react/rules-of-hooks` error, `react/exhaustive-deps` warn |
| `eslint-plugin-jsx-a11y` recommended | the same `jsx-a11y/*` rules |
| `eslint-plugin-unicorn` 61 recommended | the same `unicorn/*` rules; `no-null` off; `filename-case` kebab or pascal; `catch-error-name` must be `exception`; `no-useless-undefined` with `checkArguments: false`; `prevent-abbreviations` was already off |
| `import/no-cycle` | `import/no-cycle` error |
| `array-callback-return` | `array-callback-return` with `allowImplicit: true` |
| `@typescript-eslint/consistent-type-imports` on `*.ts, *.tsx` | `typescript/consistent-type-imports` in the TypeScript override |
| global ignores | `ignorePatterns` for `node_modules`, `dist`, `build` |

`categories.correctness` is set to `off` so that only the listed rules run. This keeps the rule set identical to the ESLint package instead of picking up oxlint's own defaults.

Not carried over:

- `import/order`: not implemented in oxlint. `sortImports` in the oxfmt config replaces it.
- `prettier/prettier` and `eslint-config-prettier`: oxfmt is the formatter now.
- The MDX block: oxlint does not lint MDX.
- The Storybook block: `eslint-plugin-storybook` only works through oxlint's `jsPlugins`, which is alpha. Add it in your project if you need it.
- Rules the ESLint plugins mark as not applicable under oxlint (`no-dupe-args`, `no-octal`, `react/jsx-uses-react`, `react/jsx-uses-vars`, `react/no-deprecated`, `react/prop-types`): superseded by strict mode, TypeScript, or other rules.

### Formatter settings

Prettier's defaults as the ESLint package used them, written out explicitly where oxfmt's own defaults differ:

- `printWidth: 80`, `tabWidth: 2`, `semi: true`, `singleQuote: true`, `trailingComma: "all"`, `arrowParens` default (`always`)
- `sortPackageJson: false` (oxfmt's default is on)
- `sortImports` on, grouped like `import/order` with `newlines-between: always`: builtins, externals, internal, parent, sibling, index, then type-only imports
- `endOfLine` left unset. oxfmt defaults to `lf` and has no `auto`. Set `crlf` in your project if you need it.

Known oxfmt differences from Prettier 3 in JSON, YAML and CSS layout are not worked around here.

## Versioning

Semver. A rule moving from off to error or warn to error is a major release. New rules land as warnings in minors.

## Development

```bash
npm install
npm test
```

`npm test` checks that both JSON files parse, that `fixtures/pass` lints and formats clean, and that `fixtures/fail` trips each rule it is written to trip. It runs automatically before `npm publish`.

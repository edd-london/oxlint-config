# EDD oxlint Config

EDD London's shared [oxlint](https://oxc.rs/docs/guide/usage/linter.html) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) configuration. It is the oxlint version of [`@eddlondon/eslint-config-react`](https://www.npmjs.com/package/@eddlondon/eslint-config-react) 5: the same rules and decisions, translated one to one, split into a framework-free `base` entry and a `react` entry that builds on it.

[https://www.npmjs.com/package/@eddlondon/oxlint-config](https://www.npmjs.com/package/@eddlondon/oxlint-config)

**Requirements:**

- oxlint 1.87+
- oxfmt 0.72+ (optional, for formatting)
- oxlint-tsgolint 7+ (optional, for type-aware rules)
- Node 20+ (22.18+ to use `oxlint.config.ts`)

## Installation

```bash
npm i -D oxlint oxfmt @eddlondon/oxlint-config
# or
pnpm add -D oxlint oxfmt @eddlondon/oxlint-config
# or
yarn add -D oxlint oxfmt @eddlondon/oxlint-config
```

## Entries

| Entry | Contents | Use for |
| --- | --- | --- |
| `@eddlondon/oxlint-config/base` | eslint, typescript, unicorn and import rules | Node services, libraries, anything without JSX |
| `@eddlondon/oxlint-config/react` | `base` plus react, react-hooks and jsx-a11y rules | React apps and component libraries |
| `@eddlondon/oxlint-config/oxfmt` | formatter settings | every project |

Each entry also has a `.json` twin (`base.json`, `react.json`, `oxfmt.json`) for projects on JSON config files.

## Usage

### Linting with `oxlint.config.ts` (recommended)

```ts
import { defineConfig } from 'oxlint';
import react from '@eddlondon/oxlint-config/react';

export default defineConfig({
  extends: [react],
  rules: {
    // project overrides go here
  },
});
```

Use `base` instead of `react` for a project without JSX. Needs the Node-based `oxlint` package and Node 22.18+. This is also the route for Yarn PnP projects, which have no `node_modules` folder.

### Ignores

The package ships no lint `ignorePatterns`. oxlint resolves them relative to the file that declares them, so patterns inside `node_modules` would never match your tree. oxlint already honours `.gitignore`; add anything else in your root config:

```ts
export default defineConfig({
  extends: [react],
  ignorePatterns: ['**/dist/**', '**/build/**', '**/generated/**'],
});
```

In a monorepo, the root config extends `base` and each React app or library has its own `oxlint.config.ts` extending the root plus `react`, the same way oxlint's nested configs work.

### Linting with `.oxlintrc.json`

oxlint's JSON `extends` takes file paths, not package names, so point it at the generated file inside `node_modules`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@eddlondon/oxlint-config/react.json"],
  "rules": {}
}
```

### Formatting

oxfmt has no `extends`. Spread the config object in `oxfmt.config.ts` and add your project's settings after it:

```ts
import { defineConfig } from 'oxfmt';
import edd from '@eddlondon/oxlint-config/oxfmt';

export default defineConfig({
  ...edd,
  endOfLine: 'lf',
});
```

Or copy `node_modules/@eddlondon/oxlint-config/oxfmt.json` to `.oxfmtrc.json` and edit it.

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

Translated from `@eddlondon/eslint-config-react` 5 with `@oxlint/migrate`, pinned to the plugin versions that package declares, then checked line by line. One module per plugin under `src/plugins`, composed into the two entries.

| ESLint source | oxlint module |
| --- | --- |
| `@eslint/js` recommended | `eslint`: the same core rules, listed individually |
| `typescript-eslint` recommended | `typescript`: the same `typescript/*` rules, plus its `*.ts, *.tsx, *.mts, *.cts` override that turns off checks TypeScript already does, enables `no-var`, `prefer-const`, `prefer-rest-params`, `prefer-spread`, and `consistent-type-imports` |
| `eslint-plugin-unicorn` 61 recommended | `unicorn`: the same rules; `no-null` off; `filename-case` kebab or pascal; `catch-error-name` must be `exception`; `no-useless-undefined` with `checkArguments: false` |
| `import/no-cycle` | `import` |
| `eslint-plugin-react` recommended, `react-hooks` 5 recommended, `jsx-a11y` recommended | `react`: the same rules on `*.jsx, *.tsx`; hooks rules on all script files; `react-in-jsx-scope` off |
| global ignores | not shipped, see Ignores above |

`categories.correctness` is set to `off` so that only the listed rules run. This keeps the rule set identical to the ESLint package instead of picking up oxlint's own defaults.

Additions beyond the ESLint package, taken from EDD projects already on oxlint where every project had made the same choice or the rule is uncontroversial:

| Entry | Addition | Severity |
| --- | --- | --- |
| base | `no-unused-vars` ignores `_`-prefixed names and rest siblings | error (options only) |
| base | `no-unassigned-vars`, `preserve-caught-error` (`@eslint/js` 10 recommended) | error, warn |
| base | `no-useless-constructor` | warn |
| base | `typescript/ban-ts-comment` requires a description of 10+ characters | error (options only) |
| base | `import/no-duplicates`, `import/no-named-as-default` | warn |
| base | `*.cjs` and `*.config.js`: `prefer-module`, `prefer-export-from`, `no-require-imports` off | override |
| react | `react/void-dom-elements-no-children` | error |
| react | `react/jsx-no-script-url`, `react/iframe-missing-sandbox`, `react/no-unsafe` | warn |
| react | `react/no-array-index-key`, `react/no-danger`, `react/jsx-curly-brace-presence` | warn |

Not carried over:

- `import/order`: not implemented in oxlint. `sortImports` in the oxfmt config replaces it.
- `prettier/prettier` and `eslint-config-prettier`: oxfmt is the formatter now.
- The MDX block: oxlint does not lint MDX.
- The Storybook block: `eslint-plugin-storybook` only works through oxlint's `jsPlugins`, which is alpha. Add it in your project if you need it.
- Rules oxlint marks as not applicable (`no-dupe-args`, `no-octal`, `react/jsx-uses-react`, `react/jsx-uses-vars`, `react/no-deprecated`, `react/prop-types`): superseded by strict mode, TypeScript, or other rules.

Known divergences, where oxlint's implementation is stricter than the ESLint plugin on code the ESLint config accepted. Both are kept at the ESLint severity; override locally if they bite:

- `unicorn/numeric-separators-style` reports "invalid group length" on fractional digits grouped in threes, such as `51.545_462_146`. The ESLint rule accepts that.
- `react/display-name` reports components created with `forwardRef` or `memo` and assigned to a named `const`. The ESLint rule accepts that.

### Formatter settings

Prettier's defaults as the ESLint package used them, written out where oxfmt's own defaults differ:

- `printWidth: 80`, `tabWidth: 2`, `semi: true`, `singleQuote: true`, `trailingComma: "all"`
- `sortPackageJson: true`
- `sortImports` on, grouped like `import/order` with `newlines-between: always`: builtins, externals, internal, parent, sibling, index, then type-only imports
- `useTabs` unset: oxfmt reads `indent_style` from your `.editorconfig`
- `endOfLine` unset: oxfmt defaults to `lf` and has no `auto`; set `crlf` in your project if you need it

## Versioning

Semver. A rule moving from off to error or warn to error is a major release. New rules land as warnings in minors.

## Development

```bash
npm install
npm test
```

`npm run build` compiles `src` to `dist` and generates the three JSON files. `npm test` builds, then checks that the JSON parses, that `fixtures/pass` lints and formats clean, that `fixtures/fail` trips each rule it is written to trip under `react`, that `base` reports no react or jsx-a11y rule, and that an `oxlint.config.ts` consumer of the compiled entry sees the same findings. It runs automatically before `npm publish`.

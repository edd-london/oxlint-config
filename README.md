# EDD oxlint Config

EDD London's shared [oxlint](https://oxc.rs/docs/guide/usage/linter.html) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) configuration. It is the oxlint version of [`@eddlondon/eslint-config-react`](https://www.npmjs.com/package/@eddlondon/eslint-config-react) 5: the same rules and decisions, translated one to one, split into a framework-free `base` entry and a `react` entry that builds on it, plus a `nextjs` entry for Next.js apps.

[https://www.npmjs.com/package/@eddlondon/oxlint-config](https://www.npmjs.com/package/@eddlondon/oxlint-config)

**Requirements:**

- oxlint 1.87+
- oxfmt 0.72+ (optional, for formatting)
- oxlint-tsgolint 7+ (optional, for type-aware rules)
- Node 20+ (22.18+ to use `oxlint.config.mts`)

## Installation

```bash
npm i -D oxlint oxfmt @eddlondon/oxlint-config
# or
pnpm add -D oxlint oxfmt @eddlondon/oxlint-config
# or
yarn add -D oxlint oxfmt @eddlondon/oxlint-config
```

pnpm 11 and later refuse versions published less than 24 hours ago (`minimumReleaseAge`). To adopt a fresh release of this package straight away, exclude the scope in `pnpm-workspace.yaml`, or wait a day:

```yaml
minimumReleaseAgeExclude:
  - '@eddlondon/*'
```

## Entries

| Entry                            | Contents                                          | Use for                                        |
| -------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| `@eddlondon/oxlint-config/base`  | eslint, typescript, unicorn and import rules      | Node services, libraries, anything without JSX |
| `@eddlondon/oxlint-config/react` | `base` plus react, react-hooks and jsx-a11y rules | React apps and component libraries             |
| `@eddlondon/oxlint-config/nextjs` | `react` plus oxlint's port of `@next/eslint-plugin-next` | Next.js apps                                   |
| `@eddlondon/oxlint-config/oxfmt` | formatter settings                                | every project                                  |

Each entry also has a `.json` twin (`base.json`, `react.json`, `nextjs.json`, `oxfmt.json`) for projects on JSON config files.

## Usage

### Linting with `oxlint.config.mts` (recommended)

```ts
import react from '@eddlondon/oxlint-config/react';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [react],
  rules: {
    // rules the package does not set go here
  },
});
```

Use `base` instead of `react` for a project without JSX, or `nextjs` for a Next.js app. Needs the Node-based `oxlint` package and Node 22.18+. This is also the route for Yarn PnP projects, which have no `node_modules` folder.

Name the file `oxlint.config.mts` (and `oxfmt.config.mts`) unless the project already has `"type": "module"` in its `package.json`. The `.mts` form loads as an ES module everywhere; a plain `.ts` config in a CommonJS project prints Node's module-type warning on every run.

### Changing a rule the package sets

The package puts every rule inside an `overrides` block that also names its plugin, so that each entry stays self-contained. oxlint applies overrides after the root `rules`, which has two consequences for you:

- A root-level `rules` entry cannot change a rule the package sets. Put the change in your own `overrides` block, which runs after the package's.
- An override only sees the plugins it names itself. Add `plugins` to the block, or the rule is silently ignored.

For example, to let `react/no-unknown-property` accept styled-jsx's `<style jsx global>` attributes:

```ts
export default defineConfig({
  extends: [react],
  overrides: [
    {
      files: ['**/*.{jsx,tsx}'],
      plugins: ['react'],
      rules: {
        'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
      },
    },
  ],
});
```

Rules the package does not set, such as a framework plugin's, go in the root `rules` as usual.

### Next.js

```ts
import nextjs from '@eddlondon/oxlint-config/nextjs';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nextjs],
  ignorePatterns: ['**/node_modules/**', '.next/**', 'out/**', 'next-env.d.ts'],
});
```

`nextjs` is `react` plus the 21 rules of oxlint's built-in `nextjs` plugin at the severities of `@next/eslint-plugin-next`'s `recommended` and `core-web-vitals` presets. The package turns oxlint's rule categories off, so adding `plugins: ['nextjs']` yourself would enable nothing; this entry lists the rules. If the app uses styled-jsx, add the override from the previous section.

### Ignores

The package ships no lint `ignorePatterns`. oxlint only honours `ignorePatterns` declared directly in the config file it loads; they are not merged from `extends`, and a nested config does not inherit the root's. So declare them yourself, in every config file oxlint loads:

```ts
export default defineConfig({
  extends: [react],
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/generated/**',
  ],
});
```

oxlint skips files listed in a `.gitignore` it finds, which usually covers `node_modules`, but keep it in the list so a checkout without `.gitignore` behaves the same.

### Monorepos

The root config extends `base` and each React app or library has its own `oxlint.config.mts` extending the root plus `react`, the same way oxlint's nested configs work. Each nested config repeats the `ignorePatterns` it needs, since they are not inherited.

```ts
import base from '@eddlondon/oxlint-config/base';
// oxlint.config.mts at the repo root
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [base],
  ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/generated/**'],
});
```

```ts
import react from '@eddlondon/oxlint-config/react';
// apps/web/oxlint.config.mts
import { defineConfig } from 'oxlint';

import root from '../../oxlint.config.mts';

export default defineConfig({
  extends: [root, react],
  ignorePatterns: ['.next/**', 'storybook-static/**'],
});
```

### Linting with `.oxlintrc.json`

oxlint's JSON `extends` takes file paths, not package names, so point it at the generated file inside `node_modules`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": ["./node_modules/@eddlondon/oxlint-config/react.json"],
  "ignorePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/generated/**"
  ],
  "rules": {}
}
```

The same ignore rule applies: declare `ignorePatterns` in this file, they are not read from the extended one.

### Formatting

oxfmt has no `extends`. Spread the config object in `oxfmt.config.mts` and add your project's settings after it:

```ts
import edd from '@eddlondon/oxlint-config/oxfmt';
import { defineConfig } from 'oxfmt';

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

Install the [oxc VS Code extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) and disable the ESLint and Prettier extensions for the workspace. In `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true,
  "eslint.enable": false,
  "prettier.enable": false
}
```

## Migrating from `@eddlondon/eslint-config-react`

1. Remove `eslint`, `@eslint/js`, `typescript-eslint`, `prettier`, `@eddlondon/eslint-config-react` and any ESLint plugins the project added. Delete `eslint.config.*` and the Prettier config file.
2. Install `oxlint`, `oxfmt` and this package. Add `oxlint-tsgolint` if you want type-aware rules.
3. Create `oxlint.config.mts` and `oxfmt.config.mts` as shown above. Carry over the project's own overrides, ignores and framework plugins. Project-specific rules the ESLint config set locally stay local.
4. Replace the lint and format scripts, and update lint-staged, lefthook or similar hooks to call `oxlint` and `oxfmt --check` on staged files.
5. Run `oxfmt` once and commit the result on its own. Expect every file with imports to change, because `sortImports` groups them differently from `import/order`, and `package.json` keys to be reordered by `sortPackageJson`. oxfmt also formats CSS, YAML, JSON and Markdown, which Prettier was usually never pointed at, so pipeline and config files change too; nothing has gone wrong. Add file types you do not want formatted to `ignorePatterns` in `oxfmt.config.mts`. This commit is whitespace and ordering only.
6. Run `oxlint`. Errors should match what ESLint reported before. New warnings come from the additions listed under "What is in the config"; `react/jsx-curly-brace-presence` is usually the largest group and `oxlint --fix` clears it.

Things ESLint did that oxlint does not: MDX linting, Storybook rules (unless you enable oxlint's alpha `jsPlugins`), Nx module boundaries, and JSON, YAML or Markdown rules. Keep a slim ESLint config for those if the project needs them, as nexus does.

## What is in the config

### Lint rules

Translated from `@eddlondon/eslint-config-react` 5 with `@oxlint/migrate`, pinned to the plugin versions that package declares, then checked line by line. One module per plugin under `src/plugins`, composed into the entries.

| ESLint source                                                                          | oxlint module                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@eslint/js` recommended                                                               | `eslint`: the same core rules, listed individually                                                                                                                                                                                               |
| `typescript-eslint` recommended                                                        | `typescript`: the same `typescript/*` rules, plus its `*.ts, *.tsx, *.mts, *.cts` override that turns off checks TypeScript already does, enables `no-var`, `prefer-const`, `prefer-rest-params`, `prefer-spread`, and `consistent-type-imports` |
| `eslint-plugin-unicorn` 61 recommended                                                 | `unicorn`: the same rules; `no-null` off; `filename-case` kebab or pascal; `catch-error-name` must be `exception`; `no-useless-undefined` with `checkArguments: false`                                                                           |
| `import/no-cycle`                                                                      | `import`                                                                                                                                                                                                                                         |
| `eslint-plugin-react` recommended, `react-hooks` 5 recommended, `jsx-a11y` recommended | `react`: the same rules on `*.jsx, *.tsx`; hooks rules on all script files; `react-in-jsx-scope` off                                                                                                                                             |
| global ignores                                                                         | not shipped, see Ignores above                                                                                                                                                                                                                   |
| not in the ESLint package                                                              | `nextjs`: oxlint's port of `@next/eslint-plugin-next` at its `recommended` and `core-web-vitals` severities, only in the `nextjs` entry                                                                                                          |

`categories.correctness` is set to `off` so that only the listed rules run. This keeps the rule set identical to the ESLint package instead of picking up oxlint's own defaults.

Additions beyond the ESLint package, taken from EDD projects already on oxlint where every project had made the same choice or the rule is uncontroversial:

| Entry | Addition                                                                                   | Severity             |
| ----- | ------------------------------------------------------------------------------------------ | -------------------- |
| base  | `no-unused-vars` ignores `_`-prefixed names and rest siblings                              | error (options only) |
| base  | `no-unassigned-vars`, `preserve-caught-error` (`@eslint/js` 10 recommended)                | error, warn          |
| base  | `no-useless-constructor`                                                                   | warn                 |
| base  | `typescript/ban-ts-comment` requires a description of 10+ characters                       | error (options only) |
| base  | `import/no-duplicates`, `import/no-named-as-default`                                       | warn                 |
| base  | `*.cjs` and `*.config.js`: `prefer-module`, `prefer-export-from`, `no-require-imports` off | override             |
| react | `react/void-dom-elements-no-children`                                                      | error                |
| react | `react/jsx-no-script-url`, `react/iframe-missing-sandbox`, `react/no-unsafe`               | warn                 |
| react | `react/no-array-index-key`, `react/no-danger`, `react/jsx-curly-brace-presence`            | warn                 |

Not carried over:

- `import/order`: not implemented in oxlint. `sortImports` in the oxfmt config replaces it.
- `prettier/prettier` and `eslint-config-prettier`: oxfmt is the formatter now.
- The MDX block: oxlint does not lint MDX.
- The Storybook block: `eslint-plugin-storybook` only works through oxlint's `jsPlugins`, which is alpha. Add it in your project if you need it.
- Rules oxlint marks as not applicable (`no-dupe-args`, `no-octal`, `react/jsx-uses-react`, `react/jsx-uses-vars`, `react/no-deprecated`, `react/prop-types`): superseded by strict mode, TypeScript, or other rules.

Known divergences, where oxlint's implementation is stricter than the ESLint plugin on code the ESLint config accepted. Both are set to `warn` instead of the ESLint package's `error` so a first lint run does not fail on working code. They will move to `error` in a major release once oxlint matches the ESLint plugins:

- `unicorn/numeric-separators-style` reports "invalid group length" on fractional digits grouped in threes, such as `51.545_462_146`. The ESLint rule accepts that. oxlint accepts fractional digits with no separators at all, so writing `51.545462146` clears the warning.
- `react/display-name` reports components created with `forwardRef` or `memo` and assigned to a named `const`. The ESLint rule accepts that.

### Formatter settings

Prettier's defaults as the ESLint package used them, written out where oxfmt's own defaults differ:

- `printWidth: 80`, `tabWidth: 2`, `semi: true`, `singleQuote: true`, `trailingComma: "all"`
- `sortPackageJson: true`
- `sortImports` on, grouped like `import/order` with `newlines-between: always`: builtins, externals, internal, parent, sibling, index, then type-only imports
- `useTabs` unset: oxfmt reads `indent_style` from your `.editorconfig`
- `endOfLine` unset: oxfmt defaults to `lf` and has no `auto`; set `crlf` in your project if you need it
- `ignorePatterns` for `node_modules`, `dist`, `build` and `generated`. Unlike the lint entries this works because you spread the object into your own config. Setting your own `ignorePatterns` key replaces the list, so extend it: `ignorePatterns: [...edd.ignorePatterns, '.next/**']`

## Versioning

Semver. A rule moving from off to error or warn to error is a major release. New rules land as warnings in minors.

## Development

```bash
npm install
npm test
```

`npm run build` compiles `src` to `dist` and generates the four JSON files. `npm test` builds, then checks that the JSON parses, that `fixtures/pass` lints and formats clean, that `fixtures/fail` trips each rule it is written to trip under `react` and `nextjs`, that `base` and `react` report no rule from a plugin they do not include, and that an `oxlint.config.ts` consumer of the compiled entry sees the same findings. It runs automatically before `npm publish`.

# Changelog

All notable changes to `@eddlondon/oxlint-config`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versions follow [Semantic Versioning](https://semver.org/): a rule moving from off to error or warn to error is a major, new entries and new rules at warn are minors, everything else is a patch.

## [1.1.2] - 2026-10-09

### Changed

- The `oxfmt` entry is typed as oxfmt's `OxfmtConfig` with `ignorePatterns` required, so its declaration file is a type reference like the lint entries and the `[...edd.ignorePatterns]` recipe still type-checks.

### Added

- This changelog, shipped in the package. The tests refuse a release whose version has no entry here.

## [1.1.1] - 2026-10-09

### Fixed

- Entries are typed as oxlint's `OxlintConfig`, so each declaration file is a type reference instead of inlining every rule of every entry it extends (1,909 lines down to 42). Runtime output unchanged.

### Changed

- README and source note that `nextjs/no-html-link-for-pages` and `nextjs/no-sync-scripts` are errors because the `core-web-vitals` preset promotes them.

## [1.1.0] - 2026-10-09

### Added

- `@eddlondon/oxlint-config/nextjs` entry, with a `nextjs.json` twin: `react` plus oxlint's port of `@next/eslint-plugin-next` at its `recommended` and `core-web-vitals` severities.

### Changed

- README: changing a rule the package sets needs a consumer `overrides` block with both `files` and `plugins`; `.mts` config files recommended over `.ts`; pnpm `minimumReleaseAge` note; `unicorn/numeric-separators-style` workaround; oxfmt also formats CSS, YAML, JSON and Markdown.

## [1.0.0] - 2026-10-08

### Added

- First release: the rules of `@eddlondon/eslint-config-react` 5 translated one to one into `base` (eslint, typescript, unicorn, import) and `react` (plus react, react-hooks, jsx-a11y) entries, each with a JSON twin, and an `oxfmt` entry with the matching formatter settings.
- Additions beyond the ESLint package: `no-unused-vars` ignores `_`-prefixed names and rest siblings; `no-unassigned-vars`, `preserve-caught-error`, `no-useless-constructor`; `typescript/ban-ts-comment` requires a 10+ character description; `import/no-duplicates`, `import/no-named-as-default`; a CommonJS override for `*.cjs` and `*.config.js`; `react/void-dom-elements-no-children`, `react/jsx-no-script-url`, `react/iframe-missing-sandbox`, `react/no-unsafe`, `react/no-array-index-key`, `react/no-danger`, `react/jsx-curly-brace-presence`.
- `unicorn/numeric-separators-style` and `react/display-name` at warn instead of error, because oxlint is stricter than the ESLint plugins on code the ESLint config accepted.

[1.1.2]: https://github.com/edd-london/oxlint-config/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/edd-london/oxlint-config/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/edd-london/oxlint-config/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/edd-london/oxlint-config/releases/tag/v1.0.0

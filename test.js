// Package self-check, run by `npm test` after the build:
//  1. the generated JSON parses;
//  2. fixtures/pass lints and formats clean;
//  3. fixtures/fail trips every rule it is written for, under each entry;
//  4. `base` reports no react, jsx-a11y or nextjs rule, and `react` no
//     nextjs rule;
//  5. an `oxlint.config.ts` consumer of the compiled entry sees the same
//     findings as the JSON twin, and its own ignorePatterns apply;
//  6. the published .d.ts files stay type references.
import { spawnSync } from 'node:child_process';
import { cpSync, readFileSync, rmSync } from 'node:fs';

const expectedFailures = [
  'unicorn/filename-case',
  'unicorn/catch-error-name',
  'typescript/consistent-type-imports',
  'typescript/no-explicit-any',
  'array-callback-return',
  'react/jsx-key',
  'jsx-a11y/alt-text',
  // Additions beyond the ESLint package.
  'no-useless-constructor',
  'import/no-duplicates',
  'typescript/ban-ts-comment',
  'react/void-dom-elements-no-children',
  'react/no-array-index-key',
  'react/jsx-curly-brace-presence',
];

// Only the nextjs entry reports these. oxlint codes them as next(...).
const expectedNextFailures = ['next/no-img-element', 'next/no-sync-scripts'];

function run(command, args, cwd = process.cwd()) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    shell: true,
  });
  return {
    code: result.status ?? 1,
    output: `${result.stdout}${result.stderr}`,
  };
}

let failed = false;
function check(ok, label, detail = '') {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) {
    failed = true;
    if (detail) console.log(detail);
  }
}

// Diagnostic codes look like `unicorn(filename-case)` or `eslint(no-var)`.
function reportedRules(output) {
  const rules = new Set();
  try {
    for (const diagnostic of JSON.parse(output).diagnostics ?? []) {
      const match = /^(?:eslint-plugin-)?([\w-]+)\(([\w-]+)\)$/.exec(
        diagnostic.code,
      );
      if (match)
        rules.add(match[1] === 'eslint' ? match[2] : `${match[1]}/${match[2]}`);
    }
  } catch {
    return null;
  }
  return rules;
}

for (const file of ['base.json', 'react.json', 'nextjs.json', 'oxfmt.json']) {
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8'));
    check(true, `${file} is valid JSON`);
    if (file !== 'oxfmt.json') {
      // Shipped ignorePatterns would never apply; see src/base.ts.
      check(
        parsed.ignorePatterns === undefined,
        `${file} ships no ignorePatterns`,
      );
    }
  } catch (exception) {
    check(false, `${file} is valid JSON`, String(exception));
  }
}

const pass = run('npx', ['oxlint', '-c', 'react.json', 'fixtures/pass']);
check(pass.code === 0, 'fixtures/pass lints clean under react', pass.output);

const passNext = run('npx', ['oxlint', '-c', 'nextjs.json', 'fixtures/pass']);
check(
  passNext.code === 0,
  'fixtures/pass lints clean under nextjs',
  passNext.output,
);

const fmt = run('npx', [
  'oxfmt',
  '-c',
  'oxfmt.json',
  '--check',
  'fixtures/pass',
]);
check(fmt.code === 0, 'fixtures/pass is formatted', fmt.output);

const reactFail = reportedRules(
  run('npx', [
    'oxlint',
    '-c',
    'react.json',
    '--format',
    'json',
    'fixtures/fail',
  ]).output,
);
check(reactFail !== null, 'fixtures/fail produced JSON output under react');
for (const rule of expectedFailures) {
  check(
    reactFail?.has(rule),
    `react reports ${rule}`,
    `reported: ${[...(reactFail ?? [])].join(', ')}`,
  );
}
const reactLeaked = [...(reactFail ?? [])].filter((rule) =>
  rule.startsWith('next/'),
);
check(
  reactLeaked.length === 0,
  'react reports no nextjs rule',
  `leaked: ${reactLeaked.join(', ')}`,
);

const nextFail = reportedRules(
  run('npx', [
    'oxlint',
    '-c',
    'nextjs.json',
    '--format',
    'json',
    'fixtures/fail',
  ]).output,
);
for (const rule of [...expectedFailures, ...expectedNextFailures]) {
  check(
    nextFail?.has(rule),
    `nextjs reports ${rule}`,
    `reported: ${[...(nextFail ?? [])].join(', ')}`,
  );
}

const baseFail = reportedRules(
  run('npx', ['oxlint', '-c', 'base.json', '--format', 'json', 'fixtures/fail'])
    .output,
);
const leaked = [...(baseFail ?? [])].filter((rule) =>
  /^(react|jsx-a11y|next)\//.test(rule),
);
check(
  leaked.length === 0,
  'base reports no react, jsx-a11y or nextjs rule',
  `leaked: ${leaked.join(', ')}`,
);
for (const rule of expectedFailures.filter(
  (rule) => !/^(react|jsx-a11y)\//.test(rule),
)) {
  check(baseFail?.has(rule), `base reports ${rule}`);
}

// TypeScript consumer: fixtures/ts-consumer/oxlint.config.ts extends
// dist/react.js. oxlint refuses ".." paths, so the fail fixtures are copied
// in. The copy under src/ignored must stay silent: the consumer config
// ignores it.
rmSync('fixtures/ts-consumer/src', { recursive: true, force: true });
cpSync('fixtures/fail', 'fixtures/ts-consumer/src', { recursive: true });
cpSync('fixtures/fail', 'fixtures/ts-consumer/src/ignored', {
  recursive: true,
});
const tsConsumerOutput = run(
  'npx',
  ['oxlint', '--format', 'json', 'src'],
  'fixtures/ts-consumer',
).output;
rmSync('fixtures/ts-consumer/src', { recursive: true, force: true });
const tsConsumer = reportedRules(tsConsumerOutput);
check(tsConsumer !== null, 'oxlint.config.ts consumer produced JSON output');
for (const rule of expectedFailures) {
  check(tsConsumer?.has(rule), `oxlint.config.ts consumer reports ${rule}`);
}
let ignoredHits = 0;
try {
  for (const diagnostic of JSON.parse(tsConsumerOutput).diagnostics ?? []) {
    if (/[\\/]ignored[\\/]/.test(diagnostic.filename)) ignoredHits += 1;
  }
} catch {
  ignoredHits = -1;
}
check(
  ignoredHits === 0,
  'consumer-root ignorePatterns apply alongside the extended entry',
  `diagnostics under src/ignored: ${ignoredHits}`,
);

// Entries are typed as OxlintConfig; without that each .d.ts inlines every
// rule of every entry it extends.
for (const file of ['base', 'react', 'nextjs']) {
  const lines = readFileSync(`dist/${file}.d.ts`, 'utf8').split('\n').length;
  check(
    lines <= 10,
    `dist/${file}.d.ts stays a type reference`,
    `${lines} lines`,
  );
}

process.exitCode = failed ? 1 : 0;

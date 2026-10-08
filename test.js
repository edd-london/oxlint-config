// Package self-check, run by `npm test` after the build.
//  1. The generated JSON files parse.
//  2. fixtures/pass lints clean under `react` and formats clean under oxfmt.
//  3. fixtures/fail reports every rule it is written to trip under `react`.
//  4. `base` reports no react or jsx-a11y rule at all: the split holds.
//  5. A TypeScript consumer (`oxlint.config.ts` extending the compiled entry)
//     sees the same findings as the JSON twin.
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
  // Step 4 additions.
  'no-useless-constructor',
  'import/no-duplicates',
  'typescript/ban-ts-comment',
  'react/void-dom-elements-no-children',
  'react/no-array-index-key',
  'react/jsx-curly-brace-presence',
];

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

// oxlint codes look like `unicorn(filename-case)` or `eslint(no-var)`.
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

for (const file of ['base.json', 'react.json', 'oxfmt.json']) {
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8'));
    check(true, `${file} is valid JSON`);
    if (file !== 'oxfmt.json') {
      // oxlint does not merge ignorePatterns from extends; shipping them would
      // only mislead consumers into thinking they apply.
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

const baseFail = reportedRules(
  run('npx', ['oxlint', '-c', 'base.json', '--format', 'json', 'fixtures/fail'])
    .output,
);
const leaked = [...(baseFail ?? [])].filter((rule) =>
  /^(react|jsx-a11y)\//.test(rule),
);
check(
  leaked.length === 0,
  'base reports no react or jsx-a11y rule',
  `leaked: ${leaked.join(', ')}`,
);
for (const rule of expectedFailures.filter(
  (rule) => !/^(react|jsx-a11y)\//.test(rule),
)) {
  check(baseFail?.has(rule), `base reports ${rule}`);
}

// TypeScript consumer: fixtures/ts-consumer/oxlint.config.ts extends dist/react.js.
// oxlint refuses paths containing "..", so the fail fixtures are copied in.
// A second copy under src/ignored must stay silent: the consumer config
// declares ignorePatterns for it, which is the only place oxlint reads them.
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

process.exitCode = failed ? 1 : 0;

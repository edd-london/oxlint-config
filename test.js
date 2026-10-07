// Package self-check, run before every publish.
//  1. index.json and oxfmt.json parse and load as oxlint / oxfmt configs.
//  2. fixtures/pass lints and formats clean.
//  3. fixtures/fail reports every rule it is written to trip.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const expectedFailures = [
  'unicorn/filename-case',
  'unicorn/catch-error-name',
  'typescript/consistent-type-imports',
  'typescript/no-explicit-any',
  'array-callback-return',
];

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', shell: true });
  return { code: result.status ?? 1, output: `${result.stdout}${result.stderr}` };
}

let failed = false;
function check(ok, label, detail = '') {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) {
    failed = true;
    if (detail) console.log(detail);
  }
}

for (const file of ['index.json', 'oxfmt.json']) {
  try {
    JSON.parse(readFileSync(file, 'utf8'));
    check(true, `${file} is valid JSON`);
  } catch (exception) {
    check(false, `${file} is valid JSON`, String(exception));
  }
}

const pass = run('npx', ['oxlint', '-c', 'index.json', 'fixtures/pass']);
check(pass.code === 0, 'fixtures/pass lints clean', pass.output);

const fmt = run('npx', ['oxfmt', '-c', 'oxfmt.json', '--check', 'fixtures/pass']);
check(fmt.code === 0, 'fixtures/pass is formatted', fmt.output);

const fail = run('npx', ['oxlint', '-c', 'index.json', '--format', 'json', 'fixtures/fail']);
let reported = new Set();
try {
  const parsed = JSON.parse(fail.output);
  for (const diagnostic of parsed.diagnostics ?? []) {
    // oxlint codes look like `unicorn(filename-case)` or `eslint(no-var)`.
    const match = /^(?:eslint-plugin-)?([\w-]+)\(([\w-]+)\)$/.exec(diagnostic.code);
    if (!match) continue;
    reported.add(match[1] === 'eslint' ? match[2] : `${match[1]}/${match[2]}`);
  }
} catch (exception) {
  check(false, 'fixtures/fail produced JSON output', `${exception}\n${fail.output}`);
}
for (const rule of expectedFailures) {
  check(reported.has(rule), `fixtures/fail reports ${rule}`, `reported: ${[...reported].join(', ')}`);
}

process.exit(failed ? 1 : 0);

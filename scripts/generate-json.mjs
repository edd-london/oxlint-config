// Writes the JSON twin of each compiled entry for projects on .oxlintrc.json
// or .oxfmtrc.json. oxlint's JSON `extends` takes file paths only, so each
// entry's `extends` chain is flattened into one self-contained config.
import { writeFileSync } from 'node:fs';

import base from '../dist/base.js';
import nextjs from '../dist/nextjs.js';
import oxfmt from '../dist/oxfmt.js';
import react from '../dist/react.js';

const OXLINT_SCHEMA =
  'https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json';
const OXFMT_SCHEMA =
  'https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxfmt/configuration_schema.json';

const union = (a = [], b = []) => [...new Set([...a, ...b])];

// Later configs win, as in oxlint's own `extends` handling.
function flatten(config) {
  const parents = (config.extends ?? []).map((parent) => flatten(parent));
  const { extends: _ignored, ...own } = config;
  let acc = {};
  for (const c of [...parents, own]) {
    acc = {
      ...acc,
      ...c,
      plugins: union(acc.plugins, c.plugins),
      categories: { ...acc.categories, ...c.categories },
      env: { ...acc.env, ...c.env },
      rules: { ...acc.rules, ...c.rules },
      overrides: [...(acc.overrides ?? []), ...(c.overrides ?? [])],
    };
  }
  // oxlint never reads ignorePatterns through `extends`; refuse rather than
  // ship ones that would not apply.
  if (acc.ignorePatterns) {
    throw new Error(
      'ignorePatterns found in a lint entry; consumers must declare ignores themselves',
    );
  }
  return acc;
}

function tidy(flat) {
  // Drop keys the flattening left empty.
  const out = { $schema: OXLINT_SCHEMA };
  for (const [key, value] of Object.entries(flat)) {
    const empty =
      value == null ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0);
    if (!empty) out[key] = value;
  }
  return out;
}

const write = (file, data) =>
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

write('base.json', tidy(flatten(base)));
write('react.json', tidy(flatten(react)));
write('nextjs.json', tidy(flatten(nextjs)));
write('oxfmt.json', { $schema: OXFMT_SCHEMA, ...oxfmt });
console.log('wrote base.json, react.json, nextjs.json, oxfmt.json');

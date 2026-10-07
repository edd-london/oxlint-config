// Expected findings:
//   unicorn/filename-case          (camelCase file name)
//   unicorn/catch-error-name       (catch binding must be `exception`)
//   typescript/consistent-type-imports (type used as value import)
//   typescript/no-explicit-any
//   array-callback-return
import { ReactElement } from 'react';

export function parse(input: any): ReactElement | undefined {
  try {
    [1, 2].map(value => {
      if (value > 1) {
        return value;
      }
    });
    return JSON.parse(input);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

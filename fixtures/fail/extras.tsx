// Expected findings for the additions beyond the ESLint package:
//   import/no-duplicates                  (two imports from 'react')
//   no-useless-constructor
//   typescript/ban-ts-comment             (description under 10 characters)
//   react/void-dom-elements-no-children
//   react/no-array-index-key
//   react/jsx-curly-brace-presence
import { useState } from 'react';
import { useEffect } from 'react';

export class Empty {
  constructor() {}
}

export function Extras({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, []);
  // @ts-expect-error: short
  const value: number = 'x';
  return (
    <div title={'plain'}>
      <br>{value}</br>
      {items.map((item, index) => (
        <span key={index}>{item}</span>
      ))}
      {open ? 'open' : 'closed'}
    </div>
  );
}

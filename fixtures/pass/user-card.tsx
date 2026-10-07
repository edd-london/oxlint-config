import { useEffect, useState } from 'react';

import type { ReactElement } from 'react';

type UserCardProps = {
  name: string;
  onSelect?: (name: string) => void;
};

export function UserCard({ name, onSelect }: UserCardProps): ReactElement {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `${name} (${count})`;
  }, [name, count]);

  const items = [1, 2, 3].map((value) => value * 2);

  return (
    <button
      type="button"
      onClick={() => {
        setCount((current) => current + 1);
        onSelect?.(name);
      }}
    >
      {name}: {items.join(', ')}
    </button>
  );
}

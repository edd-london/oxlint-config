// no-unused-vars exceptions: underscore-prefixed names and rest siblings.
type Props = { systemKey: string; label: string; count: number };

export function stripSystemKey({
  systemKey,
  ...rest
}: Props): Omit<Props, 'systemKey'> {
  return rest;
}

export function handler(_event: Event, payload: string): string {
  return payload.trim();
}

export const [first, _second] = ['a', 'b'];

// Expected findings under the react entry only:
//   react/jsx-key        (list items without keys)
//   jsx-a11y/alt-text    (image without alt)
// The base entry must report nothing from react or jsx-a11y for this file.
export function BadList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li>
          <img src={item.src} />
        </li>
      ))}
    </ul>
  );
}

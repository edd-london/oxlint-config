// Expected under react, and nothing from react or jsx-a11y under base:
//   react/jsx-key        (list items without keys)
//   jsx-a11y/alt-text    (image without alt)
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

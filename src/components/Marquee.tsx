type Props = { items: string[] };

/**
 * A slow ticker of the stack. The list is rendered twice and the track slides
 * by exactly -50%, which makes the loop seamless; the copy is hidden from
 * assistive technology so the items are not announced twice.
 */
export function Marquee({ items }: Props) {
  const row = (copy: number) => (
    <ul className="marquee__list">
      {items.map((item) => (
        <li className="marquee__item" key={`${item}-${copy}`}>
          <span className="marquee__dot" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee">
      <div className="marquee__track">
        {row(0)}
        <div aria-hidden="true">{row(1)}</div>
      </div>
    </div>
  );
}

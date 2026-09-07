type Props = {
  items: string[];
  /** Compact single-line form for dense contexts such as project cards. */
  inline?: boolean;
};

export function TechList({ items, inline = false }: Props) {
  if (inline) {
    return <p className="tech--inline">{items.join(' · ')}</p>;
  }

  return (
    <ul className="tech">
      {items.map((item) => (
        <li className="tech__item" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

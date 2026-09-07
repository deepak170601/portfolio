import type { CSSProperties } from 'react';

type Props = { name: string };

/** Word-level reveals preserve the display font's kerning and remain readable
 * without animation. The accessible name is announced as one complete phrase. */
export function AnimatedName({ name }: Props) {
  return (
    <h1 className="hero__name animated-name" aria-label={name}>
      {name.split(' ').map((word, index) => (
        <span
          className={index === 0 ? 'name__line' : 'name__line is-italic'}
          style={{ '--name-delay': `${180 + index * 180}ms` } as CSSProperties}
          aria-hidden="true"
          key={`${word}-${index}`}
        >
          <span className="name__word">{word}</span>
        </span>
      ))}
    </h1>
  );
}
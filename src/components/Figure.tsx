import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  caption?: ReactNode;
  /** Removes the frame padding, for images that should bleed to the border. */
  flush?: boolean;
};

export function Figure({ children, caption, flush = false }: Props) {
  return (
    <figure className="figure">
      <div className={flush ? 'figure__frame figure__frame--flush' : 'figure__frame'}>
        {children}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/**
 * Stands in for an asset that does not exist yet, and says which one, so a gap
 * in the media set is obvious rather than looking like a broken image.
 */
export function Placeholder({ label }: { label: string }) {
  return <div className="placeholder">{label}</div>;
}

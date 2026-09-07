import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Props = {
  label: string;
  children: ReactNode;
  id?: string;
  /** Two-digit ordinal shown before the label, e.g. "01". */
  index?: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * A titled band. The heading is a real h2 so the document outline stays
 * correct, styled as a small display-face label with an ordinal and a rule
 * that fades out to the right.
 */
export function Section({ label, children, id, index }: Props) {
  const slug = id ?? slugify(label);

  return (
    <section className="section" id={slug} aria-labelledby={`${slug}-heading`}>
      <Reveal className="section__heading">
        <div className="section__head">
          {index ? (
            <span className="section__index" aria-hidden="true">
              {index}
            </span>
          ) : null}
          <h2 className="section__label" id={`${slug}-heading`}>
            {label}
          </h2>
          <span className="section__rule" aria-hidden="true" />
        </div>
      </Reveal>
      {/* One reveal for the whole body: the heading leads, the content
          follows just behind it. */}
      <Reveal className="section__body" delay={0.08}>{children}</Reveal>
    </section>
  );
}

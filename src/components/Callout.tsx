import type { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
  tone?: 'accent' | 'plain';
};

export function Callout({ label, children, tone = 'accent' }: Props) {
  return (
    <aside className={tone === 'plain' ? 'callout callout--plain' : 'callout'}>
      <p className="callout__label">{label}</p>
      <div className="callout__body">{children}</div>
    </aside>
  );
}

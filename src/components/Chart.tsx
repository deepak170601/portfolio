import { useEffect, useRef, useState, type ReactNode } from 'react';

export type ChartRow = {
  label: string;
  /** The real value, in the same units as `max`. */
  value: number;
  /** How the value should read, e.g. "0.939" or "1.00". */
  display: string;
  /** Marks the bar the surrounding prose is arguing for. */
  emphasis?: boolean;
};

type Props = {
  rows: ChartRow[];
  /** Top of the scale. Always pass the true axis maximum, never the data max. */
  max?: number;
  caption?: ReactNode;
  /** Accessible name for the group of bars. */
  label: string;
};

/**
 * Horizontal bars for a comparison the prose is making.
 *
 * Each bar's width is the real value; the grow-in is a CSS animation added on
 * intersection, with fill-mode `both`. If the class is never added, the bar
 * simply sits at its correct width — the animation can fail, the data cannot.
 */
export function Chart({ rows, max = 1, caption, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="chart" ref={ref} role="img" aria-label={label}>
        {rows.map((row, index) => (
          <div
            className="chart__row"
            key={row.label}
            data-emphasis={row.emphasis ? 'true' : undefined}
          >
            <span className="chart__label">{row.label}</span>
            <span className="chart__track">
              <span
                className={animate ? 'chart__bar is-animating' : 'chart__bar'}
                style={{
                  width: `${Math.min(Math.max(row.value / max, 0), 1) * 100}%`,
                  animationDelay: `${index * 90}ms`,
                }}
              />
            </span>
            <span className="chart__value">{row.display}</span>
          </div>
        ))}
      </div>
      {caption ? <p className="chart__caption">{caption}</p> : null}
    </div>
  );
}

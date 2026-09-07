import type { Metric } from '../content/types';
import { CountUp } from './CountUp';
import { Reveal } from './Reveal';

type Props = {
  metrics: Metric[];
  size?: 'md' | 'sm';
  /** Set false inside an already-revealing block, to avoid nested staggers. */
  reveal?: boolean;
};

/**
 * The site's signature element: label, figure, and the comparison that makes
 * the figure mean something. Figures count up when scrolled into view and are
 * tabular-lined so columns of numbers align.
 *
 * The Reveal wrapper carries the `metric` class rather than nesting inside a
 * second div: a definition list allows one div per dt/dd group, not two.
 */
export function MetricGrid({ metrics, size = 'md', reveal = true }: Props) {
  const className = size === 'sm' ? 'metrics metrics--sm' : 'metrics';

  return (
    <dl className={className}>
      {metrics.map((metric, index) => {
        const body = (
          <>
            <dt className="metric__label">{metric.label}</dt>
            <dd>
              <span className="metric__value">
                <CountUp value={metric.value} />
              </span>
              {metric.note ? <span className="metric__note">{metric.note}</span> : null}
            </dd>
          </>
        );

        return reveal ? (
          <Reveal className="metric" key={metric.label} delay={index * 0.08}>
            {body}
          </Reveal>
        ) : (
          <div className="metric" key={metric.label}>
            {body}
          </div>
        );
      })}
    </dl>
  );
}

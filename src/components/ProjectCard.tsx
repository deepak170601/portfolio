import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { ProjectSummary } from '../content/types';
import { MetricGrid } from './MetricGrid';
import { TechList } from './TechList';

type Props = {
  project: ProjectSummary;
  index: number;
  total: number;
};

/**
 * One row of the work index. The whole row is a link, so the external repo and
 * demo links live on the case-study page rather than nested inside this anchor.
 *
 * The hover shift is a spring rather than a CSS transition — it settles rather
 * than stopping dead. Safe to animate: the row is fully visible at rest, so a
 * stalled spring costs the motion and nothing else.
 */
export function ProjectCard({ project, index, total }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="project-card-motion"
      {...(reduced ? {} : { whileHover: { y: -4 } })}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    >
      <Link className="project-card" to={`/${project.slug}`}>
        <span className="project-card__index">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>

        <div className="project-card__head">
          <h3 className="project-card__title">{project.name}</h3>
          <span className="project-card__year">{project.year}</span>
        </div>

        <div className="project-card__body">
          <div className="project-card__description">
            <p className="project-card__tagline">{project.tagline}</p>
            <div style={{ marginTop: 'var(--s-5)' }}>
              <TechList items={project.stack.slice(0, 6)} />
            </div>
            <span className="project-card__foot">
              Read the case study
              <span className="link-out__arrow" aria-hidden="true">
                &#8594;
              </span>
            </span>
          </div>

          <MetricGrid metrics={project.metrics} size="sm" reveal={false} />
        </div>
      </Link>
    </motion.div>
  );
}

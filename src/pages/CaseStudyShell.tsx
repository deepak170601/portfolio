import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LinkOut } from '../components/LinkOut';
import { MetricGrid } from '../components/MetricGrid';
import { TechList } from '../components/TechList';
import { nextProject } from '../content/projects';
import type { ProjectSummary } from '../content/types';
import { useDocumentMeta } from '../lib/useDocumentMeta';

type Props = {
  project: ProjectSummary;
  children: ReactNode;
};

/** Staggers the header in on mount. See `.hero-rise` in components.css. */
const rise = (delay: number) => ({ style: { '--d': `${delay}s` } as CSSProperties });

/**
 * Shared chrome for the three case studies: title block, live links, stack,
 * headline metrics, and the hand-off to the next project.
 */
export function CaseStudyShell({ project, children }: Props) {
  useDocumentMeta(project.meta.title, project.meta.description, `/${project.slug}`);

  const next = nextProject(project.slug);

  return (
    <article className="container page">
      <header className="case-header">
        <div className="hero-rise" {...rise(0)}>
          <Link className="case-header__back" to="/">
            <span aria-hidden="true">←</span> All work
          </Link>
        </div>

        <h1 className="case-header__title hero-rise" {...rise(0.06)}>
          {project.name}
        </h1>

        <p className="case-header__tagline hero-rise" {...rise(0.12)}>
          {project.tagline}
        </p>

        <div className="case-header__meta hero-rise" {...rise(0.18)}>
          <span className="eyebrow">{project.year}</span>
          {project.links.length > 0 ? (
            <div className="case-header__links">
              {project.links.map((link) => (
                <LinkOut
                  className={
                    link.label === 'Live demo' ? 'button button--primary' : 'button'
                  }
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </LinkOut>
              ))}
            </div>
          ) : null}
        </div>

        <div className="case-header__stack hero-rise" {...rise(0.24)}>
          <TechList items={project.stack} />
        </div>

        <div className="case-header__metrics hero-rise" {...rise(0.3)}>
          <MetricGrid metrics={project.metrics} reveal={false} />
        </div>
      </header>

      {children}

      {next ? (
        <nav className="case-nav" aria-label="More work">
          <Link className="link-out" to="/">
            <span className="link-out__arrow" aria-hidden="true">
              ←
            </span>
            <span>All work</span>
          </Link>
          <Link className="case-nav__next" to={`/${next.slug}`}>
            <span>Next — {next.name}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}

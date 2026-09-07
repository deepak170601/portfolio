import type { CSSProperties } from 'react';
import { AnimatedName } from '../components/AnimatedName';
import { Contact } from '../components/Contact';
import { LinkOut } from '../components/LinkOut';
import { Marquee } from '../components/Marquee';
import { MetricGrid } from '../components/MetricGrid';
import { ProjectCard } from '../components/ProjectCard';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { education, headlineMetrics, profile } from '../content/profile';
import { experience, skills } from '../content/experience';
import { projects } from '../content/projects';
import { useDocumentMeta } from '../lib/useDocumentMeta';

const MARQUEE = [
  'Java 17', 'Spring Boot', 'RabbitMQ', 'PostgreSQL', 'pgvector', 'AWS',
  'Docker', 'Python', 'FastAPI', 'Redis', 'Celery', 'Angular', 'React',
  'TypeScript', 'JMS', 'Hibernate', 'Micrometer', 'GitHub Actions',
];

export function Home() {
  useDocumentMeta(
    profile.name,
    'Java backend engineer building distributed, event-driven systems on Spring Boot, JMS and AWS — and proving they work: an error-recovery framework across 111 services, and retrieval tuned against labelled evaluation sets.',
    '/',
  );
  const rise = (delay: number) => ({ style: { '--d': `${delay}s` } as CSSProperties });

  return (
    <div className="page home-page">
      <div className="container">
        <section className="hero" aria-label="Introduction">
          <p className="badge hero-rise" {...rise(0)}>
            <span className="badge__dot" aria-hidden="true" />
            Available for backend roles
          </p>
          <AnimatedName name={profile.name} />
          <p className="hero__lead hero-rise" {...rise(0.16)}>
            I build distributed backend systems — then try to prove they actually work.
          </p>
          <p className="hero__summary hero-rise" {...rise(0.22)}>
            Two years on Spring Boot, JMS and AWS inside a production healthcare
            platform, including an{' '}
            <strong>
              automated error-recovery framework covering 111 services that required
              changing none of them
            </strong>
            . I hold the rest of my work to the same bar: retrieval tuned against
            labelled evaluation sets rather than by eye, and a guard that isn&rsquo;t
            finished until deleting it makes a test fail.
          </p>
          <div className="hero__actions hero-rise" {...rise(0.3)}>
            <a className="button button--primary" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
            <LinkOut className="button" href="/resume.pdf" download="Chekurthi-Deepak-CV.pdf">
              Résumé
            </LinkOut>
            <LinkOut className="button" href="https://github.com/deepak170601">
              GitHub
            </LinkOut>
          </div>
          <figure className="hero__art hero-rise" style={{ '--d': '0.4s' } as CSSProperties}>
            <img
              src="/backend-systems-v2.png"
              alt="Conceptual illustration of service clusters exchanging queued events, a retry loop recovering a failed service, incident correlation, and document retrieval with source citations."
              width={1254}
              height={1254}
              decoding="async"
              fetchPriority="high"
            />
            <figcaption>Event-driven services. Automated recovery. Grounded retrieval.</figcaption>
          </figure>
          <div className="hero__metrics hero-rise" {...rise(0.38)}>
            <MetricGrid metrics={headlineMetrics} reveal={false} />
          </div>
        </section>
      </div>
      <Marquee items={MARQUEE} />
      <div className="container">
        <Section label="Selected work" id="work" index="01">
          <div className="projects">
            {projects.map((project, index) => (
              <Reveal className="project-slot" key={project.slug} delay={index * 0.06}>
                <ProjectCard project={project} index={index} total={projects.length} />
              </Reveal>
            ))}
          </div>
        </Section>
        <div className="background-grid">
        <Section label="Experience" id="experience" index="02">
          <div className="stack-5">
            {experience.map((entry) => (
              <Reveal key={entry.org}>
                <div className="entry">
                  <div className="entry__head">
                    <h3 className="entry__org">{entry.org}</h3>
                    <span className="entry__dates">{entry.dates}</span>
                  </div>
                  <div className="entry__sub">
                    <span>{entry.role}</span>
                    <span>{entry.location}</span>
                  </div>
                  <div className="entry__body">
                    <ul className="list">
                      {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal>
              <div className="entry">
                <div className="entry__head">
                  <h3 className="entry__org">{education.org}</h3>
                  <span className="entry__dates">{education.dates}</span>
                </div>
                <div className="entry__sub">
                  <span>{education.qualification}</span>
                  <span>{education.location}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>
        <Section label="Technical skills" id="skills" index="03">
          <div className="skills">
            {skills.map((group, index) => (
              <Reveal key={group.label} delay={index * 0.05}>
                <div className="skill">
                  <h3 className="skill__label">{group.label}</h3>
                  <p className="skill__value">{group.items}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
        </div>
        <Section label="Contact" id="contact" index="04">
          <Reveal><Contact /></Reveal>
        </Section>
      </div>
    </div>
  );
}
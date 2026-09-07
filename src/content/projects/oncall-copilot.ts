import type { ProjectSummary } from '../types';

export const oncallCopilot: ProjectSummary = {
  slug: 'oncall-copilot',
  name: 'OnCall Copilot',
  year: '2026',
  tagline: 'AI-assisted incident response, built as internal engineering tooling.',
  summary:
    'Ingests raw monitoring alerts, correlates them into incidents through a dependency graph, and streams a grounded hypothesis to an authenticated Angular dashboard. Transactional outboxes, publisher confirms, persisted retries, and idempotent AI handling keep the operational record durable under failure.',
  stack: [
    'Java 17',
    'Spring Boot 3.3',
    'PostgreSQL + pgvector',
    'RabbitMQ',
    'Flyway',
    'WebSocket / STOMP',
    'Angular 21',
    'Gemini embeddings',
    'Groq',
    'GitHub Actions',
  ],
  metrics: [
    {
      label: 'Retrieval MRR',
      value: '0.939',
      note: 'against a 0.894 lexical baseline the embeddings had to clear',
    },
    {
      label: 'Ranked first',
      value: '10 / 11',
      note: 'plus 3 of 3 unanswerable queries correctly rejected',
    },
    {
      label: 'Verified tests',
      value: '99',
      note: '40 incident, 35 AI, and 24 gateway tests against real Postgres, pgvector, and RabbitMQ',
    },
    {
      label: 'Delivery model',
      value: 'At-least-once',
      note: 'stable message IDs, publisher confirms, persisted retry backoff, and idempotent consumers',
    },
  ],
  links: [
    { label: 'Live demo', href: 'https://on-call-copilot-beryl.vercel.app/' },
    { label: 'Source', href: 'https://github.com/deepak170601/OnCallCopilot' },
  ],
  meta: {
    title: 'OnCall Copilot',
    description:
      'Event-driven incident response platform in Java and Spring Boot: structural alert correlation over a service-dependency graph, and a RAG pipeline measured at 0.939 MRR against a lexical baseline.',
  },
};

import type { ExperienceEntry, SkillGroup } from './types';

export const experience: ExperienceEntry[] = [
  {
    org: 'UST HealthProof',
    role: 'Developer II',
    location: 'Thiruvananthapuram, India',
    dates: 'Aug 2024 - Present',
    bullets: [
      'Designed a transaction-completion framework in Java and Spring Boot that detects when a distributed transaction has settled and broadcasts real-time completion events to dependent microservices, removing a longstanding bottleneck in the consolidation pipeline.',
      'Independently built an automated error-recovery system covering 11 modules and 111 production microservices with zero changes to any existing service. Failures are classified and assessed for recoverability automatically, with full traceability from origin to resolution.',
      'Delivered its execution layer: configurable, track-specific reprocessing strategies plus an on-demand REST interface for operations, cutting manual retry work that previously required team intervention on every failure.',
      'Validated a major database platform migration, identifying and resolving critical integration defects in the Java and JPA persistence layer before cutover.',
    ],
  },
];

export const skills: SkillGroup[] = [
  { label: 'Languages', items: 'Java, Python, SQL, TypeScript, JavaScript' },
  {
    label: 'Backend',
    items:
      'Spring Boot, Spring Data JPA, Hibernate, REST APIs, Microservices, Event-Driven Architecture, Distributed Systems, FastAPI',
  },
  {
    label: 'Messaging',
    items: 'RabbitMQ, ActiveMQ Artemis, JMS, AWS SQS, Celery, WebSocket, STOMP',
  },
  {
    label: 'Databases',
    items: 'PostgreSQL, Microsoft SQL Server, MySQL, MongoDB, Redis, pgvector',
  },
  {
    label: 'Cloud & DevOps',
    items:
      'AWS (EC2, S3, SQS, RDS, Lambda, CloudWatch), Docker, GitHub Actions, CI/CD, Maven, distributed tracing, Micrometer',
  },
  {
    label: 'AI & Retrieval',
    items:
      'RAG pipelines, vector search, Sentence-Transformers, CLIP, LLM APIs, retrieval evaluation',
  },
  {
    label: 'Testing & Process',
    items: 'JUnit 5, Mockito, pytest, integration testing, Postman, Git, Agile/Scrum',
  },
  { label: 'Frontend', items: 'Angular, React' },
];

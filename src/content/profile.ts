import type { ExternalLink } from './types';

export const profile = {
  name: 'Chekurthi Deepak',
  role: 'Java Backend Engineer',
  location: 'Hyderabad, India',
  email: 'chekurthideepak@gmail.com',
  tagline: 'Distributed systems · event-driven microservices · grounded retrieval',
} as const;

// The résumé is served from public/resume.pdf and downloads rather than opens;
// `vercel.json` only rewrites extensionless paths so a missing file would 404
// honestly instead of saving index.html under a .pdf name.
export const socialLinks: ExternalLink[] = [
  { label: 'GitHub', href: 'https://github.com/deepak170601' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/deepak-chekurthi-4a10aa202/' },
  { label: 'Résumé', href: '/resume.pdf', download: 'Chekurthi-Deepak-CV.pdf' },
];

export const education = {
  org: 'National Institute of Technology Calicut',
  qualification: 'B.Tech, Computer Science and Engineering',
  location: 'Kozhikode, India',
  dates: '2020 - 2024',
} as const;

/** The home hero's headline metrics. */
export const headlineMetrics = [
  {
    label: 'Production services',
    value: '111',
    note: 'covered by an error-recovery framework, with zero changes to any of them',
  },
  {
    label: 'Retrieval MRR',
    value: '0.939',
    note: 'against a 0.894 lexical baseline on a hand-labelled set',
  },
  {
    label: 'Experience',
    value: '2+ yrs',
    note: 'Java and Spring Boot in a production healthcare platform',
  },
];

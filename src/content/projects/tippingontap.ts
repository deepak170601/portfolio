import type { ProjectSummary } from '../types';

export const tippingOnTap: ProjectSummary = {
  slug: 'tippingontap',
  name: 'TippingOnTap',
  year: '2025',
  tagline: 'A production-oriented Tap to Pay workflow for service professionals.',
  summary:
    'A React Native mobile app backed by ASP.NET Core, PostgreSQL, Stripe Terminal, and Stripe Connect. Merchants onboard, prewarm and reuse Tap to Pay, collect a card-present tip, and see event earnings, balances, and payout readiness. Payment capture and idempotent tip recording stay on the backend.',
  stack: [
    'C#',
    'ASP.NET Core (.NET 10)',
    'EF Core + Npgsql',
    'PostgreSQL',
    'Stripe Terminal',
    'Stripe Connect',
    'JWT',
    'Docker',
    'Fly.io',
    'GitHub Actions',
  ],
  metrics: [
    {
      label: 'Platform fee',
      value: '5% default',
      note: 'backend calculates ApplicationFeeAmount on each direct-charge PaymentIntent',
    },
    {
      label: 'Tap to Pay',
      value: 'Prewarmed',
      note: 'reader discovery and Terminal location lookup run ahead of collection and are reused',
    },
    {
      label: 'Payment integrity',
      value: 'Idempotent',
      note: 'PaymentIntent IDs prevent duplicates across app retries, webhooks, and reconciliation',
    },
    {
      label: 'Reporting',
      value: 'Auditable',
      note: 'available/pending balances plus itemized past-event tips and capture timestamps',
    },
  ],
  links: [],
  meta: {
    title: 'TippingOnTap',
    description:
      'React Native Tap to Pay app backed by ASP.NET Core: Stripe Connect direct charges, backend-controlled fees, idempotent capture, merchant reporting, and protected support requests.',
  },
};

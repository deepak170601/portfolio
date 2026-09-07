import type { ProjectSummary } from '../types';

export const multimodalRag: ProjectSummary = {
  slug: 'multimodal-rag',
  name: 'Multimodal RAG',
  year: '2026',
  tagline: 'Document question answering that indexes the figures, not just the text.',
  summary:
    'A standard RAG pipeline only indexes the text layer, so "what does the diagram on page 12 show?" is unanswerable — the visual content was never indexed. This one embeds page text with a sentence transformer and embedded images with CLIP, searches both, fuses the ranked lists, and sends the survivors to a vision-capable model with citations back to the page. Every retrieval decision was settled against a labelled evaluation set rather than by inspection.',
  stack: [
    'Python',
    'FastAPI',
    'PostgreSQL + pgvector',
    'Celery',
    'Redis',
    'Sentence-Transformers',
    'CLIP',
    'React + TypeScript',
    'Docker',
    'GitHub Actions',
  ],
  metrics: [
    {
      label: 'Evidence delivered',
      value: '86.7%',
      note: '65 of 75 answerable questions, versus 69.3% for text-only retrieval',
    },
    {
      label: 'Figure-only questions',
      value: '11 / 11',
      note: 'fused retrieval found relevant figures for every figure-only case; text-only found none',
    },
    {
      label: 'Labelled questions',
      value: '89',
      note: '75 answerable plus 14 that the corpus deliberately cannot answer',
    },
    {
      label: 'Backend tests',
      value: '269',
      note: 'verified against real PostgreSQL and Redis',
    },
  ],
  // TODO: the README does not name a repository. Swap this for the direct repo
  // URL — the label is accurate as it stands, but it points at the profile root.
  links: [{ label: 'GitHub', href: 'https://github.com/deepak170601' }],
  meta: {
    title: 'Multimodal RAG',
    description:
      'Full-stack multimodal retrieval over PDFs: dual text and image embedding spaces, calibrated fusion, a cross-encoder reranker, and every decision measured against an 89-question labelled set.',
  },
};

import type { ProjectSummary } from '../types';
import { multimodalRag } from './multimodal-rag';
import { oncallCopilot } from './oncall-copilot';
import { tippingOnTap } from './tippingontap';

/** Display order on the home page and in the header nav. */
export const projects: ProjectSummary[] = [oncallCopilot, multimodalRag, tippingOnTap];

export { oncallCopilot, multimodalRag, tippingOnTap };

export function projectIndex(slug: string): number {
  return projects.findIndex((project) => project.slug === slug);
}

/** The next project in display order, wrapping around, for case-study footers. */
export function nextProject(slug: string): ProjectSummary | undefined {
  const index = projectIndex(slug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

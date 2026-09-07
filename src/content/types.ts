export type Metric = {
  label: string;
  value: string;
  note?: string;
};

export type ExternalLink = {
  label: string;
  href: string;
  /** Filename to save as, for links that should download rather than open. */
  download?: string;
};

export type ProjectSummary = {
  /** Route segment, without the leading slash. */
  slug: string;
  name: string;
  year: string;
  /** One line, shown on the home card and under the case-study title. */
  tagline: string;
  /** Two or three sentences for the home card. */
  summary: string;
  stack: string[];
  metrics: Metric[];
  links: ExternalLink[];
  meta: {
    title: string;
    description: string;
  };
};

export type ExperienceEntry = {
  org: string;
  role: string;
  location: string;
  dates: string;
  bullets: string[];
};

export type SkillGroup = {
  label: string;
  items: string;
};

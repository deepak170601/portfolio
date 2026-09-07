/** Home-page sections, in document order. Also drives the nav's scroll-spy. */
export const NAV_SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

export const NAV_SECTION_IDS = NAV_SECTIONS.map((section) => section.id);

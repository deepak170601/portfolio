import { useEffect } from 'react';

const SITE_NAME = 'Chekurthi Deepak';

type MetaSelector = { attr: 'name' | 'property'; key: string };

const DESCRIPTION_TARGETS: MetaSelector[] = [
  { attr: 'name', key: 'description' },
  { attr: 'property', key: 'og:description' },
];

const TITLE_TARGETS: MetaSelector[] = [{ attr: 'property', key: 'og:title' }];

function setMeta({ attr, key }: MetaSelector, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

function setCanonical(path: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = new URL(path, window.location.origin).toString();
}

/**
 * Per-route title, description and Open Graph tags. Hand-rolled because the one
 * thing this site needs from a metadata framework is four `setAttribute` calls.
 */
export function useDocumentMeta(title: string, description: string, path: string): void {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;

    document.title = fullTitle;
    TITLE_TARGETS.forEach((target) => setMeta(target, fullTitle));
    DESCRIPTION_TARGETS.forEach((target) => setMeta(target, description));
    setCanonical(path);
  }, [title, description, path]);
}

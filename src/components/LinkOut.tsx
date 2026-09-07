import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Filename to save as. Same-origin only, which the résumé is. */
  download?: string;
};

/**
 * An outbound link. Internal hrefs (the résumé PDF) skip the new-tab treatment
 * and the noreferrer hardening that only matters when leaving the site, and
 * can ask the browser to save the file rather than open it.
 */
export function LinkOut({ href, children, className, download }: Props) {
  const isExternal = /^https?:/i.test(href);
  const arrow = download ? '↓' : isExternal ? '↗' : '↓';

  return (
    <a
      className={className ?? 'link-out'}
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(download ? { download } : {})}
    >
      <span>{children}</span>
      <span className="link-out__arrow" aria-hidden="true">
        {arrow}
      </span>
      {isExternal ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
      {download ? <span className="visually-hidden"> (downloads a PDF)</span> : null}
    </a>
  );
}

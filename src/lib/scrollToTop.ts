import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Roughly the sticky header, so a linked section is not tucked under it. */
const HEADER_OFFSET = 84;

/** Retry schedule, in ms. Early entries wait for the target to exist; later
 *  ones correct for layout that settles afterwards — the mobile menu closing
 *  removes its own height right after the jump, which would otherwise leave
 *  the section sitting under the header. */
const PASSES = [0, 60, 140, 260, 420];

/**
 * Positions the document on navigation.
 *
 * No fragment means a new page, so go to the top. A fragment is an explicit
 * request for a section — but in a single-page app the target may not be in
 * the DOM yet when the route first commits, and the layout can still move
 * after it is, so the position is re-applied a few times and then left alone.
 */
export function useScrollToTop(): void {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const timers = PASSES.map((delay) =>
      window.setTimeout(() => {
        let id: string;
        try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (!target) return;

        const top = target.getBoundingClientRect().top + window.scrollY - (document.querySelector('.site-header__inner')?.getBoundingClientRect().height ?? HEADER_OFFSET) - 12;

        // `scroll-behavior: smooth` on the root would animate each pass, and
        // the passes would then fight each other mid-flight. Arriving at a
        // section should be instant anyway; smooth is for in-page clicks.
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, Math.max(top, 0));
        root.style.scrollBehavior = previous;
      }, delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [pathname, hash, key]);
}

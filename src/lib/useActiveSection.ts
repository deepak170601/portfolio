import { useEffect, useState } from 'react';

/** Resolve against all section positions, including upward scrolling and gaps. */
export function useActiveSection(ids: readonly string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) { setActive(null); return; }
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      const sections = ids.map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      const header = document.querySelector('.site-header__inner');
      const threshold = (header?.getBoundingClientRect().height ?? 76) + 24;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) current = section.id;
      }
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections.at(-1)?.id ?? current;
      }
      setActive(current);
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    resize?.observe(document.body);
    void document.fonts.ready.then(schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids, enabled]);
  return active;
}
import { useEffect, useRef, useState } from 'react';

/**
 * Splits a metric value into an animatable leading number and the static text
 * around it, so "0.939", "10 / 11", "~100" and "5%" all work, and a value with
 * no number at all ("Integer cents") passes through untouched.
 */
const NUMERIC = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/s;

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Counts a metric up when it scrolls into view.
 *
 * The real figure is what renders by default, and the count only starts from
 * zero once an animation frame has actually been delivered. A stuck animation
 * therefore degrades to no animation — never to a metric frozen at "0", which
 * would not be a missing effect but a false claim.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    setDisplay(value);

    const element = ref.current;
    const match = NUMERIC.exec(value);
    const target = match ? Number(match[2]) : Number.NaN;

    if (
      !element ||
      !match ||
      !Number.isFinite(target) ||
      target === 0 ||
      prefersReducedMotion() ||
      typeof requestAnimationFrame !== 'function'
    ) {
      return;
    }

    const prefix = match[1] ?? '';
    const suffix = match[3] ?? '';
    const decimals = match[2]?.includes('.') ? (match[2].split('.')[1]?.length ?? 0) : 0;

    let frame = 0;
    let cancelled = false;

    const animateFrom = (start: number) => (now: number) => {
      if (cancelled) return;

      const t = Math.min((now - start) / 1100, 1);
      // easeOutExpo — quick off the mark, settling gently on the real figure.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      setDisplay(
        t === 1 ? value : `${prefix}${(target * eased).toFixed(decimals)}${suffix}`,
      );

      if (t < 1) frame = requestAnimationFrame(animateFrom(start));
    };

    const begin = () => {
      // Only now, inside a delivered frame, is it safe to show a partial value.
      frame = requestAnimationFrame((now) => {
        if (cancelled) return;
        animateFrom(now)(now);
      });
    };

    if (typeof IntersectionObserver === 'undefined') {
      begin();
      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          begin();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

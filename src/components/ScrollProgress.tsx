import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

/**
 * A bar across the top showing how far down the page you are.
 *
 * Spring-smoothed rather than tracking scroll directly, so it eases into
 * position instead of snapping on every wheel tick. Safe to drive with a
 * library: if the spring never runs the bar simply sits at zero width, and
 * nothing readable depends on it.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 34,
    restDelta: 0.001,
  });

  return <motion.div className="scroll-progress" style={{ scaleX: reduced ? scrollYProgress : scaleX }} aria-hidden="true" />;
}

import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number };

const LINK_DISTANCE = 155;
const POINTER_DISTANCE = 210;
const DENSITY = 22000; // one node per this many px² of viewport
const MAX_NODES = 80;
const SPEED = 0.42;

/**
 * A drift of nodes with edges drawn between near neighbours — the same
 * service-dependency graph the site's mark is built from, and the structure
 * OnCall's correlation engine walks. The pointer acts as an extra node, so the
 * field visibly reacts to the cursor.
 *
 * Decorative and behind everything: `aria-hidden`, pointer-events none, and no
 * content depends on it. Under reduced motion it paints one static frame and
 * stops; it also stops entirely while the tab is hidden.
 */
export function NodeField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let frame = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    let colours = { node: 'rgba(0,0,0,0.3)', edge: 'rgba(0,0,0,0.1)', accent: '#ff5f36' };

    /* Colours live in CSS custom properties, so they are read from the
       document rather than duplicated here — that keeps the canvas correct in
       both themes from one source. */
    const readColours = () => {
      const styles = getComputedStyle(document.documentElement);
      const isDark = styles.getPropertyValue('color-scheme').trim() === 'dark';

      colours = {
        node: isDark ? 'rgba(243, 241, 236, 0.38)' : 'rgba(22, 21, 15, 0.32)',
        edge: isDark ? 'rgba(243, 241, 236, 0.12)' : 'rgba(22, 21, 15, 0.11)',
        accent: styles.getPropertyValue('--accent').trim() || '#ff5f36',
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(MAX_NODES, Math.round((width * height) / DENSITY));
      nodes = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * SPEED * (0.5 + Math.random()),
          vy: Math.sin(angle) * SPEED * (0.5 + Math.random()),
        };
      });
    };

    const line = (ax: number, ay: number, bx: number, by: number, alpha: number, stroke: string) => {
      context.globalAlpha = alpha;
      context.strokeStyle = stroke;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(ax, ay);
      context.lineTo(bx, by);
      context.stroke();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        if (!a) continue;

        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          if (!b) continue;

          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > LINK_DISTANCE) continue;

          // Edges fade out as the nodes they join drift apart.
          line(a.x, a.y, b.x, b.y, 1 - distance / LINK_DISTANCE, colours.edge);
        }

        // The pointer is treated as one more node, in the accent colour.
        if (pointer.active) {
          const distance = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (distance < POINTER_DISTANCE) {
            line(a.x, a.y, pointer.x, pointer.y, (1 - distance / POINTER_DISTANCE) * 0.55, colours.accent);
          }
        }
      }

      nodes.forEach((node, index) => {
        const isAccent = index % 7 === 0;
        context.fillStyle = isAccent ? colours.accent : colours.node;
        context.globalAlpha = isAccent ? 0.6 : 1;
        context.beginPath();
        context.arc(node.x, node.y, isAccent ? 2 : 1.5, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
    };

    const step = () => {
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap rather than bounce: no visible edges to the field.
        if (node.x < -30) node.x = width + 30;
        if (node.x > width + 30) node.x = -30;
        if (node.y < -30) node.y = height + 30;
        if (node.y > height + 30) node.y = -30;
      });

      draw();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (frame || reduced) return;
      frame = requestAnimationFrame(step);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const onResize = () => {
      resize();
      draw();
    };

    readColours();
    resize();
    draw();
    start();

    // The palette changes when the theme is toggled.
    const themeObserver = new MutationObserver(() => {
      readColours();
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas className="node-field" ref={ref} aria-hidden="true" />;
}

'use client';
import { useRef, useEffect } from 'react';
import { watchInView } from '@/lib/in-view';
import { reducedMotion } from '@/components/visuals/effects';

/**
 * countUp: writes a number into el, counting from 0 to `to` (eased) the first time el scrolls into view; at once for
 * reduced motion. Plain JS: the React wrapper below only mounts it. Returns a function that stops it.
 * @param {Element} el @param {number} to @param {{ ms?: number, format?: (n: number) => string }} [options]
 */
const countUp = (el, to, { ms = 1600, format = (n) => Math.round(n).toLocaleString('en-US') } = {}) => {
  let frame;
  const stopWatching = watchInView(el, (inView) => {
    if (!inView) return;
    stopWatching();
    if (reducedMotion()) { el.textContent = format(to); return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / ms, 1);
      el.textContent = format(to * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }, '0px');
  return () => { stopWatching(); cancelAnimationFrame(frame); };
};

/**
 * CountUp: a number that counts up from 0 the first time it scrolls into view. The server renders the final value,
 * so crawlers and visitors without JavaScript read the real number.
 * @param {number} to @param {string} [className] @param {Object} [style]
 */
const CountUp = ({ to, className, style }) => {
  const box = useRef(null);
  useEffect(() => countUp(box.current, to), [ to ]);
  return <span ref={box} className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{to.toLocaleString('en-US')}</span>;
};

export { countUp, CountUp };

'use client';
import React, { useState, useRef, useEffect, useId } from 'react';
import { cx } from '@/components/server/component';

/*
 * Motion effects ported from the anthem site: Orbit (the ag page's click-to-rotate circle), Countdown (the gooey
 * 5..0 counter) and Parallax / useParallax (scroll parallax). Layout in components.css, motion in animations.css.
 * All three respect prefers-reduced-motion.
 */

/* ---------- orbit ---------- */

/**
 * Orbit: items ring a circle; clicking one shows its text in place of its icon and turns the wheel to face it
 * (the shortest way round). Items are spaced evenly, clockwise from the right. Below 36rem wide it becomes a
 * plain list (components.css).
 * @param {{ icon: string|React.ReactNode, title: string, text: React.ReactNode }[]} items - icon: image src or a node.
 * @param {string} [wheel] - Image that turns to face the picked item (drawn pointing right at 0deg).
 * @param {string} [center] - Image fixed in the middle.
 * @param {number} [offset=0] - Degrees added to the wheel's turn, when the wheel image doesn't point right.
 */
const Orbit = ({ items, wheel, center, offset = 0, className }) => {
  const step = 360 / items.length;
  const [ active, setActive ] = useState(0);
  const [ turn, setTurn ] = useState(offset);
  const select = (i) => {
    const target = i * step + offset;
    const delta = ((target - turn) % 360 + 540) % 360 - 180; // -180..180: never spins the long way
    setTurn(turn + delta);
    setActive(i);
  };
  return (
    <div className={cx('orbit-box', className)}>
      <div className="orbit stack">
        {wheel && <img className="orbit-wheel" src={wheel} alt="" style={{ rotate: `${turn}deg` }} />}
        {center && <img className="orbit-center" src={center} alt="" />}
        <ul className="orbit-items stack">
          {items.map((item, i) => (
            <li key={i} className={cx('orbit-item stack', i === active && 'active')} style={{ '--angle': `${i * step}deg` }}>
              <button type="button" className="orbit-icon" aria-label={item.title} aria-pressed={i === active}
                onClick={() => select(i)}>
                {typeof item.icon === 'string' ? <img src={item.icon} alt="" /> : item.icon}
              </button>
              <div className="orbit-text">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- countdown ---------- */

// How long the bars sit collapsed in the middle between digits, then how long each digit holds (ms).
const COUNTDOWN_GAP = 600;
const COUNTDOWN_HOLD = 1000;

/**
 * Countdown: five bars that fold into each digit from `from` down to 0, blurred together by an SVG "goo"
 * filter. Calls onDone once 0 has shown, and stays on 0. Size with --countdown-size, color with `color`.
 * @param {number} [from=5] - Starting digit, 0..9.
 * @param {Function} [onDone]
 */
const Countdown = ({ from = 5, onDone, className }) => {
  const [ digit, setDigit ] = useState(null);
  const filter = 'goo' + useId().replace(/:/g, ''); // useId's colons break url(#...)
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    let n = Math.min(Math.max(from, 0), 9);
    let timer;
    const show = () => {
      setDigit(null);
      timer = setTimeout(() => {
        setDigit(n);
        timer = setTimeout(() => (n-- > 0 ? show() : done.current?.()), COUNTDOWN_HOLD);
      }, COUNTDOWN_GAP);
    };
    show();
    return () => clearTimeout(timer);
  }, [from]);
  return (
    <>
      <div className={cx('countdown', className)} data-digit={digit ?? undefined} style={{ filter: `url(#${filter})` }}
        role="timer" aria-label={digit ?? ''}>
        <i /><i /><i /><i /><i />
      </div>
      <svg className="countdown-filter" aria-hidden="true">
        <filter id={filter}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
    </>
  );
}

/* ---------- parallax ---------- */

/**
 * Moves the ref'd element along y as the page scrolls: 0 when its parent is centered in the window, then
 * (parent's distance from center) x speed. Positive speed lags the scroll (a background feel), negative leads it.
 * Measures the parent, not the element, so its own movement doesn't feed back. Runs only while the parent is
 * near the screen, once per frame, and stays still for reduced motion. Give the parent overflow: clip to hide
 * the edges the element uncovers.
 * @param {number} [speed=0.2]
 * @returns {React.RefObject}
 */
const useParallax = (speed = 0.2) => {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const parent = node?.parentElement;
    if (!parent) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = false;
    const draw = () => {
      frame = 0;
      const box = parent.getBoundingClientRect();
      const offset = (box.top + box.height / 2 - window.innerHeight / 2) * speed;
      node.style.translate = motion.matches ? '' : `0 ${offset.toFixed(1)}px`;
    };
    const queue = () => { if (visible && !frame) frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(([ entry ]) => { visible = entry.isIntersecting; queue(); },
      { rootMargin: '25% 0px' });
    observer.observe(parent);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    motion.addEventListener('change', draw);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      motion.removeEventListener('change', draw);
      cancelAnimationFrame(frame);
    };
  }, [speed]);
  return ref;
}

/**
 * Parallax: a box moved by useParallax.
 * @param {number} [speed=0.2] @param {string} [as='div'] - Element to render.
 */
const Parallax = ({ speed = 0.2, as: Tag = 'div', className, children }) => {
  const ref = useParallax(speed);
  return <Tag ref={ref} className={cx('parallax', className)}>{children}</Tag>;
}

export { Orbit, Countdown, Parallax, useParallax };

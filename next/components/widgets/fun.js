'use client';
import { useState, useEffect, useRef } from 'react';
import { cx } from '@/lib/cx';
import { useSpins, GooDigit, reducedMotion } from '@/components/visuals/effects';
import { HexGrid } from './layout';
import { useInView } from '@/lib/in-view';

/*
 * Showcase widgets: an atom, an analog clock, a flip clock of gooey digits, shape loaders and a fan of cards. No CSS
 * of their own: stack, shape and color classes, inline styles, and the browser's animation API for endless motion.
 */

/**
 * useLoop: plays keyframes on ref's element forever (the browser's animation API) while it's on screen, unless the
 * visitor asks for
 * reduced motion.
 * @param {React.RefObject} ref @param {Keyframe[]} keyframes @param {KeyframeAnimationOptions} options
 */
const useLoop = (ref, keyframes, options) => {
  const inView = useInView(ref);
  const anim = useRef(null);
  useEffect(() => {
    if (reducedMotion() || !ref.current) return;
    anim.current = ref.current.animate(keyframes, { iterations: Infinity, ...options });
    anim.current.pause(); // starts once on screen
    return () => anim.current.cancel();
  }, []);
  useEffect(() => { inView ? anim.current?.play() : anim.current?.pause(); }, [ inView ]);
};

/**
 * Atom: a nucleus and electrons on three tilted orbits. Each orbit is a circle squashed (scale) and tilted (rotate)
 * into an ellipse; its electron rides an arm that useSpins turns, turning back and un-squashing itself so it stays
 * round. Waits while the pointer is over it.
 * @param {number} [laps=[3, 4, 5]] - Seconds per lap, one per orbit.
 */
const Atom = ({ laps = [ 3, 4, 5 ], className, style }) => {
  const box = useRef(null);
  useSpins(box);
  const squash = .38;
  return (
    <div ref={box} className={cx('cq', className)} style={style} role="img" aria-label="An atom">
      <div className="stack square" style={{ placeItems: 'center' }}>
        {laps.map((lap, i) => {
          const from = i * 120;
          return (
            <div key={i} className="stack" style={{ width: '92cqi', aspectRatio: 1, rotate: `${i * 60 - 30}deg`, scale: `1 ${squash}` }}>
              <div className="shape-ring" style={{ gridArea: '1 / 1', width: '100%', '--ring-hole': 'calc(100% - 3px)', background: 'var(--primary)' }} />
              <div className="stack" data-lap={lap} data-from={from} style={{ gridArea: '1 / 1', width: '100%', aspectRatio: 1, rotate: `${from}deg` }}>
                <div className="circle bg-secondary" data-lap={lap} data-from={-from} data-dir={-1}
                  style={{ width: '6cqi', aspectRatio: 1, placeSelf: 'center end', translate: '50% 0', rotate: `${-from}deg`,
                    scale: `1 ${1 / squash}`, boxShadow: '0 0 2cqi var(--secondary)' }} />
              </div>
            </div>
          );
        })}
        <div className="stack" style={{ width: '16cqi', aspectRatio: 1, placeItems: 'center' }}>
          {[ [ -2, -2, 'bg-danger' ], [ 2, -1.5, 'bg-primary' ], [ -1.5, 2, 'bg-primary' ], [ 2, 2, 'bg-danger' ], [ 0, 0, 'bg-gradient' ] ].map(([ x, y, c ], i) => (
            <div key={i} className={cx('circle', c)} style={{ width: '8cqi', aspectRatio: 1, translate: `${x}cqi ${y}cqi`, boxShadow: 'inset -1cqi -1cqi 2cqi rgb(0 0 0 / .3)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * AnalogClock: a squircle face with hour marks and three hands that tick to the visitor's local time. The angles
 * only ever grow (seconds since midnight), so the second hand never spins back from 59 to 0.
 */
const AnalogClock = ({ className, style }) => {
  const [ now, setNow ] = useState(null);
  const box = useRef(null);
  const inView = useInView(box);
  useEffect(() => {
    setNow(new Date());
    if (!inView) return; // ticks only while on screen
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [ inView ]);
  const secs = now ? now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() : 0;
  const hand = (deg, width, length, color) => (
    <div className="stack" style={{ gridArea: '1 / 1', width: '100%', height: '100%', rotate: `${deg}deg`, transition: 'rotate .3s cubic-bezier(.34, 1.56, .64, 1)' }}>
      <div style={{ width, height: length, placeSelf: 'center', translate: '0 -50%', background: color, borderRadius: '99px' }} />
    </div>
  );
  return (
    <div ref={box} className={cx('stack', className)} style={{ aspectRatio: 1, ...style }} role="img"
      aria-label={now ? now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Clock'}>
      <div className="shape-squircle bg-gradient" style={{ gridArea: '1 / 1', width: '100%' }} />
      <div className="shape-squircle bg" style={{ gridArea: '1 / 1', width: '94%', placeSelf: 'center' }} />
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} className="stack" style={{ gridArea: '1 / 1', width: '100%', height: '100%', rotate: `${i * 6}deg` }}>
          <div style={{ width: i % 5 ? '1%' : '2.5%', height: i % 5 ? '3%' : '8%', placeSelf: 'start center', marginTop: '7%',
            background: i % 15 ? 'var(--body-color)' : 'var(--primary)', opacity: i % 5 ? .4 : 1, borderRadius: '99px' }} />
        </div>
      ))}
      {now && <>
        {hand(secs / 120, '3.5%', '26%', 'var(--body-color)')}
        {hand(secs / 10, '2.2%', '36%', 'var(--primary)')}
        {hand(secs * 6, '1%', '40%', 'var(--secondary)')}
      </>}
      <div className="circle bg-gradient" style={{ gridArea: '1 / 1', width: '6%', aspectRatio: 1, placeSelf: 'center' }} />
    </div>
  );
}

/**
 * FlipClock: the local time in GooDigits (hh:mm:ss), each digit folding into the next as it changes.
 * @param {string} [size='3rem'] - Each digit's size (--countdown-size).
 */
const FlipClock = ({ size = '3rem', className }) => {
  const [ now, setNow ] = useState(null);
  const box = useRef(null);
  const inView = useInView(box);
  useEffect(() => {
    setNow(new Date());
    if (!inView) return; // ticks only while on screen
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [ inView ]);
  const parts = now ? [ now.getHours(), now.getMinutes(), now.getSeconds() ].map(n => String(n).padStart(2, '0')) : [ '--', '--', '--' ];
  const colon = (
    <span className="grid cols-1" style={{ gap: `calc(${size} / 5)` }} aria-hidden="true">
      <span className="circle bg-gradient" style={{ width: `calc(${size} / 7)`, aspectRatio: 1 }} />
      <span className="circle bg-gradient" style={{ width: `calc(${size} / 7)`, aspectRatio: 1 }} />
    </span>
  );
  return (
    <div ref={box} className={cx('grid auto-cols cols-center items-center gap-0 text-primary', className)} role="timer"
      aria-label={now ? now.toLocaleTimeString() : ''}>
      {parts.map((pair, i) => (
        <span key={i} className="grid auto-cols items-center gap-0" style={{ gap: `calc(${size} / 6)` }}>
          {i > 0 && colon}
          {[ ...pair ].map((d, j) => <GooDigit key={j} digit={d === '-' ? null : Number(d)} aria-hidden="true" style={{ '--countdown-size': size }} />)}
        </span>
      ))}
    </div>
  );
}

// Corners of the morphing loader: a star and a ten-sided circle, so the browser can animate one into the other.
const STAR = 'polygon(50% 0, 61.8% 36.3%, 100% 38.2%, 69.1% 61.8%, 80.9% 100%, 50% 76.4%, 19.1% 100%, 30.9% 61.8%, 0 38.2%, 38.2% 36.3%)';
const ROUND = 'polygon(50% 0, 79.4% 9.5%, 97.6% 34.5%, 97.6% 65.5%, 79.4% 90.5%, 50% 100%, 20.6% 90.5%, 2.4% 65.5%, 2.4% 34.5%, 20.6% 9.5%)';

const SpinLoader = ({ size }) => {
  const ref = useRef(null);
  useLoop(ref, [ { rotate: '0deg' }, { rotate: '360deg' } ], { duration: 1400, easing: 'cubic-bezier(.65, 0, .35, 1)' });
  return <div ref={ref} className="shape-star bg-gradient" style={{ width: size }} />;
}
const MorphLoader = ({ size }) => {
  const ref = useRef(null);
  useLoop(ref, [ { clipPath: STAR, rotate: '0deg' }, { clipPath: ROUND, rotate: '180deg' }, { clipPath: STAR, rotate: '360deg' } ],
    { duration: 2000, easing: 'ease-in-out' });
  return <div ref={ref} className="bg-gradient" style={{ width: size, aspectRatio: 1, clipPath: STAR }} />;
}
const HiveCell = ({ i }) => {
  const ref = useRef(null);
  useLoop(ref, [ { scale: 1, opacity: 1 }, { scale: .4, opacity: .3 }, { scale: 1, opacity: 1 } ], { duration: 1400, delay: i * 120, easing: 'ease-in-out' });
  return <div ref={ref} className="shape-hexagon bg-gradient" />;
}
const HiveLoader = ({ size }) => (
  <HexGrid at={[ [ 0, 1 ], [ 0, 3 ], [ 1, 4 ], [ 2, 3 ], [ 2, 1 ], [ 1, 0 ], [ 1, 2 ] ]} style={{ width: size }}>
    {Array.from({ length: 7 }, (_, i) => <HiveCell key={i} i={i} />)}
  </HexGrid>
);

/**
 * ShapeLoader: a loading sign made of shapes: "spin" (a star turning), "morph" (a star melting into a circle and
 * back) or "hive" (a hexagon flower whose cells pulse in turn). Still for reduced motion.
 * @param {'spin'|'morph'|'hive'} [kind='spin'] @param {string} [size='4rem']
 */
const ShapeLoader = ({ kind = 'spin', size = '4rem', label = 'Loading' }) => {
  const Loader = { spin: SpinLoader, morph: MorphLoader, hive: HiveLoader }[kind];
  return <div role="status" aria-label={label} className="col-center"><Loader size={size} /></div>;
}

/**
 * CardFan: cards stacked in one spot, turned a little round a point below them; hovering (or focus) fans them out.
 * @param {{ title: string, icon?: React.ReactNode, className?: string }[]} cards - className: e.g. a background.
 * @param {number} [spread=14] - Degrees between cards when fanned.
 */
const CardFan = ({ cards, spread = 14, className }) => {
  const [ open, setOpen ] = useState(false);
  const mid = (cards.length - 1) / 2;
  return (
    <div className={cx('stack', className)} style={{ placeItems: 'center', paddingBlock: '2rem' }} tabIndex={0} aria-label="A fan of cards"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {cards.map((c, i) => (
        <div key={c.title} className={cx('round shadow pad col-center text-center gap-sm', c.className ?? 'bg border')}
          style={{ width: '8rem', aspectRatio: '5 / 7', transformOrigin: '50% 160%', rotate: `${(i - mid) * (open ? spread : 3)}deg`,
            translate: open ? `0 ${Math.abs(i - mid) * .4}rem` : '0 0', transition: 'rotate var(--duration-slow) cubic-bezier(.34, 1.56, .64, 1), translate var(--duration-slow)' }}>
          {c.icon}
          <strong>{c.title}</strong>
        </div>
      ))}
    </div>
  );
}

export { Atom, AnalogClock, FlipClock, ShapeLoader, CardFan, useLoop };

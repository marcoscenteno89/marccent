'use client';
import { useState, useEffect, useRef } from 'react';
import { cx } from '@/lib/cx';
import { reducedMotion } from '@/components/visuals/effects';

/*
 * Data widgets: a ring gauge, a radar chart and a speedometer. No CSS of their own: stack, shape and color classes,
 * and inline gradients, clip-paths and turns worked out from the values.
 */

// The value, eased towards target over ms (at once for reduced motion), so a gradient that can't transition counts up.
const useTween = (target, ms = 1000) => {
  const [ value, setValue ] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (reducedMotion()) { setValue(target); from.current = target; return; }
    const start = performance.now(), a = from.current;
    let frame;
    const step = (now) => {
      const t = Math.min((now - start) / ms, 1), eased = 1 - (1 - t) ** 3;
      const v = a + (target - a) * eased;
      setValue(v); from.current = v;
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return value;
};

/**
 * RingGauge: a ring that fills clockwise to value (in the theme gradient) round its number and label; it counts up.
 * @param {number} value - 0..100. @param {string} [label] @param {string} [size='8rem']
 */
const RingGauge = ({ value, label, size = '8rem', className }) => {
  const v = useTween(value);
  const ring = { gridArea: '1 / 1', width: '100%', '--ring-hole': '76%' };
  return (
    <div className={cx('stack', className)} role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}
      style={{ width: size, aspectRatio: 1, placeItems: 'center' }}>
      <div className="shape-ring" style={{ ...ring, background: 'var(--border-color)' }} />
      <div className="shape-ring" style={{ ...ring, background: `conic-gradient(var(--primary), var(--secondary) ${v}%, transparent 0)` }} />
      <div className="col-center text-center">
        <strong className="fs-lg">{Math.round(v)}%</strong>
        {label && <small className="opacity-75">{label}</small>}
      </div>
    </div>
  );
}

// [x, y] in % of the box for radius r (0..50) at angle deg (0: 12 o'clock, clockwise).
const point = (r, deg) => {
  const a = (deg - 90) * Math.PI / 180;
  return [ 50 + r * Math.cos(a), 50 + r * Math.sin(a) ];
};
const polygon = (rs, n, inner) => {
  const pts = rs.map((r, i) => point(r, i * 360 / n).map(c => `${c.toFixed(2)}%`).join(' '));
  // inner: the same polygon again, a little smaller, cut out (evenodd), so only an outline is left.
  const hole = inner ? rs.map((r, i) => point(r - inner, i * 360 / n).map(c => `${c.toFixed(2)}%`).join(' ')) : [];
  return inner ? `polygon(evenodd, ${pts.join(', ')}, ${pts[0]}, ${hole.join(', ')}, ${hole[0]})` : `polygon(${pts.join(', ')})`;
};

/**
 * Radar: values on axes round a web. The web is four nested polygon outlines and the axes; the values are one polygon
 * in the theme gradient (clip-path), so a change of values morphs it (same corners, so the browser animates it).
 * @param {{ label: string, value: number }[]} axes - value 0..100; at least three.
 */
const Radar = ({ axes, className, style }) => {
  const n = axes.length;
  const R = 40; // the web's radius, % of the box: room for the labels round it
  const layer = { gridArea: '1 / 1', width: '100%', aspectRatio: 1 };
  return (
    <div className={cx('cq', className)} style={style} role="img"
      aria-label={axes.map(a => `${a.label} ${a.value}`).join(', ')}>
      <div className="stack square" style={{ placeItems: 'center' }}>
        {[ 1, .75, .5, .25 ].map(f => (
          <div key={f} style={{ ...layer, background: 'var(--border-color)', clipPath: polygon(Array(n).fill(R * f), n, .4) }} />
        ))}
        {axes.map((a, i) => (
          <div key={a.label} className="stack" style={{ ...layer, rotate: `${i * 360 / n}deg` }}>
            <div style={{ width: '1px', height: `${R}%`, background: 'var(--border-color)', placeSelf: 'start center', marginTop: `${50 - R}%` }} />
          </div>
        ))}
        <div className="bg-gradient" style={{ ...layer, opacity: .8, clipPath: polygon(axes.map(a => R * a.value / 100), n),
          transition: 'clip-path var(--duration-slow) ease-in-out' }} />
        {axes.map((a, i) => {
          const deg = i * 360 / n - 90;
          return (
            <small key={a.label} className="text-center fw-bold" style={{ gridArea: '1 / 1', placeSelf: 'center', lineHeight: 1.1,
              transform: `rotate(${deg}deg) translate(${R + 6}cqi) rotate(${-deg}deg)`, fontSize: 'max(.7rem, 3.2cqi)' }}>
              {a.label}<br /><span className="opacity-75 fw-normal">{a.value}</span>
            </small>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Speedometer: a half dial from success to danger, with ticks, a needle that swings to value (with a little
 * overshoot) and the value under it.
 * @param {number} value @param {number} [max=100] @param {string} [unit] @param {string} [label]
 */
const Speedometer = ({ value, max = 100, unit = '', label, className, style }) => {
  const turn = -90 + Math.min(Math.max(value / max, 0), 1) * 180;
  const dial = 'farthest-side at 50% 100%'; // the box is 2:1, so this is the half circle's own radius
  const layer = { gridArea: '1 / 1', width: '100%', height: '100%', clipPath: 'ellipse(50% 100% at 50% 100%)' };
  return (
    <div className={cx('grid cols-1 gap-sm justify-center', className)} style={style} role="meter" aria-valuenow={value}
      aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="stack w-100" style={{ aspectRatio: 2 }}>
        <div style={{ ...layer, background: 'conic-gradient(from -90deg at 50% 100%, var(--success-mode), var(--primary), var(--danger-mode) 180deg, transparent 0)',
          mask: `radial-gradient(${dial}, transparent 72%, #000 73%)` }} />
        <div style={{ ...layer, background: 'var(--body-color)', opacity: .6,
          mask: `repeating-conic-gradient(from -90.5deg at 50% 100%, #000 0 1deg, transparent 0 18deg), radial-gradient(${dial}, transparent 60%, #000 61% 68%, transparent 69%)`,
          maskComposite: 'intersect' }} />
        <div style={{ gridArea: '1 / 1', width: '1.5%', minWidth: '3px', height: '88%', placeSelf: 'end center', background: 'var(--body-color)',
          borderRadius: '99px', transformOrigin: '50% 100%', rotate: `${turn}deg`, transition: 'rotate 1s cubic-bezier(.34, 1.56, .64, 1)' }} />
        <div className="circle bg-gradient" style={{ gridArea: '1 / 1', width: '9%', aspectRatio: 1, placeSelf: 'end center', translate: '0 50%' }} />
      </div>
      <div className="text-center" style={{ marginTop: 'var(--space-sm)' }}>
        <strong className="display-sm">{Math.round(value)}</strong>{unit && <span className="opacity-75"> {unit}</span>}
        {label && <div className="opacity-75">{label}</div>}
      </div>
    </div>
  );
}

export { RingGauge, Radar, Speedometer, useTween };

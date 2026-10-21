'use client';
import { useState, useRef, useEffect } from 'react';
import { Icon } from './icon';
import { cx } from '@/lib/cx';

// Splits milliseconds into the zero-padded parts Counter shows and reports (tos = hundredths).
const pad = (n) => String(n).padStart(2, '0');
const splitTime = (ms) => ({
  hour: pad(Math.floor(ms / 3600000)),
  minute: pad(Math.floor(ms / 60000) % 60),
  second: pad(Math.floor(ms / 1000) % 60),
  tos: pad(Math.floor(ms / 10) % 100),
});

/**
 * Stopwatch: runs while active is true. When active turns false it reports the time to getTime
 * ({ hour, minute, second, tos }, zero-padded strings) and resets to zero.
 * Time is read from the clock (Date.now) instead of counting ticks, so it stays exact when the
 * browser slows timers (background tabs).
 */
const Counter = ({ active, getTime, className }) => {
  const [ elapsed, setElapsed ] = useState(0);
  const start = useRef(null);

  useEffect(() => {
    if (active) {
      start.current = Date.now();
      setElapsed(0);
      const interval = setInterval(() => setElapsed(Date.now() - start.current), 50);
      return () => clearInterval(interval); // also on unmount, so no timer leaks
    }
    if (start.current !== null) { // just stopped (not the first render): report and reset
      getTime?.(splitTime(Date.now() - start.current));
      start.current = null;
      setElapsed(0);
    }
  }, [active]);

  const t = splitTime(elapsed);
  return (
    <small className={cx('timer', className)}>
      <Icon name="stopwatch" /> {t.hour}:{t.minute}:{t.second}.{t.tos}
    </small>
  );
}

export { Counter };

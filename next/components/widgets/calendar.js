'use client';
import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import minMax from 'dayjs/plugin/minMax';
import calendar from 'dayjs/plugin/calendar';
import { cx } from 'marccent-theme/lib/cx';
import { Button } from 'marccent-theme/components/ui/button';

dayjs.extend(weekOfYear); dayjs.extend(isoWeek); dayjs.extend(isBetween); dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter); dayjs.extend(isToday); dayjs.extend(relativeTime); dayjs.extend(advancedFormat);
dayjs.extend(localeData); dayjs.extend(dayOfYear); dayjs.extend(isLeapYear); dayjs.extend(minMax); dayjs.extend(calendar);

/*
 * Calendar widget, all date work done by dayjs: the grid (startOf / add / day), names (localeData), week numbers
 * (weekOfYear, isoWeek), ranges (isBetween, minMax), limits (isSameOrBefore / isSameOrAfter), today (isToday), and
 * the details line (advancedFormat's "Do", relativeTime's "in 3 days", dayOfYear, isLeapYear), and the scheduler's
 * "Tomorrow at 10:00 AM" (calendar). No CSS of its own:
 * grid, header, round, border, bg-* and text-* classes, with only one-off values (a range tint, a dot size) inline.
 */

const KEY = 'YYYY-MM-DD';

/**
 * Calendar: a month of days you can pick from, with year and decade views (click the title to zoom out).
 * Keyboard: arrows move a day / a week, Page Up / Down a month (with Shift, a year), Home / End the week's ends,
 * Enter or Space picks.
 * @param {'single'|'range'} [mode='single'] - Pick one day, or a start and an end (the second click; hover previews).
 * @param {Function} [onChange] - (dayjs) in single mode, ([start, end]) in range mode.
 * @param {{ date: string, title: string, color?: string }[]} [events] - date: anything dayjs parses (a time shows in
 *   the details); color: a bg-* class for its dot (default bg-secondary).
 * @param {string} [min] @param {string} [max] - Days outside them can't be picked.
 * @param {0|1} [weekStart=0] - The first day of the week: 0 Sunday (weeks numbered by weekOfYear), 1 Monday (ISO).
 * @param {boolean} [weekNumbers] - A column of week numbers.
 * @param {Function} [disable] - (dayjs) → true for a day that can't be picked (e.g. fully booked).
 * @param {boolean} [details=true] - The line under the grid saying what's picked; false when the parent shows its own.
 */
const Calendar = ({ mode = 'single', onChange, events = [], min, max, weekStart = 0, weekNumbers, disable, details = true, className, style }) => {
  const [ today, setToday ] = useState(null); // the visitor's own today, once mounted (the server's may differ)
  const [ cursor, setCursor ] = useState(null); // the focused day; its month is the one shown
  const [ view, setView ] = useState('month'); // month → year → decade (zooming out), back in by picking
  const [ picked, setPicked ] = useState(mode === 'range' ? [ null, null ] : null);
  const [ hover, setHover ] = useState(null);
  const grid = useRef(null);
  const focus = useRef(false); // move the browser's focus with the cursor only after a key press

  useEffect(() => { const t = dayjs().startOf('day'); setToday(t); setCursor(t); }, []);
  useEffect(() => {
    if (!focus.current || !cursor) return;
    grid.current?.querySelector(`[data-date="${cursor.format(KEY)}"]`)?.focus();
    focus.current = false;
  }, [cursor]);

  // Events grouped by day, for the dots and the details.
  const byDay = useMemo(() => events.reduce((all, e) => {
    const d = dayjs(e.date);
    (all[d.format(KEY)] ??= []).push({ ...e, at: d });
    return all;
  }, {}), [events]);

  if (!today) return <div className={className} style={{ aspectRatio: 1, ...style }} />;

  const minD = min && dayjs(min).startOf('day'), maxD = max && dayjs(max).startOf('day');
  const allowed = (d) => (!minD || d.isSameOrAfter(minD, 'day')) && (!maxD || d.isSameOrBefore(maxD, 'day')) && !disable?.(d);
  const clamp = (d) => dayjs.max(minD ?? d, dayjs.min(maxD ?? d, d)); // keep the cursor inside the limits (min / max)

  // The month grid: 6 weeks from the week holding the 1st, so every month has the same height.
  const first = cursor.startOf('month');
  const start = first.subtract((first.day() - weekStart + 7) % 7, 'day');
  const days = Array.from({ length: 42 }, (_, i) => start.add(i, 'day'));
  const names = dayjs.weekdaysMin();
  const header = Array.from({ length: 7 }, (_, i) => names[(i + weekStart) % 7]);
  const weekNo = (d) => weekStart === 1 ? d.isoWeek() : d.week();

  // Range: the picked ends, or the start and the hovered day as a preview.
  const [ a, b ] = mode === 'range' ? [ picked[0], picked[1] ?? (picked[0] && hover) ] : [ picked, null ];
  const lo = a && b ? dayjs.min(a, b) : a, hi = a && b ? dayjs.max(a, b) : a;
  const isEnd = (d) => (lo && d.isSame(lo, 'day')) || (hi && d.isSame(hi, 'day'));
  const inRange = (d) => lo && hi && d.isBetween(lo, hi, 'day', '()');

  const pick = (d) => {
    if (!allowed(d)) return;
    setCursor(d);
    if (mode === 'single') { setPicked(d); onChange?.(d); return; }
    const [ s, e ] = picked;
    const next = !s || e ? [ d, null ] : [ dayjs.min(s, d), dayjs.max(s, d) ];
    setPicked(next);
    if (next[1]) onChange?.(next);
  };

  const key = (e) => {
    const moves = {
      ArrowLeft: () => cursor.subtract(1, 'day'), ArrowRight: () => cursor.add(1, 'day'),
      ArrowUp: () => cursor.subtract(1, 'week'), ArrowDown: () => cursor.add(1, 'week'),
      PageUp: () => cursor.subtract(1, e.shiftKey ? 'year' : 'month'), PageDown: () => cursor.add(1, e.shiftKey ? 'year' : 'month'),
      Home: () => cursor.subtract((cursor.day() - weekStart + 7) % 7, 'day'),
      End: () => cursor.add(6 - (cursor.day() - weekStart + 7) % 7, 'day'),
    };
    if (moves[e.key]) { e.preventDefault(); focus.current = true; setCursor(clamp(moves[e.key]())); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(cursor); }
  };

  // Header: title (zooms out) and the arrows, which step a month, a year or ten years depending on the view.
  const step = { month: [ 1, 'month' ], year: [ 1, 'year' ], decade: [ 10, 'year' ] }[view];
  const decadeStart = cursor.year() - cursor.year() % 10;
  const title = { month: cursor.format('MMM YYYY'), year: cursor.format('YYYY'), decade: `${decadeStart} – ${decadeStart + 9}` }[view];
  const cols = weekNumbers ? 8 : 7;

  return (
    <div className={cx('bg border round shadow pad grid cols-1 gap-sm', className)} style={style}>
      <div className="header"> {/* the card's own padding is enough */}
        <button data-component="button" data-name="view" type="button" className="text-start fw-bold fs-lg text-truncate" onClick={() => setView(view === 'month' ? 'year' : 'decade')}
          disabled={view === 'decade'} aria-label={`${view === 'month' ? cursor.format('MMMM YYYY') : title}${view !== 'decade' ? ', zoom out' : ''}`}
          style={{ border: 0, background: 'none', color: 'inherit', padding: 0, cursor: view === 'decade' ? 'default' : 'pointer' }}>
          <span className="text-gradient">{title}</span>
        </button>
        <Button icon="chevron-left" aria-label={`Previous ${view === 'decade' ? 'ten years' : view}`} onClick={() => setCursor(clamp(cursor.subtract(...step)))} />
        <Button icon="chevron-right" aria-label={`Next ${view === 'decade' ? 'ten years' : view}`} onClick={() => setCursor(clamp(cursor.add(...step)))} />
        <Button icon="calendar-day" className="outline-primary" aria-label="Today" title="Today" onClick={() => { setCursor(today); setView('month'); }} />
      </div>

      {view === 'month' && (
        <div ref={grid} role="grid" aria-label={cursor.format('MMMM YYYY')} className="grid fixed gap-0" style={{ '--cols': cols }} onKeyDown={key}>
          {weekNumbers && <small className="col-center opacity-50" aria-hidden="true">Wk</small>}
          {header.map(n => <small key={n} className="col-center fw-bold opacity-75 pad-y-sm" role="columnheader">{n}</small>)}
          {days.map((d, i) => {
            const k = d.format(KEY), list = byDay[k] ?? [], end = isEnd(d), out = d.month() !== cursor.month();
            return (
              <Fragment key={k}>
                {weekNumbers && i % 7 === 0 && <small className="col-center opacity-50" title={`Week ${weekNo(d)}`}>{weekNo(d)}</small>}
                <button data-component="button" data-name="day" type="button" data-date={k} role="gridcell" tabIndex={d.isSame(cursor, 'day') ? 0 : -1}
                  aria-selected={!!end || !!inRange(d)} aria-current={d.isToday() ? 'date' : undefined} disabled={!allowed(d)}
                  aria-label={`${d.format('dddd, MMMM Do, YYYY')}${list.length ? `, ${list.length} event${list.length > 1 ? 's' : ''}` : ''}`}
                  onClick={() => pick(d)} onMouseEnter={() => mode === 'range' && setHover(d)} onFocus={() => setCursor(d)}
                  className={cx('round col-center', end && 'bg-gradient', d.isToday() && !end && 'text-primary fw-bold', out && !end && 'opacity-50')}
                  style={{ aspectRatio: 1, padding: 0, color: end ? 'var(--light)' : 'inherit', cursor: allowed(d) ? 'pointer' : 'not-allowed',
                    border: `var(--border-width) solid ${d.isToday() ? 'var(--primary)' : 'transparent'}`,
                    background: end ? undefined : inRange(d) ? 'color-mix(in srgb, var(--primary) 22%, transparent)' : 'none',
                    ...(!allowed(d) && { opacity: .25, textDecoration: 'line-through' }) }}>
                  <span>{d.date()}</span>
                  <span className="grid auto-cols gap-0" style={{ gap: '2px', minHeight: '5px' }} aria-hidden="true">
                    {list.slice(0, 3).map((ev, j) => <span key={j} className={cx('circle', ev.color ?? 'bg-secondary')} style={{ width: '5px', aspectRatio: 1 }} />)}
                  </span>
                </button>
              </Fragment>
            );
          })}
        </div>
      )}

      {view === 'year' && (
        <div className="grid fixed cols-3 gap-sm">
          {Array.from({ length: 12 }, (_, m) => cursor.month(m).startOf('month')).map(m => {
            const count = Object.keys(byDay).filter(k => dayjs(k).isSame(m, 'month')).reduce((n, k) => n + byDay[k].length, 0);
            const now = m.isSame(today, 'month');
            return (
              <button data-component="button" data-name={m.format('MMM')} key={m.month()} type="button" onClick={() => { setCursor(clamp(m.date(Math.min(cursor.date(), m.daysInMonth())))); setView('month'); }}
                className={cx('round col-center pad-sm', m.isSame(cursor, 'month') ? 'bg-gradient' : now && 'text-primary fw-bold')}
                style={{ border: `var(--border-width) solid ${now ? 'var(--primary)' : 'var(--border-color)'}`, background: m.isSame(cursor, 'month') ? undefined : 'none',
                  color: m.isSame(cursor, 'month') ? 'var(--light)' : 'inherit', cursor: 'pointer' }}>
                {m.format('MMM')}
                <small className="opacity-75">{count ? `${count} event${count > 1 ? 's' : ''}` : '—'}</small>
              </button>
            );
          })}
        </div>
      )}

      {view === 'decade' && (
        <div className="grid fixed cols-3 gap-sm">
          {Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i).map(y => {
            const d = cursor.year(y);
            return (
              <button data-component="button" data-name={y} key={y} type="button" onClick={() => { setCursor(clamp(d)); setView('year'); }}
                className={cx('round col-center pad-sm', y === cursor.year() ? 'bg-gradient' : y === today.year() && 'text-primary fw-bold',
                  (y < decadeStart || y > decadeStart + 9) && 'opacity-50')}
                style={{ border: `var(--border-width) solid ${y === today.year() ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: y === cursor.year() ? undefined : 'none', color: y === cursor.year() ? 'var(--light)' : 'inherit', cursor: 'pointer' }}>
                {y}
                <small className="opacity-75">{d.isLeapYear() ? 'Leap year' : `${d.endOf('year').dayOfYear()} days`}</small>
              </button>
            );
          })}
        </div>
      )}

      {details && <Details mode={mode} picked={picked} today={today} byDay={byDay} weekNo={weekNo} />}
    </div>
  );
}

// What's picked, in words: the date, how far from today, its week and day of the year, and its events; for a range,
// its ends, length and the events inside it.
const Details = ({ mode, picked, today, byDay, weekNo }) => {
  const from = (d) => d.isSame(today, 'day') ? 'today' : d.from(today); // "in 3 days", "2 months ago"
  const eventsIn = (s, e) => Object.entries(byDay).filter(([ k ]) => dayjs(k).isBetween(s, e, 'day', '[]'))
    .flatMap(([ , list ]) => list).sort((x, y) => x.at.valueOf() - y.at.valueOf());
  let body;
  if (mode === 'single') {
    if (!picked) body = <small className="opacity-75">Pick a day.</small>;
    else body = (
      <>
        <strong>{picked.format('dddd, MMMM Do, YYYY')}</strong>
        <small className="opacity-75">
          {from(picked)} · week {weekNo(picked)} · day {picked.dayOfYear()} of {picked.endOf('year').dayOfYear()}
        </small>
        <EventList list={eventsIn(picked, picked)} />
      </>
    );
  } else {
    const [ s, e ] = picked;
    if (!s) body = <small className="opacity-75">Pick a start day, then an end day.</small>;
    else if (!e) body = <small className="opacity-75">From {s.format('MMM Do')}: now pick an end day.</small>;
    else {
      const n = e.diff(s, 'day') + 1;
      body = (
        <>
          <strong>{s.format('MMM Do')} – {e.format('MMM Do, YYYY')}</strong>
          <small className="opacity-75">{n} day{n > 1 ? 's' : ''} · starts {from(s)} · {n > 7 ? `${Math.ceil(n / 7)} weeks` : 'within a week'}</small>
          <EventList list={eventsIn(s, e)} />
        </>
      );
    }
  }
  return <div className="grid cols-1 gap-0 pad-y-sm" aria-live="polite">{body}</div>;
}

const EventList = ({ list }) => !list.length ? null : (
  <ul className="grid cols-1 gap-sm pad-y-sm">
    {list.map((ev, i) => (
      <li key={i} className="grid auto-cols gap-sm items-center">
        <span className={cx('circle', ev.color ?? 'bg-secondary')} style={{ width: '.6rem', aspectRatio: 1 }} />
        <span>{ev.title}</span>
        <small className="opacity-75">{ev.at.format(ev.at.hour() || ev.at.minute() ? 'ddd D · h:mm A' : 'ddd D')}</small>
      </li>
    ))}
  </ul>
);

/* ---------- scheduler ---------- */

// The day in words next to today (calendar): Today, Tomorrow, a weekday this coming week, else "in 12 days".
const dayName = (d, now) => d.calendar(now, { sameDay: '[Today]', nextDay: '[Tomorrow]', nextWeek: '[This] dddd',
  lastDay: '[Yesterday]', lastWeek: '[Last] dddd', sameElse: () => `[${d.from(now.startOf('day'))}]` });

// 'HH:mm' on day d.
const at = (d, hm) => { const [ h, m ] = hm.split(':').map(Number); return d.hour(h).minute(m).second(0).millisecond(0); };

/**
 * The day's openings: the hours from open to close, less the breaks, shared out into `count` equal slots in order
 * (a slot that would run into a break starts after it). 8:00–17:00 less 12:00–13:00 in 4 slots: 8–10, 10–12, 1–3, 3–5.
 * @returns {{ start: dayjs, end: dayjs }[]}
 */
const slotsFor = (day, { open, close, breaks, count }) => {
  const span = breaks.reduce((n, [ s, e ]) => n - at(day, e).diff(at(day, s), 'minute'), at(day, close).diff(at(day, open), 'minute'));
  const length = span / count;
  const slots = [];
  let t = at(day, open);
  for (let i = 0; i < count; i++) {
    const hit = breaks.find(([ s, e ]) => t.isBefore(at(day, e)) && t.add(length, 'minute').isAfter(at(day, s)));
    if (hit) t = at(day, hit[1]);
    slots.push({ start: t, end: t.add(length, 'minute') });
    t = t.add(length, 'minute');
  }
  return slots;
};

/**
 * Scheduler: book a time. A Calendar (nothing before today; days with no openings left can't be picked; booked
 * slots show as dots) beside the picked day's openings, in time order (breaks just leave a gap in the times). Past and booked
 * openings are disabled; picking one sums it up (dayjs: the day, the time, how long, how far away) and Book confirms.
 * @param {string} [open='08:00'] @param {string} [close='17:00'] - The working day, 'HH:mm'.
 * @param {string[][]} [breaks=[['12:00', '13:00']]] - Blocked out, e.g. lunch.
 * @param {number} [count=4] - Openings a day, shared out evenly.
 * @param {string[]} [booked] - Start times already taken (anything dayjs parses).
 * @param {Function} [onBook] - ({ start, end }) when one is booked; it's then taken here too.
 */
const Scheduler = ({ open = '08:00', close = '17:00', breaks = [ [ '12:00', '13:00' ] ], count = 4, booked = [], onBook, className, style }) => {
  const [ day, setDay ] = useState(null);
  const [ slot, setSlot ] = useState(null);
  const [ taken, setTaken ] = useState([]);
  const [ now, setNow ] = useState(null);
  const [ min, setMin ] = useState();
  useEffect(() => { const n = dayjs(); setNow(n); setDay(n.startOf('day')); setMin(n.format(KEY)); }, []);
  const all = useMemo(() => [ ...booked.map(b => dayjs(b)), ...taken ], [ booked, taken ]);
  const hours = { open, close, breaks, count };
  const isTaken = (s) => all.some(b => b.isSame(s.start, 'minute'));
  const isOpen = (s) => !isTaken(s) && now && s.start.isAfter(now);
  const full = (d) => !slotsFor(d, hours).some(isOpen);
  const events = all.map(b => ({ date: b.format(), title: 'Booked', color: 'bg-danger' }));
  if (!day) return <div className={className} style={style} />;

  const slots = slotsFor(day, hours);
  const left = slots.filter(isOpen).length;
  const span = (s) => `${s.start.format('h:mm A')} – ${s.end.format('h:mm A')}`;
  const book = () => { setTaken([ ...taken, slot.start ]); onBook?.(slot); setSlot(null); };

  return (
    <div className={cx('grid gap-lg', className)} style={{ '--cols': 2, '--min': '18rem', ...style }}>
      <Calendar min={min} events={events} disable={full} details={false}
        onChange={(d) => { setDay(d); setSlot(null); }} className="content-start" />
      <div className="bg border round shadow pad grid cols-1 gap-sm content-start">
        <div className="grid cols-1 gap-0">
          <strong className="fs-lg">{day.format('dddd, MMMM Do')}</strong>
          <small className="opacity-75">{dayName(day, now)} · {left} of {count} openings left</small>
        </div>
        <div className="grid cols-1 gap-sm" role="list" aria-label={`Openings on ${day.format('MMMM Do')}`}>
          {slots.map((r, i) => (
            <div key={i} role="listitem">
              <Button icon={isTaken(r) ? 'ban' : slot?.start.isSame(r.start) ? 'check' : 'clock'} disabled={!isOpen(r)}
                aria-pressed={!!slot?.start.isSame(r.start)} onClick={() => setSlot(r)}
                className={cx('w-100', slot?.start.isSame(r.start) ? 'gradient' : 'outline-primary')}>
                {`${span(r)}${isTaken(r) ? ' · Booked' : !isOpen(r) ? ' · Past' : ''}`}
              </Button>
            </div>
          ))}
        </div>
        <div className="grid cols-1 gap-sm pad-y-sm" aria-live="polite">
          {slot ? (
            <>
              <small className="opacity-75">
                {slot.start.calendar(now)} · {slot.end.diff(slot.start, 'minute') / 60} hours · starts {slot.start.from(now)}
              </small>
              <Button icon="calendar-check" className="primary w-100" onClick={book}>Book {slot.start.format('h:mm A')}</Button>
            </>
          ) : <small className="opacity-75">{left ? 'Pick an opening.' : 'No openings left on this day; pick another.'}</small>}
        </div>
      </div>
    </div>
  );
}

export { Calendar, Scheduler, slotsFor };

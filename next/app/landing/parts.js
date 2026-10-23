'use client';
import { useState, useEffect, useContext, useRef } from 'react';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { useInView } from '@/lib/in-view';
import { ToastContext } from '@/lib/context';
import { reducedMotion } from '@/components/visuals/effects';
import { Form, StepForm, Step } from '@/components/ui/form';
import { Input, Field } from '@/components/ui/field';
import { Calendar, Scheduler } from '@/components/widgets/calendar';
import { Speedometer, Radar } from '@/components/widgets/data';
import '@/styles/components/clock.css';

/*
 * The landing pages' pieces that need state, timers or the toast: signup and contact forms, bookings, and numbers
 * that move while on screen. Shared by every page in app/landing.
 */

// The toast, or a no-op where there is no provider.
const useSay = () => {
  const { toast, setToast } = useContext(ToastContext) ?? {};
  return (msg, tone = 'success') => toast && setToast(toast.add(msg, tone));
};

// A pretend request: resolves after ms, so the submit button shows its spinner.
const wait = (ms = 900) => new Promise(r => setTimeout(r, ms));

/**
 * SignupBar: an email and a button on one row (.inline-form), for heroes and calls to action.
 * @param {string} [label='Get started'] @param {string} [icon='arrow-right'] @param {string} [done] - Toast on submit.
 */
const SignupBar = ({ label = 'Get started', icon = 'arrow-right', placeholder = 'Work email', done = 'Check your inbox: we sent the link.' }) => {
  const say = useSay();
  return (
    <Form className="grid inline-form w-100" submitLabel={label} submitIcon={icon}
      onSubmit={async (v, form) => { await wait(); say(done); form.reset(); }}>
      <Input name="email" type="email" label={placeholder} required />
    </Form>
  );
};

/**
 * ContactForm: name, email, a choice and a message, labels lined up (.pairs).
 * @param {string[]} [topics] - The select's options. @param {string} [done] - Toast on submit.
 */
const ContactForm = ({ topics = [ 'Sales', 'Support', 'Partnerships' ], submitLabel = 'Send', done = 'Thanks! We will reply within a day.' }) => {
  const say = useSay();
  return (
    <Form submitLabel={submitLabel} onSubmit={async (v, form) => { await wait(); say(done); form.reset(); }}>
      <Field name="name" autoComplete="name" required />
      <Field name="email" type="email" autoComplete="email" required />
      <Field name="topic" as="select">{topics.map(t => <option key={t}>{t}</option>)}</Field>
      <Field name="message" as="textarea" rows={4} required />
    </Form>
  );
};

/**
 * CountUp: a number that counts up from 0 the first time it scrolls into view.
 * @param {number} to @param {number} [decimals=0] @param {string} [prefix] @param {string} [suffix]
 */
const CountUp = ({ to, decimals = 0, prefix = '', suffix = '', className }) => {
  const box = useRef(null);
  const inView = useInView(box, '0px');
  const [ value, setValue ] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!inView || done.current) return;
    done.current = true;
    if (reducedMotion()) return setValue(to);
    const start = performance.now(), ms = 1600;
    let frame;
    const step = (now) => {
      const t = Math.min((now - start) / ms, 1);
      setValue(to * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [ inView, to ]);
  const text = value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={box} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>{prefix}{text}{suffix}</span>;
};

// A value that drifts round base every ms while on screen (live-looking dashboards). Returns [ ref, value ].
const useDrift = (base, spread, ms = 2200) => {
  const box = useRef(null);
  const inView = useInView(box);
  const [ value, setValue ] = useState(base);
  useEffect(() => {
    if (reducedMotion() || !inView) return;
    const t = setInterval(() => setValue(base + (Math.random() - .5) * 2 * spread), ms);
    return () => clearInterval(t);
  }, [ inView, base, spread, ms ]);
  return [ box, value ];
};

/** LiveSpeedometer: a Speedometer whose needle drifts round value while on screen. */
const LiveSpeedometer = ({ value, spread = 8, max = 100, unit, label, style }) => {
  const [ box, v ] = useDrift(value, spread);
  return <div ref={box} className="w-100 col-center"><Speedometer value={Math.round(v)} max={max} unit={unit} label={label} className="w-100" style={style} /></div>;
};

/**
 * LiveRadar: a Radar whose shape re-draws every few seconds while on screen, each value near its own.
 * @param {{ label: string, value: number }[]} axes
 */
const LiveRadar = ({ axes, className, style }) => {
  const box = useRef(null);
  const inView = useInView(box);
  const [ values, setValues ] = useState(axes.map(a => a.value));
  useEffect(() => {
    if (reducedMotion() || !inView) return;
    const t = setInterval(() => setValues(axes.map(a => Math.min(100, Math.max(15, a.value + (Math.random() - .5) * 30)))), 3000);
    return () => clearInterval(t);
  }, [ inView, axes ]);
  return <div ref={box} className={className} style={style}><Radar axes={axes.map((a, i) => ({ label: a.label, value: Math.round(values[i]) }))} /></div>;
};

/** TripPicker: a range Calendar for trip dates, nothing before today; the toast confirms the pick. */
const TripPicker = () => {
  const say = useSay();
  const [ min, setMin ] = useState();
  const [ events, setEvents ] = useState([]);
  useEffect(() => {
    const t = dayjs().startOf('day');
    setMin(t.format('YYYY-MM-DD'));
    setEvents([
      { date: t.add(6, 'day').format(), title: 'Patagonia departure (2 seats left)', color: 'bg-danger' },
      { date: t.add(13, 'day').format(), title: 'Dolomites departure', color: 'bg-primary' },
      { date: t.add(20, 'day').format(), title: 'Iceland departure', color: 'bg-secondary' },
    ]);
  }, []);
  return <Calendar mode="range" weekStart={1} min={min} events={events}
    onChange={([ a, b ]) => a && b && say(`${b.diff(a, 'day') + 1} days held: ${a.format('MMM D')} to ${b.format('MMM D')}`, 'info')} />;
};

/** VisitScheduler: the clinic's Scheduler (8 to 5, lunch blocked), a few openings already taken. */
const VisitScheduler = () => {
  const say = useSay();
  const [ booked, setBooked ] = useState([]);
  useEffect(() => {
    const t = dayjs().add(1, 'day').startOf('day');
    setBooked([ t.hour(8), t.hour(15), t.add(1, 'day').hour(10) ].map(d => d.format()));
  }, []);
  return <Scheduler booked={booked} count={6} onBook={(s) => say(`See you ${s.start.format('ddd, MMM D [at] h:mm A')}`)} />;
};

/** NewPatientForm: a three-step StepForm (you, insurance, visit). */
const NewPatientForm = () => {
  const say = useSay();
  return (
    <StepForm onSubmit={async (v, form) => { await wait(); say(`Welcome, ${v.first_name}! Your forms are on file.`); form.reset(); }}>
      <Step name="You">
        <Field name="first_name" autoComplete="given-name" required />
        <Field name="last_name" autoComplete="family-name" required />
        <Field name="phone" type="tel" autoComplete="tel" required />
      </Step>
      <Step name="Insurance">
        <Field name="provider" as="select">
          {[ 'Delta Dental', 'Cigna', 'MetLife', 'Aetna', 'No insurance' ].map(p => <option key={p}>{p}</option>)}
        </Field>
        <Field name="member_id" label="Member ID" />
      </Step>
      <Step name="Visit">
        <Field name="reason" as="select">
          {[ 'Cleaning and check-up', 'Tooth pain', 'Whitening', 'Invisalign consult', 'Second opinion' ].map(p => <option key={p}>{p}</option>)}
        </Field>
        <Field name="notes" as="textarea" rows={3} label="Anything we should know?" />
      </Step>
    </StepForm>
  );
};

/** AccountForm: Fernbank's three-step sign-up (you, verify, fund). */
const AccountForm = () => {
  const say = useSay();
  return (
    <StepForm onSubmit={async (v, form) => { await wait(1200); say('Account opened. Your virtual card is ready.'); form.reset(); }}>
      <Step name="You">
        <Field name="full_name" autoComplete="name" required />
        <Field name="email" type="email" autoComplete="email" required />
      </Step>
      <Step name="Verify">
        <Field name="date_of_birth" type="date" required />
        <Field name="ssn_last_4" label="SSN (last 4)" inputMode="numeric" pattern="[0-9]{4}" required />
      </Step>
      <Step name="Fund">
        <Field name="opening_deposit" type="number" min={0} step={5} defaultValue={50} />
        <Field name="plan" as="select">{[ 'Everyday (free)', 'Plus ($4/mo)', 'Metal ($12/mo)' ].map(p => <option key={p}>{p}</option>)}</Field>
      </Step>
    </StepForm>
  );
};

/**
 * EventCountdown: days, hours, minutes and seconds to a date, ticking while on screen.
 * @param {string} to - Anything dayjs parses.
 */
const EventCountdown = ({ to, className }) => {
  const box = useRef(null);
  const inView = useInView(box);
  const [ now, setNow ] = useState(null);
  useEffect(() => {
    setNow(dayjs());
    if (!inView) return;
    const t = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(t);
  }, [ inView ]);
  const left = now ? Math.max(dayjs(to).diff(now, 'second'), 0) : 0;
  const parts = [ [ 'Days', Math.floor(left / 86400) ], [ 'Hrs', Math.floor(left / 3600) % 24 ], [ 'Min', Math.floor(left / 60) % 60 ], [ 'Sec', left % 60 ] ];
  return (
    <div ref={box} className={className} role="timer" aria-label="Time until the event">
      {parts.map(([ label, n ]) => (
        <div key={label} className="col-center pad-sm">
          <span className="display-sm fw-bold timer">{now ? String(n).padStart(2, '0') : '--'}</span>
          <small className="text-uppercase opacity-75">{label}</small>
        </div>
      ))}
    </div>
  );
};

// Canvas animations (visuals/canvas.js) as backdrops, loaded only in the browser; they pause off screen (theme/hoc.js).
const CANVASES = { network: 'NetworkLoopWTRC', particles: 'ParticleFlowfieldWTRC', blob: 'BlobWTRC', wave: 'WaveWTRC' };
const loaders = Object.fromEntries(Object.entries(CANVASES).map(([ k, name ]) =>
  [ k, dynamic(() => import('@/components/visuals/canvas').then(m => m[name]), { ssr: false }) ]));

/** Backdrop: a canvas animation filling its cell (put it first in a .stack). @param {'network'|'particles'|'blob'|'wave'} kind */
const Backdrop = ({ kind = 'network', id, className }) => {
  const Canvas = loaders[kind];
  // contain: size: the canvas fills the cell but never adds to its size (it would grow the stack round it).
  return <div className={className} style={{ contain: 'size' }}><Canvas id={id ?? `backdrop-${kind}`} /></div>;
};

export { Backdrop, SignupBar, ContactForm, CountUp, LiveSpeedometer, LiveRadar, TripPicker, VisitScheduler, NewPatientForm, AccountForm, EventCountdown };

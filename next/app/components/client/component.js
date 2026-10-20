'use client';
import React, { useState, useRef, useEffect, useContext, useId } from 'react';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { post } from "@marccent/util";
import { ToastContext } from '@/components/context';
import { cx, Icon, Button, Loading, Alert, Field } from '@/components/server/component';

/*
 * Components that need the browser: state, effects, event handlers, browser APIs. Everything else
 * (cx, Icon, Button, Loading, Alert, Input, Field, Accordion) is in server/component.js.
 */

/* ---------- modal ---------- */

/**
 * Modal (replaces react-bootstrap's): a native <dialog>. The browser draws the backdrop, keeps focus inside
 * and closes it on Esc; a click on the backdrop closes it too. Layout in components.css, colors in theme.css.
 * @param {string} title @param {boolean} show @param {Function} setShow - Called with false on close.
 * @param {React.ReactNode} [footer] - Extra footer buttons, before Close.
 */
const Modal = ({ title, show, setShow, footer, children }) => {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (show && !dialog.open) dialog.showModal();
    if (!show && dialog.open) dialog.close();
  }, [show]);
  // The dialog has no padding, so a click whose target is the dialog itself landed on the backdrop.
  return (
    <dialog ref={ref} className="modal" aria-labelledby={titleId} onClose={() => setShow(false)}
      onClick={(e) => e.target === ref.current && setShow(false)}>
      <div className="grid divide">
        <div className="header">
          <h5 id={titleId}>{title}</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(false)}><Icon name="xmark" /></button>
        </div>
        <div className="body">{children}</div>
        <div className="footer">
          {footer}
          <Button onClick={() => setShow(false)}>Close</Button>
        </div>
      </div>
    </dialog>
  );
}

/* ---------- components ---------- */

// Toast types with a color (settings.css): toast.add(msg, 'success') fills it like <Alert tone="success">.
const TONES = ['primary', 'secondary', 'success', 'danger', 'info'];

const Toast = () => {
  const { toast, setToast } = useContext(ToastContext);
  const [counter, setCounter] = useState(0);
  const remove = (i) => setToast(toast.remove(i));

  dayjs.extend(relativeTime);
  
  useEffect(() => {
    const interval = setInterval(() => setCounter((prev) => prev + 1), 60000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (toast.list.length > 5) remove(0);
  }, [toast]);
  // console.log(toast)
  return (
    <Loading require={[toast]}>
      {/* Toasts (replaces react-bootstrap's): a grid stack in the bottom-right corner, newest last.
          Layout in components.css, colors in theme.css, fade-in in animations.css. */}
      <div className="toasts pad">
        {toast.list.map((item, i) => (
          <div key={`${+item.time}-${item.msg}`} className="toast"
            role="alert" aria-live="assertive" aria-atomic="true"
            style={TONES.includes(item.type) ? { backgroundColor: `var(--${item.type}-mode)`, color: `var(--${item.type}-mode-text)` } : undefined}>
            <div className="header">
              <strong>Marccent</strong>
              <small>{dayjs(item.time).fromNow()}</small>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => remove(i)}><Icon name="xmark" /></button>
            </div>
            <div className="body">{item.msg}</div>
          </div>
        ))}
      </div>
    </Loading>
  )
}

/* ---------- forms ---------- */

// Values of a form as a plain object: { name: value }. Several fields with one name (checkboxes) keep the last.
const formValues = (form) => Object.fromEntries(new FormData(form));

/*
 * Submit handler shared by Form and StepForm: stays on the page (without it the form would post to its action),
 * calls onSubmit with (values, form) and, while an async onSubmit runs, reports busy so the submit button is
 * disabled and a second click can't send the form twice.
 */
const useSubmit = (onSubmit) => {
  const [ busy, setBusy ] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    setBusy(true);
    try { await onSubmit?.(formValues(form), form); }
    finally { setBusy(false); }
  };
  return [ busy, submit ];
}

// Submit button: a spinner in place of the icon, and disabled, while the form is busy.
const SubmitButton = ({ busy, icon = 'paper-plane', children }) => (
  <Button type="submit" icon={busy ? 'fa-solid fa-spinner fa-spin' : icon} disabled={busy} className="primary">{children}</Button>
);

/**
 * Form: a native <form>. The browser validates the fields (required, type, pattern, min…) and shows its
 * own messages before onSubmit runs, so there is no validation code here. Children are plain inputs,
 * selects and textareas, or <Field> for a labelled one. Invalid fields are styled with :user-invalid.
 *
 * @param {Function} onSubmit - Called with (values, formElement); values is { name: value }. If it returns a
 *   promise, the submit button is disabled (with a spinner) until it settles.
 * @param {string|false} [submitLabel="Submit"] - Submit button text; false for no button.
 * @param {string} [submitIcon="paper-plane"] - Submit button icon (see Button).
 * @param {string} [className="grid gap-sm pairs"] - Replaces the default classes. .pairs (grid.css) gives
 *   every Field's label the same width.
 * Any other prop (style, id, action, method…) goes on the <form>.
 *
 * @example
 * <Form onSubmit={(v) => search(v.city)} submitLabel="Search" submitIcon="magnifying-glass">
 *   <Field name="city" required />
 * </Form>
 * @example One row: fields and the button side by side (.inline-form, components.css)
 * <Form className="grid inline-form" onSubmit={find}>
 *   <Input name="city" required /><Input name="state" /><Input name="zip" />
 * </Form>
 */
const Form = ({ onSubmit, submitLabel = 'Submit', submitIcon = 'paper-plane', className = 'grid gap-sm pairs', children, ...rest }) => {
  const [ busy, submit ] = useSubmit(onSubmit);
  return (
    <form className={className} aria-busy={busy || undefined} {...rest} onSubmit={submit}>
      {children}
      {submitLabel && <SubmitButton busy={busy} icon={submitIcon}>{submitLabel}</SubmitButton>}
    </form>
  );
}

/**
 * StepForm: a native form split into steps (<Step name="…">). All steps stay mounted (inactive ones are
 * hidden), so the final values include every step. Next, and jumping ahead from the step list, check every
 * step in between with the browser's own validation; going back is always allowed.
 *
 * @param {Function} onSubmit - Called with (values, formElement) after the last step.
 * @param {Function} [onStep] - Called with (index, values) after moving to another step.
 * @param {string} [className="grid cols-1 gap-sm"] - Replaces the default classes.
 *
 * @example
 * <StepForm onSubmit={save}>
 *   <Step name="Contact"><Field name="email" type="email" required /></Step>
 *   <Step name="Message"><Field name="message" as="textarea" rows={4} required /></Step>
 * </StepForm>
 */
const StepForm = ({ onSubmit, onStep, className = 'grid cols-1 gap-sm', children, ...rest }) => {
  const steps = React.Children.toArray(children);
  const [ current, setCurrent ] = useState(0);
  const [ busy, submit ] = useSubmit(onSubmit);
  const form = useRef(null);
  const sets = useRef([]);
  const last = steps.length - 1;
  // reportValidity shows the browser's message on the first invalid field and returns false.
  const valid = (i) => [...sets.current[i].elements].every(el => el.reportValidity());
  const go = (to) => {
    for (let i = current; i < to; i++) if (!valid(i)) return setCurrent(i); // stop at the first invalid step
    setCurrent(to);
    onStep?.(to, formValues(form.current));
  };
  return (
    <form ref={form} className={className} aria-busy={busy || undefined} {...rest} onSubmit={submit}>
      <div className="grid fixed gap-0 divide border round" style={{ '--cols': steps.length }}>
        {steps.map((step, i) => (
          <button key={step.props.name} type="button" aria-current={i === current ? 'step' : undefined}
            className="page-link"
            onClick={() => go(i)}>
            {i + 1}. {step.props.name}
          </button>
        ))}
      </div>
      {steps.map((step, i) => (
        <fieldset key={step.props.name} ref={el => sets.current[i] = el} hidden={i !== current} aria-label={step.props.name}
          className={cx('grid gap-sm pairs', step.props.className)}>
          {step.props.children}
        </fieldset>
      ))}
      <div className="grid fixed cols-2 gap-sm">
        <Button disabled={current === 0} onClick={() => go(current - 1)}>Back</Button>
        {current < last
          ? <Button icon="arrow-right" onClick={() => go(current + 1)}>Next</Button>
          : <SubmitButton busy={busy}>Submit</SubmitButton>}
      </div>
    </form>
  );
}

// One step of a StepForm. Renders nothing itself; StepForm reads its name, className and children.
const Step = () => null;

const Blur = (props) => {
  const ref = useRef(null);
  const { style={}, id } = props;
  const [ deviation, setDeviation ] = useState(null);
  useEffect(() => setDeviation(parseInt(5 + ref.current.parentNode.offsetWidth / 75)), []);
  
  return (
    <svg ref={ref} className={cx('blur-svg', props.className)} style={style}>
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={deviation} result="blur" />
          <feColorMatrix in="blur" mode="matrix" result="filter" 
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10" />
          <feComposite in="SourceGraphic"  in2="filter" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

// Live clock, updated every second. format is a dayjs format string.
const Clock = ({ format = 'h:mm:ss A', className = '' }) => {
  const [ time, setTime ] = useState(dayjs());
  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);
  return <time className={className} dateTime={time.toISOString()}>{time.format(format)}</time>;
}

// One pagination button. Outside Pagination, so it keeps its identity (and keyboard focus) across renders.
const PageCell = ({ page, label, disabled, current, update, children }) => (
  <button type="button" className="page-link"
    disabled={disabled} aria-label={label} aria-current={page === current && !label ? 'page' : undefined} onClick={() => update(page)}>
    {children}
  </button>
);

/**
 * Pagination (replaces react-bootstrap's): first, previous, one button per page, next, last, as one row of
 * equal cells (grid fixed, --cols = pages + 4). Layout in components.css, colors in theme.css.
 * @param {number} total - Number of items. @param {number} pageSize - Items per page.
 * @param {number} current - Current page (1-based). @param {Function} update - Called with the page to show.
 * @param {string} [className] - Extra classes on the nav (default only "grid fixed gap-0"; add e.g.
 *   "divide border round" for the bar look). @param {Object} [style] - Inline styles on the nav
 *   (may override --cols).
 */
const Pagination = ({ total, pageSize, current, update, className, style }) => {
  const pages = Math.ceil(total / pageSize);
  const first = current === 1;
  const last = current === pages;
  const cell = { current, update };
  return (
    <nav className={cx('grid fixed gap-0', className)} style={{ '--cols': pages + 4, ...style }}
      aria-label="Pages">
      <PageCell {...cell} page={1} label="First page" disabled={first}>&laquo;</PageCell>
      <PageCell {...cell} page={current - 1} label="Previous page" disabled={first}>&lsaquo;</PageCell>
      {Array.from({ length: pages }, (_, i) => <PageCell {...cell} key={i} page={i + 1}>{i + 1}</PageCell>)}
      <PageCell {...cell} page={current + 1} label="Next page" disabled={last}>&rsaquo;</PageCell>
      <PageCell {...cell} page={pages} label="Last page" disabled={last}>&raquo;</PageCell>
    </nav>
  );
}

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
const Counter = ({ active, getTime }) => {
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
    <small className="timer">
      <Icon name="stopwatch" /> {t.hour} : {t.minute} : {t.second} : {t.tos}
    </small>
  );
}

/**
 * ContactUsForm: name, email and message, posted to the server's message/ endpoint. The browser validates the
 * fields; the result shows in an Alert under the form, and the form clears after a successful send.
 */
const ContactUsForm = ({ className = 'grid cols-1 gap-sm', style = { maxWidth: '400px' } }) => {
  const [ result, setResult ] = useState(null); // { tone, msg } after a send

  const send = async (values, form) => {
    const res = await post(`${process.env.NEXT_PUBLIC_SERVER}message/`, values);
    // post resolves to the JSON body with ok added, or to the Error itself when the request fails.
    if (res?.ok) {
      setResult({ tone: 'primary', msg: typeof res.response === 'string' ? res.response : 'Thanks! Your message was sent.' });
      form.reset();
    } else {
      setResult({ tone: 'secondary', msg: "Your message couldn't be sent. Please try again later." });
    }
  }

  return (
    <div className={className} style={style}>
      <Form onSubmit={send} submitLabel="Send">
        <Field name="first_name" autoComplete="given-name" required />
        <Field name="last_name" autoComplete="family-name" required />
        <Field name="email" type="email" autoComplete="email" required />
        <Field name="message" as="textarea" rows={4} required />
      </Form>
      {result && <Alert tone={result.tone}>{result.msg}</Alert>}
    </div>
  );
}

export {
  Modal, Form, StepForm, Step, Toast, Blur, Clock,
  Pagination, Counter, ContactUsForm
}

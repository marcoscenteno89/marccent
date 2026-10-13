'use client';
import React, { useState, useRef, useEffect, useContext, useCallback, useId } from 'react';
import capitalize from 'lodash/capitalize';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { post } from "@marccent/util";
import Link from 'next/link';
import { ToastContext } from '@/components/context';

/* ---------- classes ---------- */

// Joins class names, skipping falsy ones, so a class can be switched by a condition:
// cx('btn', active && 'active', className). Styles need no helper: { ...style, position: 'relative' }.
const cx = (...classes) => classes.filter(Boolean).join(' ');

/* ---------- loading, alert, modal ---------- */

const Loading = (props) => {
  // height auto lets .square's aspect-ratio size it.
  const style = {
    width: '100%',
    height: 'auto'
  }
  let ready = true;
  for (let i of props.require) {
    if (!i) ready = false;
  }

  return ready ? props.children :  (
    <div className="square spinner" style={style} role="status" aria-label="Loading" />
  );
}

/**
 * Alert (replaces react-bootstrap's): a colored message box. Layout in components.css, colors in theme.css.
 * @param {string} [variant="primary"] - primary, secondary, success, danger, warning, info, light, dark.
 * @param {boolean} [active=true] - false renders nothing. Links inside: <a className="alert-link">.
 */
const Alert = ({ variant = 'primary', active = true, className, children }) => {
  if (!active) return null;
  return <div role="alert" className={cx('alert', `alert-${variant}`, className)}>{children}</div>;
}

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

/* ---------- icon and button ---------- */

/**
 * Icon: a Font Awesome icon. Decorative (aria-hidden); give its button or link the accessible name.
 *
 * @param {Object} props
 * @param {string} [props.name] - Icon name without the prefix: "file" → fa-file.
 * @param {string|false} [props.family="fa-solid"] - Style class. Override with "fa-brands" / "fa-regular",
 *   or false to drop it (e.g. when className already carries full classes).
 * @param {string} [props.className] - Extra classes.
 * @param {Object} [props.style] - Inline styles. Any other prop goes on the <i> too.
 * @returns {JSX.Element}
 *
 * @example <Icon name="file" />                              // <i class="fa-solid fa-file">
 * @example <Icon name="github" family="fa-brands" />
 * @example <Icon name="star" className="fs-lg" style={{ color: 'gold' }} />
 * @example <Icon family={false} className="fa-brands fa-linkedin" />  // full classes from data
 */
const Icon = ({ name, family = 'fa-solid', className, ...rest }) => (
  <i className={[family, name && `fa-${name}`, className].filter(Boolean).join(' ')} aria-hidden="true" {...rest} />
);

/**
 * Button: icon on the left, label on the right (styles: .btn / .btn-text / .btn-link in styles/components.css).
 * With an icon it looks like a button; the label hides below 8rem, leaving the icon, so the label is also
 * its aria-label/title. Without an icon it looks like a plain text link.
 * Renders a next/link <Link> when href is given, otherwise a <button type="button">.
 * Icon-only buttons need an aria-label.
 *
 * @param {Object} props
 * @param {string|false} [props.icon=false] - Icon name, rendered with <Icon> (above):
 *   "star" → fa-solid fa-star. Starting with "fa-" it is taken as full classes instead, for other families
 *   or extra classes: "fa-brands fa-github", "fa-solid fa-plus display-6".
 * @param {string} [props.href] - Makes it a link.
 * @param {string} [props.className] - Extra classes.
 * @param {React.ReactNode} [props.children] - The label.
 * @returns {JSX.Element}
 *
 * @example <Button icon="message" href="/contact">Message Me</Button>
 * @example <Button icon="fa-brands fa-github" href={github}>Github</Button>
 * @example <Button onClick={reset}>Start Over</Button>  // text link
 */
const Button = ({ icon = false, href, className, children, ...rest }) => {
  if (!icon) {
    const cls = cx('btn-link', className);
    if (href) return <Link href={href} className={cls} {...rest}>{children}</Link>;
    return <button type="button" className={cls} {...rest}>{children}</button>;
  }
  const label = typeof children === 'string' ? children : undefined;
  const props = {
    className: cx('btn', className),
    ...(children && { 'aria-label': label, title: label }), // the label may hide, so it is also the accessible name
    ...rest,
  };
  const content = (
    <>
      {icon.startsWith('fa-')
        ? <Icon family={false} className={cx(icon, 'btn-icon')} />
        : <Icon name={icon} className="btn-icon" />}
      {children && <span className="btn-text">{children}</span>}
    </>
  );
  if (href) return <Link href={href} {...props}>{content}</Link>;
  return <button type="button" {...props}>{content}</button>;
}

/* ---------- components ---------- */

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
          <div key={`${+item.time}-${item.msg}`} className={cx('toast', item.type && `bg-${item.type}`)}
            role="alert" aria-live="assertive" aria-atomic="true">
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

/**
 * Form: a native <form>. The browser validates the fields (required, type, pattern, min…) and shows its
 * own messages before onSubmit runs, so there is no validation code here. Children are plain inputs,
 * selects and textareas, or <Field> for a labelled one. Invalid fields are styled with :user-invalid.
 *
 * @param {Function} onSubmit - Called with (values, formElement); values is { name: value }.
 * @param {string|false} [submitLabel="Submit"] - Submit button text; false for no button.
 * @param {string} [submitIcon="paper-plane"] - Submit button icon (see Button).
 * @param {string} [className="grid gap-2 pairs"] - Replaces the default classes. .pairs (grid.css) gives
 *   every Field's label the same width.
 * Any other prop (style, id, action, method…) goes on the <form>.
 *
 * @example
 * <Form onSubmit={(v) => search(v.city)} submitLabel="Search" submitIcon="magnifying-glass">
 *   <Field name="city" required />
 * </Form>
 */
const Form = ({ onSubmit, submitLabel = 'Submit', submitIcon = 'paper-plane', className = 'grid gap-2 pairs', children, ...rest }) => (
  <form className={className} {...rest} onSubmit={(e) => {
    e.preventDefault(); // stay on the page; without onSubmit the form would post to its action instead
    onSubmit?.(formValues(e.currentTarget), e.currentTarget);
  }}>
    {children}
    {submitLabel && <Button type="submit" icon={submitIcon}>{submitLabel}</Button>}
  </form>
);

// Readable text from a field name: "first_name" → "First name".
const nameToLabel = (name) => capitalize(name.replace(/_/g, ' '));

/**
 * Input: just the input, its label text shown as the placeholder (and used as aria-label, since a placeholder
 * is not a label and disappears while typing). Default text comes from the name: "first_name" → "First name".
 * @param {string} name @param {string} [label] - Text for the placeholder and aria-label.
 * @param {string} [as="input"] - "textarea" or "select" (a select shows no placeholder; it keeps the aria-label).
 * Any other prop (type, required, placeholder to override, rows…) goes on the element.
 *
 * @example <Input name="email" type="email" required />  // placeholder "Email"
 */
const Input = ({ name, label, as: Tag = 'input', className, children, ...rest }) => {
  const text = label ?? nameToLabel(name);
  return (
    <Tag name={name} className={cx('input', className)} aria-label={text}
      placeholder={Tag === 'select' ? undefined : text} {...rest}>{children}</Tag>
  );
}

/**
 * Field: a label joined to its input in one box (.field, styles/components.css). The label defaults to the name: "first_name" → "First name".
 * @param {string} name @param {string} [label] @param {string} [as="input"] - "textarea" or "select".
 * Any other prop (type, required, placeholder, rows…) goes on the input.
 */
const Field = ({ name, label, as: Tag = 'input', className, children, ...rest }) => {
  const id = useId();
  return (
    <div className={cx('field sub-x', className)}>
      <label className="field-label" htmlFor={id}>{label ?? nameToLabel(name)}</label>
      <Tag id={id} name={name} className="input" {...rest}>{children}</Tag>
    </div>
  );
}

/**
 * StepForm: a native form split into steps (<Step name="…">). All steps stay mounted (inactive ones are
 * hidden), so the final values include every step. Next, and jumping ahead from the step list, check every
 * step in between with the browser's own validation; going back is always allowed.
 *
 * @param {Function} onSubmit - Called with (values, formElement) after the last step.
 * @param {Function} [onStep] - Called with (index, values) after moving to another step.
 * @param {string} [className="grid cols-1 gap-2"] - Replaces the default classes.
 *
 * @example
 * <StepForm onSubmit={save}>
 *   <Step name="Contact"><Field name="email" type="email" required /></Step>
 *   <Step name="Message"><Field name="message" as="textarea" rows={4} required /></Step>
 * </StepForm>
 */
const StepForm = ({ onSubmit, onStep, className = 'grid cols-1 gap-2', children, ...rest }) => {
  const steps = React.Children.toArray(children);
  const [ current, setCurrent ] = useState(0);
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
    <form ref={form} className={className} {...rest} onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.(formValues(e.currentTarget), e.currentTarget);
    }}>
      <div className="grid fixed gap-0 divide border round" style={{ '--cols': steps.length }}>
        {steps.map((step, i) => (
          <button key={step.props.name} type="button" className="page-link" aria-current={i === current ? 'step' : undefined}
            onClick={() => go(i)}>
            {i + 1}. {step.props.name}
          </button>
        ))}
      </div>
      {steps.map((step, i) => (
        <fieldset key={step.props.name} ref={el => sets.current[i] = el} hidden={i !== current} aria-label={step.props.name}
          className={cx('grid gap-2 pairs', step.props.className)}>
          {step.props.children}
        </fieldset>
      ))}
      <div className="grid fixed cols-2 gap-2">
        <Button disabled={current === 0} onClick={() => go(current - 1)}>Back</Button>
        {current < last
          ? <Button icon="arrow-right" onClick={() => go(current + 1)}>Next</Button>
          : <Button type="submit" icon="paper-plane">Submit</Button>}
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
  <button type="button" className="page-link" disabled={disabled} aria-label={label}
    aria-current={page === current && !label ? 'page' : undefined} onClick={() => update(page)}>
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
const ContactUsForm = ({ className = 'grid cols-1 gap-2', style = { maxWidth: '400px' } }) => {
  const [ result, setResult ] = useState(null); // { variant, msg } after a send

  const send = async (values, form) => {
    const res = await post(`${process.env.NEXT_PUBLIC_SERVER}message/`, values);
    // post resolves to the JSON body with ok added, or to the Error itself when the request fails.
    if (res?.ok) {
      setResult({ variant: 'success', msg: typeof res.response === 'string' ? res.response : 'Thanks! Your message was sent.' });
      form.reset();
    } else {
      setResult({ variant: 'danger', msg: "Your message couldn't be sent. Please try again later." });
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
      {result && <Alert variant={result.variant}>{result.msg}</Alert>}
    </div>
  );
}

/**
 * Accordion built on <details>/<summary> (replaces react-bootstrap's Accordion). The browser opens and closes
 * items; items share a name, so opening one closes the others (pass multiple to allow several open).
 * Lines between items come from .divide; look in components.css, animation in animations.css, colors in theme.css.
 * @example
 * <Accordion defaultOpen={0}>
 *   <AccordionItem header="Title" className="grid cols-1 gap-2">Body</AccordionItem>
 * </Accordion>
 */
const Accordion = (props) => {
  const { children, defaultOpen = 0, multiple = false, className = '' } = props;
  const name = useId();
  return (
    <div className={`accordion grid cols-1 gap-0 divide border round ${className}`.trim()}>
      {React.Children.toArray(children).map((child, i) => React.cloneElement(child, {
        name: multiple ? undefined : name,
        defaultOpen: i === defaultOpen,
      }))}
    </div>
  );
}

// One item: header is the always-visible summary row, children the body. className goes on the body.
const AccordionItem = (props) => {
  const { header, children, className = '', name, defaultOpen = false } = props;
  return (
    <details className="accordion-item" name={name} open={defaultOpen}>
      <summary className="accordion-header header">{header}</summary>
      <div className={cx('body', className)}>{children}</div>
    </details>
  );
}

export { 
  cx, Icon, Button, Loading, Alert, Modal,
  Form, Field, Input, StepForm, Step, Toast, Blur, Clock,
  Pagination, Counter, ContactUsForm,
  Accordion, AccordionItem
}
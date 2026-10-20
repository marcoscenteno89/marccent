import React, { useId } from 'react';
import capitalize from 'lodash/capitalize';
import Link from 'next/link';

/*
 * Components that need no 'use client': no state, effects or event handlers of their own. They render on the
 * server when a server component uses them, and in the browser when a client component does (handlers such as
 * onClick can then be passed through). Components that need the browser are in client/component.js.
 */

/* ---------- classes ---------- */

// Joins class names, skipping falsy ones, so a class can be switched by a condition:
// cx('btn', active && 'active', className). Styles need no helper: { ...style, position: 'relative' }.
const cx = (...classes) => classes.filter(Boolean).join(' ');

/* ---------- loading, alert ---------- */

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
 * Alert (replaces react-bootstrap's): a bordered message box (components.css), filled with the mode shade of
 * its tone: lighter in light mode, darker in dark mode (theme.css).
 * @param {"primary"|"secondary"} [tone="primary"] - secondary for errors and warnings.
 * @param {string} [className] - Extra classes; a palette class (theme.css) replaces the fill.
 * @param {boolean} [active=true] - false renders nothing. Links inside: <a className="alert-link">.
 */
const Alert = ({ active = true, tone = 'primary', className, children }) => {
  if (!active) return null;
  return <div role="alert" className={cx('alert', className)} style={{ '--tone': `var(--${tone}-mode)` }}>{children}</div>;
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
 *   or extra classes: "fa-brands fa-github", "fa-solid fa-plus display".
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

/* ---------- inputs ---------- */

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

/* ---------- accordion ---------- */

/**
 * Accordion built on <details>/<summary> (replaces react-bootstrap's Accordion). The browser opens and closes
 * items; items share a name, so opening one closes the others (pass multiple to allow several open).
 * Lines between items come from .divide; look in components.css, animation in animations.css, colors in theme.css.
 * @example
 * <Accordion defaultOpen={0}>
 *   <AccordionItem header="Title" className="grid cols-1 gap-sm">Body</AccordionItem>
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

/* ---------- board ---------- */

/**
 * Board: a grid_helper Grid as a game board, one square cell per grid cell in a single `.grid fixed` (cells
 * are stored row by row, the order CSS grid fills). Layout in components.css.
 * @param {import('@/components/grid_helper').Grid} grid
 * @param {(cell: any, index: number) => React.ReactNode} children - renders one cell (give it a key)
 * @param {string} [gap] - space between cells, e.g. '2px'
 */
const Board = ({ grid, gap, className, children }) => (
  <div className={cx('board grid fixed', className)} style={{ '--cols': grid.cols, '--gap': gap }}>
    {grid.cells.map(children)}
  </div>
);

export {
  cx, Icon, Button, Loading, Alert, Input, Field, Accordion, AccordionItem, Board
}

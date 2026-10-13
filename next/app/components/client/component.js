'use client';
import React, { Component, useState, useRef, useEffect, useContext, useCallback, useId } from 'react';
import capitalize from 'lodash/capitalize';
import { ToastContainer, Form, Toast, Modal, Alert, Pagination } from 'react-bootstrap';
// import ToastContainer from 'react-bootstrap/ToastContainer';
// import Form from 'react-bootstrap/Form';
// import Toast from 'react-bootstrap/Toast';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import Alert from 'react-bootstrap/Alert';
// import Pagination from 'react-bootstrap/Pagination';
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
  // height auto lets .square's aspect-ratio size it (spinner-grow sets a fixed height otherwise).
  const style = {
    width: '100%',
    height: 'auto'
  }
  let ready = true;
  for (let i of props.require) {
    if (!i) ready = false;
  }

  return ready ? props.children :  (
    <div className="square spinner-grow" style={style} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

const WebAlert = (props) => {
  if (!props.active) return null
  return (
    <Alert variant={props.variant}>
      <div dangerouslySetInnerHTML={{ __html: props.msg }} />
    </Alert>
  )
}

const WebModal = (props) => {
  const { title, children, show, setShow } = props;
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
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

const WebToast = () => {
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
      <ToastContainer className="position-fixed bottom-0 end-0 pad">
        {toast.list.map((item, i) => (
          <Toast key={`toast-${i}`} bg={item.type} onClose={() => remove(i)}>
            <Toast.Header>
              <strong className="me-auto">Marccent</strong>
              <small>{dayjs(item.time).fromNow()}</small>
            </Toast.Header>
            <Toast.Body>{item.msg}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </Loading>
  )
}

const WebForm = (props) => {
  const [ form, setForm ] = useState(null);
  const [ alert, setAlert] = useState('');
  useEffect(() => {
    const obj = {};
    for (let i of React.Children.toArray(props.children)) {
      obj[i.props.name] = {
        name: i.props.name,
        value: i.props.value ? i.props.value : '',
        label: capitalize(i.props.name.replace(/_/g, ' ')),
        placeholder: i.props.placeholder ? i.props.placeholder : i.props.name.replace(/_/g, ' '),
        ref: null
      }
    }
    setForm(obj);
  }, []);

  const set = (ref, name) => {
    let newForm = { ...form };
    newForm[name].ref = ref;
    setForm(newForm);
  }

  const submit = useCallback(() =>  {
    let msg = '';
    Object.keys(form).map((key) => {
      form[key].value = form[key].ref.value; // Update value
      if (form[key].ref.type !== 'hidden') {
        if (!form[key].ref.validity.valid) {
          msg += `${form[key].label}: ${form[key].ref.validationMessage}</br>`;
        }
      }
    });
    if (msg !== '') { // Found Issues, set alert
      setAlert(msg); 
    } else { // No issues, clear alert and submit
      setAlert('');
      props.callBack(form);
    }
  });
  
  const arr = React.Children.toArray(props.children);
  return (
    <Loading require={[form]}>
      <Form className={props.className} style={props.style}>
        {arr.map((key, i) => <Input key={`form-${i}`} set={set} {...key.props} />)} 
        <Button onClick={submit}>Submit</Button>
        {/* <WebAlert variant="danger mb-2" active={alert !== ''} msg={alert} /> */}
      </Form>
    </Loading>
  )
}

const Input = (props) => {
  
  const ref = useRef(null);
  const [ label ] = useState(capitalize(props.name.replace(/_/g, ' ')));
  let n = { ...props };
  delete n.set;
  delete n['no-label']; // our own flag, not an HTML attribute
  useEffect(() => props.set(ref.current, props.name), []);
  
  return (
    <>
      {props['no-label'] ? 
        <Form.Control ref={ref} id={`id-${n.name}`} {...n} /> 
      : 
        <Form.Group className="input-group mb-2">
          <Form.Label className="input-group-text m-0" htmlFor={`#id-${props.name}`}>
            {label}
          </Form.Label>
          <Form.Control ref={ref} id={`id-${n.name}`} {...n} />
        </Form.Group>
      }
    </>
  )
}

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

const WebPagination = (props) => {
  const { total, pageSize, current, update } = props;
  const items = [];
  const cnt = Math.floor(total / pageSize);
  const pages = total % pageSize > 0 ? cnt + 1 : cnt;
  const first = current === 1;
  const last = current === total.length;
  const style = {
    width: `calc(100% / ${pages + 4})`,
    textAlign: 'center'
  }

  for (let o = 1; o <= pages; o++) {
    const active = o === current;
    items.push(
      <Pagination.Item style={style}  key={o} onClick={()=> update(o)} active={active}>
        {o}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className="my-1 pad border round">
      <Pagination.First style={style} disabled={first} onClick={()=> update(1)} />
      <Pagination.Prev style={style} disabled={first} onClick={()=> update(current - 1)} />
      {items}
      <Pagination.Next style={style} disabled={last} onClick={()=> update(current + 1)} />
      <Pagination.Last style={style} disabled={last} onClick={()=> update(total)} />
    </Pagination>

  )
}

class PopUp extends Component {

  render() {
    const b = this.props;
    const popup = {
      overlay: {
        backgroundColor: 'rgba(56,61,68,0.5)'
      },
      content: {
        filter: `drop-shadow(0 0 10px rgba(0,0,0,0.8))`
      }
    }

    const headingBreak = {
      // background: `
      //   radial-gradient(circle at bottom left, rgba(0,0,0,0) 2rem, ${a.hex.primary} 2rem) bottom left,
      //   radial-gradient(circle at bottom right, rgba(0,0,0,0) 2rem, ${a.hex.secondary} 2rem) bottom right`,
      backgroundSize: '2rem 100%',
      backgroundRepeat: 'no-repeat'
    }
    const bodyBreak = {
      // background: `
      //   radial-gradient(circle at top left, rgba(0,0,0,0) 2rem, ${a.mode} 2rem) top left,
      //   radial-gradient(circle at top right, rgba(0,0,0,0) 2rem, ${a.mode} 2rem) top right`,
      backgroundSize: '50% 100%',
      backgroundRepeat: 'no-repeat'
    }
      
    return (
      <Modal style={popup} className="modal" overlayClassName="overlay" isOpen={this.props.display}>
        <div className="heading center">
          <div  className="left"></div>
          <div  className="right"></div>
          <h2>{b.header}</h2>
        </div>
        <div style={headingBreak} className="break">
          <div className="grad"></div>
        </div>
        <div style={bodyBreak} className="break"></div>
        <div style={{backgroundColor: a.mode}} className="body center">
          {b.children}
          <div className="center controller">
            {b.controller ? <Button onClick={() => b.controller()}>{b.btnText}</Button> : ''}
            <Button onClick={() => this.props.close()}>Close</Button>
          </div>
        </div>
      </Modal>
    )
  }
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

const ContactUsForm = props => {
  const [ active, setActive ] = useState(false);
  const [ variant, setVariant ] = useState('success');
  const [ alert, setAlert ] = useState('');

  const onClick = async (data) => {
    
    const obj = {};
    Object.entries(data).forEach(([key, val]) => obj[val.name] = val.value );
    const res = await post(`${process.env.NEXT_PUBLIC_SERVERURL}message/`, obj).then(res => res);
    setVariant(res.ok ? 'success' : 'danger');
    setAlert(res.ok ? res.response : res);
    setActive(true);
  }
  const style = {
    width: '100%',
    maxWidth: '400px'
  }
  
  return (
    <>
      <WebForm style={style} callBack={onClick}>
        <input type="text" name="first_name" required />
        <input type="text" name="last_name" required />
        <input type="text" name="email" required />
        <input type="text" name="message" as="textarea" rows={4} required />
      </WebForm>
      {/* <WebAlert variant={`${variant} mb-2`} active={active} msg={alert} /> */}
    </>
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
      <summary className="accordion-header pad">{header}</summary>
      <div className={`accordion-body pad ${className}`.trim()}>{children}</div>
    </details>
  );
}

export { 
  cx, Icon, Button, Loading, WebAlert, WebModal,
  WebForm, WebToast, Blur, Clock,
  WebPagination, Counter, ContactUsForm, Input,
  Accordion, AccordionItem
}
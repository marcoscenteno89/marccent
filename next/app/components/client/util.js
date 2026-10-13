'use client'
// Recovered from ~/app/util-react/src (the old @marccent/util-react package), with missing imports fixed.
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import capitalize from 'lodash/capitalize';
import { Form as BsForm, Alert as BsAlert, Modal as BsModal } from 'react-bootstrap';

/* ---------- classes.js ---------- */

class CLS {
  constructor() {
    this.list = this.checkData(arguments);
  }

  checkData(arg) {
    let list;
    if (arg.length === 1) {
      arg = arg[0];
      if (!arg) return list = []
      if (typeof arg === 'string') {
        if (arg.includes(' ')) {
          list = arg.split(' ');
        } else if (arg.includes(',')) {
          list = arg.split(',');
        } else {
          list = [arg]
        }
      }

      if (typeof arg === 'object') list = arg;

    } else {
      list = Array.from(arg);
    }
    const filtered = list.filter(Boolean);
    return filtered;
  }

  add() {
    const arr = Array.from(arguments);
    for (let i of arr) {
      if (!this.list.includes(i)) this.list.push(i);
    }
    this.list = this.list.filter(Boolean);
    return this;
  }

  remove() {
    const arr = Array.from(arguments);
    this.list = this.list.filter(item => !arr.includes(item));
    return this;
  }

  prt() {
    return this.list.join(' ');
  }
}

class STL extends Object {
  constructor(args) {
    super();
    for (let key in args) {
      this[key] = args[key];
    }
  }

  add(name, value) {
    this[name] = value;
    return this;
  }

  remove(name) {
    delete this[name];
    return this;
  }
}

/* ---------- components.js ---------- */

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

/**
 * Button: icon on the left, label on the right (styles: .btn / .btn-text in globals.css).
 * The label truncates with "…" when the button runs out of room; the icon never shrinks.
 * Renders a next/link <Link> when href is given, otherwise a <button type="button">.
 * Icon-only buttons need an aria-label.
 *
 * @param {Object} props
 * @param {string} [props.icon] - Font Awesome classes, e.g. "fa-solid fa-message".
 * @param {string} [props.href] - Makes it a link.
 * @param {string} [props.className] - Extra classes (.btn is always added).
 * @param {React.ReactNode} [props.children] - The label.
 * @returns {JSX.Element}
 *
 * @example <Button icon="fa-solid fa-message" href="/contact">Message Me</Button>
 * @example <Button icon="fa-solid fa-rotate" onClick={reset}>Start Over</Button>
 */

const Icon = ({ className, ...rest }) => (
  <i className={className} aria-hidden="true" {...rest} />
);

const Button = ({ icon, href, className, children, ...rest }) => {
  const cls = new CLS(className).add('btn').prt();
  const content = (
    <>
      {icon && <Icon className={`btn-icon ${icon}`} />}
      {children && <span className="btn-text">{children}</span>}
    </>
  );
  if (href) return <Link href={href} className={cls} {...rest}>{content}</Link>
  return <button type="button" className={cls} {...rest}>{content}</button>
}

// Hides the label when its slot is narrower than 8rem; the icon stays.
const CompactButton = ({ wrapClassName, children, ...rest }) => {
  const label = typeof children === 'string' ? children : undefined;
  return (
    <span className={new CLS(wrapClassName).add('btn-cq').prt()}>
      <Button aria-label={label} title={label} {...rest}>{children}</Button>
    </span>
  )
}

const WebAlert = (props) => {
  if (!props.active) return null
  return (
    <BsAlert variant={props.variant}>
      <div dangerouslySetInnerHTML={{ __html: props.msg }} />
    </BsAlert>
  )
}

const WebModal = (props) => {
  const { title, children, show, setShow } = props;
  return (
    <BsModal show={show} onHide={() => setShow(false)}>
      <BsModal.Header closeButton>
        <BsModal.Title>{title}</BsModal.Title>
      </BsModal.Header>
      <BsModal.Body>{children}</BsModal.Body>
      <BsModal.Footer>
        <Button onClick={() => setShow(false)}>Close</Button>
      </BsModal.Footer>
    </BsModal>
  )
}

/* ---------- form.js ---------- */

const Input = (props) => {
  const ref = useRef(null);
  const [ label ] = useState(capitalize(props.name.replace(/_/g, ' ')));
  let n = { ...props };
  delete n.set;
  useEffect(() => props.set(ref.current, props.name), []);

  return (<><BsForm.Control ref={ref} id={`id-${n.name}`} {...n} placeholder={label} /></>)
}

const LabelInput = (props) => {
  const ref = useRef(null);
  const [ label ] = useState(capitalize(props.name.replace(/_/g, ' ')));
  let n = { ...props };
  delete n.set;
  useEffect(() => props.set(ref.current, props.name), []);

  return (
    <BsForm.Group className="input-group mb-2">
      <BsForm.Label className="input-group-text m-0" htmlFor={`#id-${props.name}`}>
        {label}
      </BsForm.Label>
      <BsForm.Control ref={ref} id={`id-${n.name}`} {...n} placeholder={label} />
    </BsForm.Group>
  )
}

/**
 * Represents a web form component.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.className - The CSS class name for the form.
 * @param {Function} props.callBack - The callback function to be called on form submission.
 * @param {ReactNode} props.children - The child components of the form.
 * @returns {JSX.Element} The rendered form component.
 */
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

  const submit = () =>  {
    let msg = '';
    Object.keys(form).map((key) => {
      form[key].value = form[key].ref.value; // Update value
      if (form[key].ref.type !== 'hidden') {
        if (!form[key].ref.validity.valid) {
          form[key].ref.value = '';
          form[key].ref.placeholder = form[key].ref.validationMessage;
          form[key].ref.classList.add('is-invalid');
          msg += `${form[key].label}: ${form[key].ref.validationMessage}</br>`;
        }
      }
    });
    if (msg !== '') { // Found Issues, set alert
      // setAlert(msg);
    } else { // No issues, clear alert and submit
      setAlert('');
      props.callBack(form);
    }
  }

  const arr = React.Children.toArray(props.children);

  return (
    <Loading require={[form]}>
      <BsForm className={props.className}>
        {arr.map((key, i) => {
          return <Input key={`field-${i}`} set={set} {...key.props} />
        })}
        <Button onClick={submit}>Submit</Button>
        <WebAlert variant="danger" active={alert !== ''} msg={alert} />
      </BsForm>
    </Loading>
  )
}

export {
  CLS, STL,
  Button, CompactButton, Loading, WebAlert as Alert, WebModal as Modal,
  WebForm, WebForm as Form, LabelInput, Input
};

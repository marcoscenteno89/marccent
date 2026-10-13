'use client';
import React, { Component, useState, useRef, useEffect, useContext, useCallback, useId } from 'react';
import capitalize from 'lodash/capitalize';
import { ToastContainer, Form, Toast, Button, Modal, Alert, Pagination } from 'react-bootstrap';
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
import { Loading } from "@/components/client/util";
import { ToastContext } from '@/components/context';
import { CLS, STL } from '@/components/client/util';

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

const WebForm2 = (props) => {

}

const WebForm = (props) => {
  const [ form, setForm ] = useState(null);
  const [ alert, setAlert] = useState('');
  const f_cls = new CLS(props.className);
  const f_stl = new STL(props.style);
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
      <Form className={f_cls.prt()} style={f_stl}>
        {arr.map((key, i) => <Input key={`form-${i}`} set={set} {...key.props} />)} 
        <Button onClick={submit} variant="">Submit</Button>
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

// const Input = (props) => {
//   const ref = useRef(null);
//   const [ label ] = useState(capitalize(props.name.replace(/_/g, ' ')));
//   let n = { ...props };
//   delete n.set;
//   useEffect(() => props.set(ref.current, props.name), []);
//   return (
//     <Form.Group className="input-group mb-2">
//       <Form.Label className="input-group-text m-0" htmlFor={`#id-${props.name}`}>
//         {label}
//       </Form.Label>
//       <Form.Control ref={ref} id={`id-${n.name}`} {...n} placeholder={label} />
//     </Form.Group>
//   )
// }

const Blur = (props) => {
  const ref = useRef(null);
  const { style={}, id } = props;
  const [ deviation, setDeviation ] = useState(null);
  const b_cls = new CLS(props.className).add('blur-svg');
  useEffect(() => setDeviation(parseInt(5 + ref.current.parentNode.offsetWidth / 75)), []);
  
  return (
    <svg ref={ref} className={b_cls.prt()} style={style}>
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

const SpCircle = props => {
  return (
    <div className="square center circle shadow-inset">
      <div className="inner circle center linear-gradient shadow-inset">
        <div className="inner circle center relative">{props.children}</div>
      </div>
    </div>
  ) 
}

const Counter2 = () => {
  const start = useRef(dayjs());
  dayjs.extend(relativeTime);
  const [ time, setTime ] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs(start).fromNow()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cls = ['clock', 'row'];
  if (!time) return <div>Loading...</div>;
  return (
    <small>
      <i className="fas fa-stopwatch" style={{marginRight: '0.5rem'}}></i> 
      {time.format('h')} : {time.format('m')} : {time.format('s')}
    </small>
  );
}

const Clock = (props) => {
  const [ time, setTime ] = useState(dayjs());
  const c_cls = new CLS(props.className).add('clock', 'grid', 'fixed', 'cols-4', 'gap-0', 'items-center', 'text-center');
  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={c_cls.prt()}>
      <span className="grid gap-0">
        <small>Hr</small><small>{time.format('h')}</small>
      </span>
      <span className="grid gap-0">
        <small>Min</small><small>{time.format('m')}</small> 
      </span>
      <span className="grid gap-0">
        <small>Sec</small><small>{time.format('s')}</small>
      </span>
      <h2 className="center">{time.format('A')}</h2>
    </div>
  );
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
            {b.controller ? <Button variant="" onClick={() => b.controller()}>{b.btnText}</Button> : ''}
            <Button variant="" onClick={() => this.props.close()}>Close</Button>
          </div>
        </div>
      </Modal>
    )
  }
}

class Counter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tos: 0,
      second: 0,
      minute: 0,
      hour: 0
    }
  }

  addZero(num) {
    return num > 10 ? `${num}` : `0${num}`;
  }

  start() {
    this.timer = setInterval(() => {
      let st = this.state;
      const nt = {
        tos: st.tos,
        second: st.second,
        minute: st.minute,
        hour: st.hour
      }
      if (st.tos > 9) {
        nt.tos = 0;
        nt.second = st.second + 1;
      }
      if (st.second > 59) {
        nt.second = 0;
        nt.minute = st.minute + 1;
      }
      if (st.minute > 59) {
        nt.minute = 0;
        nt.hour = st.hour + 1;
      }
      this.setState({
        tos: nt.tos + 1,
        second: nt.second,
        minute: nt.minute,
        hour: nt.hour
      })
    }, 100)
  }
  
  stop() {
    clearInterval(this.timer);
    let time = {
      tos: this.state.tos < 10 ? `${this.state.tos}0` : this.state.tos,
      second: this.addZero(this.state.second),
      minute: this.addZero(this.state.minute),
      hour: this.addZero(this.state.hour)
    }
    this.setState({ 
      tos: 0,
      second: 0,
      minute: 0,
      hour: 0
    });
    this.props.getTime(time);
  }

  componentDidUpdate(e) {
    if (this.props.active && this.state.tos === 0) this.start();
    if (!this.props.active && this.state.tos > 0) this.stop(e);
  }

  render() {
    const i = this.state;
    return  (
      <small className="timer">
        <i className="fas fa-stopwatch" style={{marginRight: '0.5rem'}}></i> 
        {this.addZero(i.hour)} : {this.addZero(i.minute)} : {this.addZero(i.second)} : {i.tos < 10 ? `${i.tos}0` : i.tos}
      </small>
    )        
  }
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

const Show = (props) => {
  const { variant = 'md', children, className = '' } = props;
  const cls = `d-none d-${variant}-inline-block ${className}`.trim();
  return (
    <span className={cls}>{children}</span>
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
  WebForm, WebToast, Blur, Loading, SpCircle, Clock,
  WebPagination, Counter, ContactUsForm, Show, Input,
  Accordion, AccordionItem
}
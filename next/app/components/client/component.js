'use client';
import capitalize from 'lodash/capitalize';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { withComponent } from "./hoc";
import Pagination from 'react-bootstrap/Pagination';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { Component, useState, useRef, useEffect, useContext } from 'react';
import { post } from "@marccent/util";
import { ToastContext } from '@/components/context';
import { cls } from '@/components/classes';

const WebAlert = (props) => {
  if (!props.active) return null
  return (
    <Alert variant={props.variant}><div dangerouslySetInnerHTML={{ __html: props.msg }} /></Alert>
  )
}

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
      <ToastContainer className="position-fixed bottom-0 end-0 p-3">
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

const WebModal = (props) => {
  const { title, children, show, setShow } = props;
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
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
  }
  
  const arr = React.Children.toArray(props.children);
  return (
    <Loading require={[form]}>
      <Form className={props.className.print()}>
        {arr.map((key, i) => <InputWC key={`form-${i}`} set={set} {...key.props} />)} 
        <Button onClick={submit} variant="primary mb-2">Submit</Button>
        <WebAlert variant="danger mb-2" active={alert !== ''} msg={alert} />
      </Form>
    </Loading>
  )
}

const Input = (props) => {
  const ref = useRef(null);
  const [ label ] = useState(capitalize(props.name.replace(/_/g, ' ')));
  let n = { ...props };
  delete n.set;
  useEffect(() => props.set(ref.current, props.name), []);
  return (
    <Form.Group className="input-group mb-2">
      <Form.Label className="col-4 input-group-text m-0" htmlFor={`#id-${props.name}`}>
        {label}
      </Form.Label>
      <Form.Control ref={ref} id={`id-${n.name}`} {...n} placeholder={label} />
    </Form.Group>
  )
}

const Blur = (props) => {
  const ref = useRef(null);
  const { style={}, className="", id } = props;
  const [ deviation, setDeviation ] = useState(null);
  const cls = ['blur-svg', ...className.split(' ')]
  useEffect(() => setDeviation(parseInt(5 + ref.current.parentNode.offsetWidth / 75)), []);
  
  return (
    <svg ref={ref} className={cls.join(' ')} style={style}>
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

const Loading = (props) => {
  const style = {
    width: '100%',
    height: '100%'
  }
  let ready = true;
  for (let i of props.require) {
    if (!i) ready = false;
  }

  return ready ? props.children :  (
    <SquareWC className="spinner-grow" style={style} role="status">
      <span className="visually-hidden">Loading...</span>
    </SquareWC>
  ) ;
}

const Square = (props) => {
  props.className.add('square');
  const [ height, setHeight ] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    window.addEventListener("resize", setHeight(ref.current.clientWidth));
  }, [height]);
  return (
    <div className="square-container">
      <div {...props} ref={ref} className={props.className.print()} style={{ height }}>
        {props.children}
      </div>
    </div>
  )
}

const SpCircle = props => {
  return (
    <SquareWC className="flex-center circle shadow-inset">
      <div className="inner circle flex-center linear-gradient shadow-inset">
        <div className="inner circle flex-center relative">{props.children}</div>
      </div>
    </SquareWC>
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
  props.className.add('clock', 'row');
  useEffect(() => {
    const interval = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={props.className.print()}>
      <span className="col row">
        <small>Hr</small><small>{time.format('h')}</small>
      </span>
      <span className="col row">
        <small>Min</small><small>{time.format('m')}</small> 
      </span>
      <span className="col row">
        <small>Sec</small><small>{time.format('s')}</small>
      </span>
      <h2 className="col flex-center">{time.format('A')}</h2>
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
    <Pagination className="my-1 p-2 border rounded">
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
        <div className="heading flex-center">
          <div  className="left"></div>
          <div  className="right"></div>
          <h2>{b.header}</h2>
        </div>
        <div style={headingBreak} className="break">
          <div className="grad"></div>
        </div>
        <div style={bodyBreak} className="break"></div>
        <div style={{backgroundColor: a.mode}} className="body flex-center">
          {b.children}
          <div className="flex-center controller">
            {b.controller ? <Button variant="primary" onClick={() => b.controller()}>{b.btnText}</Button> : ''}
            <Button variant="primary" onClick={() => this.props.close()}>Close</Button>
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
    console.log(res)
    setVariant(res.ok ? 'success' : 'danger');
    setAlert(res.ok ? res.response : res);
    setActive(true);
  }
  
  return (
    <>
      <WebFormWC className="col-12" callBack={onClick}>
        <input type="text" name="first_name" required />
        <input type="text" name="last_name" required />
        <input type="text" name="email" required />
        <input type="text" name="message" as="textarea" rows={4} required />
      </WebFormWC>
      <WebAlert variant={`${variant} mb-2`} active={active} msg={alert} />
    </>
  );
}

// const ContactUsFormWC = withComponent(ContactUsForm);
const ClockWC = withComponent(Clock);
const SquareWC = withComponent(Square);
const WebFormWC = withComponent(WebForm);
const InputWC = withComponent(Input);

export { 
  WebAlert, WebModal, WebForm, WebFormWC, WebToast, Blur, Loading, SquareWC, SpCircle, ClockWC,
  WebPagination, Counter, ContactUsForm
}
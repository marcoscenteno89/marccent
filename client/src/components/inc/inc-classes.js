import React, { Component, Fragment } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import ReactDOM from 'react-dom';
import { ThemeContext } from "../var"
import Modal from 'react-modal';
import { Button, FormatTime } from "./inc";
import "../../styles/inc/Incclasses.scss";

Modal.setAppElement('#app');

class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
      width: 0
    }
  }

  componentDidMount(e) {
    const runInterval = () => {
      this.setState({
        width: this.state.width + 2
      });
    }
    const speed = this.props.bar.speed ? this.props.bar.speed : 100;
    const percent = (this.props.bar.current / this.props.bar.total) * 100;
    let id = setInterval(() => this.state.width >= percent ? clearInterval(id) : runInterval(), speed);
  }

  render() {
    const bar = {...this.props.styles, ...{width: `${this.state.width}%`}};
    return (
      <div className="bar-container">
        <div className="bar" style={{width: '100%'}}>
          <div className="progress" style={bar}>{this.state.width}%</div>
        </div>
      </div>
    )
  }
}

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: '',
      min: '',
      sec: '',
      tod: ''
    }
  }

  componentDidMount(e) {
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock () {
    const i = new Date();
    const date = FormatTime(i);
    this.setState({
      hour: date.hour,
      min: date.min,
      sec: date.sec,
      tod: date.tod
    })
  }
 
  render() {
    const i = this.state;
    const e = this.props.data;
    const digit = {
      width: '20%',
      border: e.border
    }
    const last = {
      width:'32%',
      fontWeight: '700',
      fontSize: '2rem',
      border: e.border
    }
    const container = {
      color: e.text,
      minWidth: '180px'
    }
    return (
      <div className="flex-row clock" style={container}>
        <span className="flex-col-center digit" style={digit}>
          <small className="number">{i.hour}</small>
          <small className="title">Hour</small>
        </span>
        <span className="flex-col-center digit" style={digit}>
          <small className="number">{i.min}</small>
          <small className="title">Min</small>
        </span>
        <span className="flex-col-center digit" style={digit}>
          <small className="number">{i.sec}</small>
          <small className="title">Sec</small>
        </span>
        <span className="flex-center digit" style={last}>{i.tod}</span>
      </div>
    );   
  }
}

class PopUp extends Component {

  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      display: this.props.display
    }
  }

  UNSAFE_componentWillReceiveProps(e) {
    this.setState({
      display: e.display
    });
  }
  updateDisplay = () => {
    this.setState({
      display: this.state.display ? false : true
    });
  }

  render() {

    const a = this.context.theme;
    const b = this.props;
    console.log(this.state.display);
    const popup = {
      overlay: {
        backgroundColor: 'rgba(56,61,68,0.5)',
      },
      content: {
        color: a.rev,
        filter: `drop-shadow(0 0 10px rgba(0,0,0,0.8))`
      }
    }

    const headingBreak = {
      background: `
        radial-gradient(circle at bottom left, rgba(0,0,0,0) 2rem, ${a.hex.primary} 2rem) bottom left,
        radial-gradient(circle at bottom right, rgba(0,0,0,0) 2rem, ${a.hex.secondary} 2rem) bottom right`,
      backgroundSize: '2rem 100%',
      backgroundRepeat: 'no-repeat'
    }
    const bodyBreak = {
      background: `
        radial-gradient(circle at top left, rgba(0,0,0,0) 2rem, ${a.mode} 2rem) top left,
        radial-gradient(circle at top right, rgba(0,0,0,0) 2rem, ${a.mode} 2rem) top right`,
      backgroundSize: '50% 100%',
      backgroundRepeat: 'no-repeat'
    }
    const btn = {
      backgroundImage: a.grad
    }
      
    return (
      <Modal style={popup} className="modal" overlayClassName="overlay" isOpen={this.state.display}>
        <div style={{background: a.grad}} className="heading flex-center">
          <div style={{backgroundColor: a.hex.primary}} className="left"></div>
          <div style={{backgroundColor: a.hex.secondary}} className="right"></div>
          <h2>{b.header}</h2>
        </div>
        <div style={headingBreak} className="break">
          <div style={{background: a.grad}} className="grad"></div>
        </div>
        <div style={bodyBreak} className="break"></div>
        <div style={{backgroundColor: a.mode}} className="body flex-center">
          {b.children}
          <div className="flex-center controller">
            {b.controller ? <Button styles={btn} className="btn" onClick={() => b.controller()} text={b.btnText} /> : ''}
            <Button styles={btn} className="btn" onClick={() => this.updateDisplay()} text="Close" />
          </div>
        </div>
      </Modal>
    )
  }
}

class Accordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      on: false,
      display: 'none',
      symbol: '+'
    }
  }

  update() {
    if (this.state.on) {
      this.setState({
        on: false,
        display: 'none',
        symbol: '+'
      });
    } else {
      this.setState({
        on: true,
        display: 'flex',
        symbol: '-'
      });
    }
  }

  render() {
    const i = this.state;
    const e = this.props;
    return (
      <div className="accordion">
				<button className="heading flex-row" style={{ padding: 0 }} onClick={(e) => this.update()}>
					<span className="symbol flex-center">{i.symbol}</span>{e.children[0]}
        </button>
				<div className="body" style={{display: i.display}}>
          {e.children[1]}
        </div>
      </div>
    )
  }
}

class Square extends Component {

  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    }
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize () {
    this.setState({
      height: this.ref.offsetWidth
    })
  } 

  componentDidMount() {
    this.setState({
      height: this.ref.offsetWidth
    });

    window.addEventListener("resize", this.handleResize);
  }


  render() {
    const styles = { 
      ...this.props.styles,
      ...{ height: this.state.height }
    }
    let classes = `square`;
    if (this.props.className) classes += ` ${this.props.className}`;
    return (
      <div ref={node => {if (node !== null) this.ref = node}} className={classes} style={styles}>
        {this.props.children}
      </div>
    )
  }
}

class CodeSnipet extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.text,
      copied: false,
      cta: 'Copy to clipboard'
    }
  }

  render() {
    const e = this.props;
    const a = this.context.theme;
    const btn = {
      backgroundImage: a.grad,
      borderRadius: 0
    }
    return (
      <div className="code-snippet">
        <CopyToClipboard text={this.state.value} onCopy={() => this.setState({copied: true, cta: 'Copied!'})}>
          <div className="btn-con flex-center" style={btn}>
            <button className="btn">{this.state.cta}</button>
            <i className="fa-solid fa-copy"></i>
          </div>
        </CopyToClipboard>
        <SyntaxHighlighter language={e.language} style={a.is_dark ? prism : atomDark}>
          {this.state.value}
        </SyntaxHighlighter>
      </div>
    )
  }
}

class Counter extends Component {

  static contextType = ThemeContext;
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
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const i = this.state;
    return  (
      <div className="timer">
        <i className="fas fa-stopwatch" style={{marginRight: '0.5rem'}}></i> 
        <small>
          {this.addZero(i.hour)}:{this.addZero(i.minute)}:{this.addZero(i.second)}:{i.tos < 10 ? `${i.tos}0` : i.tos}
        </small>
      </div>
    )        
  }
}

export { 
    StatusBar, PopUp, Clock, Accordion, Square, CodeSnipet, Counter
}
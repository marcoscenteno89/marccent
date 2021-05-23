import React, { Component } from "react";
import { ThemeContext } from "../var"
import Modal from 'react-modal';
import { Button } from "./inc";
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
        width: this.state.width + 1
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
          <div className="progress" style={bar}>{`${this.state.width}%`}</div>
        </div>
      </div>
    )
      
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
    const popup = {
      overlay: {
        backgroundColor: 'rgba(56,61,68,0.2)',
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

export { 
    StatusBar, PopUp
}
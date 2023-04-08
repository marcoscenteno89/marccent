import React, { Component,Fragment } from "react";
import { ThemeContext } from "../var"
import Carousel from "react-elastic-carousel";
import { PopUp } from "../inc/inc-classes";
import { FooterText, GetMode } from "./inc";
import '../../styles/inc/Footer.scss';

class Footer extends Component {

  static contextType = ThemeContext;

  state = {
    showForm: false,
    primary: this.context.theme.hex.primary,
    secondary: this.context.theme.hex.secondary,
    tempPrimary: this.context.theme.hex.primary,
    tempSecondary: this.context.theme.hex.secondary,
    status: ''
  }

  showForm = () => {
    this.setState({
      showForm: this.state.showForm ? false : true
    });
  }
  addTheme = () => {
    const i = this.state;
    if (i.tempPrimary === i.primary && i.tempSecondary === i.secondary) {
      this.setState({status: `You are tring to submit the same colors as current theme.`});
      return;
    }
    this.setState({ showForm: false });
    this.context.addTheme({
      primary: this.state.primary,
      secondary: this.state.secondary
    });
  }
  primary = e => this.setState({ primary: e.target.value});
  secondary = e => this.setState({ secondary: e.target.value});

  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const breakPoints = [
      {width: 368, itemsToShow: 2},
      {width: 468, itemsToShow: 3},
      {width: 568, itemsToShow: 5},
      {width: 668, itemsToShow: 6},
      {width: 768, itemsToShow: 7},
    ]

    let background = `main-footer flex-center${a.glass ? ' glass' : ''}`;
    
    let add = {
      fontSize: '2rem',
      color: a.hex.secondary,
      filter: `drop-shadow(0 0 5px ${a.hex.secondary})`
    }
    let btn = {
      backgroundColor: a.hex.primary,
      boxShadow: `0 0 7px ${a.hex.secondary}, inset 0 0 7px ${a.hex.secondary}`
    }
    return  (
      <footer className={background} style={{backgroundColor: a.mode}}>
        <div className="container">
          <FooterNav />
          <div className="m-10 flex-center">
              <LightDark />
              <Glass />
          </div>
          <div className="flex-row">
            <Carousel breakPoints={breakPoints}>
              <button 
                aria-label="Add Theme" 
                key={0} 
                style={btn} 
                className="single flex-center" 
                onClick={() => this.showForm()}>
                <div className="inner flex-center">
                  <i style={add} className="fas fa-plus"></i>
                </div>
              </button>
              {this.context.theme.list.map(single => (
                <Choices key={single.id} data={single} />
              ))}
            </Carousel>
          </div>
          <FooterText style={{ color : a.rev }} />
        </div>
        <PopUp header="Add Theme" controller={this.addTheme} display={this.state.showForm} btnText="Submit">
            <form>
              <h4>Select Primary Color</h4>
              <input 
                type="color" 
                value={this.state.primary} 
                style={{backgroundColor: a.rev}} 
                onChange={this.primary} 
              />
              <h4>Select Secondary Color</h4>
              <input 
                type="color"
                value={this.state.secondary} 
                style={{backgroundColor: a.rev}} 
                onChange={this.secondary} 
              />
              <div><i>Select same color for primary and secondary colors<br />for single colored theme.</i></div>
              <br />
              <h5 style={{color: 'red'}}>{this.state.status}</h5>
            </form>
          </PopUp>
      </footer>
    )        
  }
}

class Choices extends Component {
    
  static contextType = ThemeContext;

  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const b = this.context;
    const c = this.props.data;
    const mode = GetMode(a, 1);
    
    const btn = {
      backgroundImage: `linear-gradient(to right, ${c.primary}, ${c.secondary})`,
      boxShadow: `0px 0px 10px ${c.primary}, 0px 0px 10px ${c.secondary}`
    }
    let inner = {
      backgroundColor: mode,
      boxShadow: `inset 0 0 5px ${c.primary}, inset 0 0 5px ${c.secondary}`
    }

    const shadow = {
      filter: `drop-shadow(-25px 0 9px ${c.primary}) drop-shadow(25px 0 9px ${c.secondary}) blur(2px)`,
      background: a.mode
    }
    const label = `theme-${c.id}`
    return (
      <Fragment>
        <i 
          style={{ color: a.rev }} 
          onClick={() => b.removeTheme(c.id)} 
          className="close fas fa-times-circle"
        ></i>
        <button 
          key={c.id}
          aria-label={label}
          className="single flex-center" 
          style={btn} onClick={() => b.updateTheme(c.id)}>
          <div className="inner flex-center" style={inner}>
            <div className="shadow" style={shadow}></div>
          </div>
        </button>
      </Fragment>
    )
  }
}

class LightDark extends Component {

  updateMode(i) {
    i.is_dark = i.is_dark === true ? false : true;
    this.context.isDark(i.is_dark);
  }

  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const mode = GetMode(a, 1);
    const slider = {
      backgroundImage: a.grad,
      boxShadow: `0 0 10px ${a.hex.primary}, 0 0 10px ${a.hex.secondary}`
    }
    
    return (
      <label className='switch'>
        <div className="name">MODE</div>
        <input type='checkbox' onChange={() => this.updateMode(a)} defaultChecked={a.is_dark} />
        <div className='slider' style={slider}>
          <div className="pointer flex-center" style={{ backgroundColor: mode }}>
            <i className="fas fa-sun" style={{ color: a.hex.primary }}></i>
            <i className="fas fa-moon" style={{ color: a.hex.secondary}}></i>
          </div>
        </div>
      </label>
    )        
  }
}

class Glass extends Component {

  updateMode(i) {
    i.glass = i.glass === true ? false : true;
    this.context.isGlass(i.glass);
  }

  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const mode = GetMode(a, 1);
    const slider = {
      backgroundImage: a.grad,
      boxShadow: `0 0 10px ${a.hex.primary}, 0 0 10px ${a.hex.secondary}`
    }
    
    return (
      <label className='switch'>
        <div className="name">GLASS</div>
        <input type='checkbox' onChange={() => this.updateMode(a)} defaultChecked={a.glass} />
        <div className='slider' style={slider}>
          <div className="pointer flex-center" style={{ backgroundColor: mode }}>
            <i className="fas fa-toggle-off" style={{ color: a.hex.secondary }}></i>
            <i className="fas fa-toggle-on" style={{ color: a.hex.primary}}></i>
          </div>
        </div>
      </label>
    )        
  }
}

class FooterNav extends Component {

  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    let i = {
      backgroundImage: a.grad
    }
    let e = {
      backgroundColor: GetMode(a, 1)
    }
    let menu = {
      animation: `rotate 3s linear infinite`,
      backgroundImage: a.grad
    }
    return (
      <ul className="flex-center footer-nav" style={{color: a.rev}}>
        <li style={e}>
          <a href="https://www.facebook.com/marcos.centeno.75" rel="noopener noreferrer" target="_blank">
            <i style={i} className="fab fa-facebook"></i>
          </a>
        </li>
        <li style={e}>
          <a href="https://github.com/marcoscenteno89" rel="noopener noreferrer" target="_blank">
            <i style={i} className="fab fa-github"></i>
          </a>
        </li>
        <li style={e}>
          <a href="mailto:marcoscenteno89@gmail.com" rel="noopener noreferrer" target="_blank">
            <i style={i} className="fas fa-envelope"></i>
          </a>
        </li>
        <li style={e} className="menu flex-center"><i style={menu} className="fab fa-ethereum"></i></li>
        <li style={e}>
          <a href="https://www.linkedin.com/in/marcos-centeno-0b1a7b65/" rel="noopener noreferrer" target="_blank">
            <i style={i} className="fab fa-linkedin"></i>
          </a>
        </li>
        <li style={e}>
          <a href="https://stackoverflow.com/users/8151467/marcos-centeno" rel="noopener noreferrer" target="_blank">
            <i style={i} className="fab fa-stack-overflow"></i>
          </a>
        </li>
        <li style={e}>
          <a href="https://www.pinterest.com/marcoscenteno75" rel="noopener noreferrer" target="_blank">
            <i style={i} className="fab fa-pinterest-square"></i>
          </a>
        </li>
      </ul>
    )
  }
}

export default Footer;
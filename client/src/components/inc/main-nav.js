import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { Link } from 'react-router-dom';
import { GetMode } from "../inc/inc";
import { Clock } from "../inc/inc-classes";

class Nav extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      path: ''
    }
  }

  toggleMenu = () => {
    this.setState({
      menuOpen: this.state.menuOpen ? false : true
    });
  }

  render() {
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;

    const toggle = {
      color: a.rev,
      borderColor: a.rev
    }
    const link = { 
      color: a.rev, 
      borderColor: a.rev 
    }
    
    const background = `navbar navbar-expand-lg sticky-top ${a.glass ? ' glass' : ''}`;
    const clockstyles = {
      border: `1px solid ${a.rev}`,
      text: a.rev,
      bg: GetMode(a, '0.5')
    }
    
    return  (
      <nav className={background} style={{backgroundColor: a.mode}}>
        <div className="container">
          <a className="navbar-brand" style={link} href="/">
            <i className="fas fa-home"></i> Marccent
          </a>
          <button 
            style={{backgroundColor: a.rev}}
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link style={link} className="nav-link" to="/portfolio">
                  <i className="fas fa-folder-open"></i> Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link style={link} className="nav-link" to="/apps/minesweeper">
                  <i className="fab fa-windows"></i> Apps
                </Link>
              </li>
              <li className="nav-item">
                <Link style={link} className="nav-link" to="/animations">
                  <i className="fa-solid fa-faucet-drip"></i> Animations
                </Link>
              </li>
              <li className="nav-item">
                <Link style={link} className="nav-link"  to="/about">
                  <i className="fas fa-address-card"></i> About
                </Link>
              </li>
              <li className="nav-item">
                <Link style={link} className="nav-link" to="/contact">
                  <i className="fas fa-comments"></i> Contact
                </Link>
              </li>
            </ul>
          </div>
          <Clock data={clockstyles} />
        </div>
      </nav>
    )        
  }
}

export default Nav;
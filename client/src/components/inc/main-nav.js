import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { Link } from 'react-router-dom';
import '../../styles/inc/Nav.scss';

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
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const link = {
      background: `linear-gradient(to bottom, ${a.hex.primary}, ${a.hex.secondary})`
    }

    const toggle = {
      background: `linear-gradient(to bottom, ${a.hex.primary}, ${a.hex.secondary})`,
      border: `1px solid ${a.hex.secondary}`
    }
    
    const mobile = {
      backgroundColor: a.mode,
      display: this.state.menuOpen ? 'block' : 'none'
    }
    
    let background = `main-nav flex-center${a.glass ? ' glass' : ''}`;
      
    return  (
      <nav className={background} style={{backgroundColor: a.mode}}>
        <div className="container flex-row">
          <ul className="navigation" style={link}>
            <li>
              <Link to="/"><i className="fas fa-home"></i> Home</Link>
            </li>
            <li style={{borderColor: a.hex.secondary}}>
              <Link to="/portfolio"><i className="fas fa-folder-open"></i> Portfolio</Link>
            </li>
            <li style={{borderColor: a.hex.secondary}}>
              <Link to="/apps/minesweeper"><i className="fab fa-windows"></i> Apps</Link>
            </li>
            <li style={{borderColor: a.hex.secondary}}>
              <Link to="/about"><i className="fas fa-address-card"></i> About</Link>
            </li>
            <li style={{borderColor: a.hex.secondary}}>
              <Link to="/contact"><i className="fas fa-comments"></i> Contact</Link>
            </li>
          </ul>
          <div className="mobile-navigation" style={mobile}>
            <ul style={link}>
              <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
              <li><Link to="/portfolio"><i className="fas fa-folder-open"></i> Portfolio</Link></li>
              <li><Link to="/apps/minesweeper"><i className="fab fa-windows"></i> Apps</Link></li>
              <li><Link to="/about"><i className="fas fa-address-card"></i> About</Link></li>
              <li><Link to="/contact"><i className="fas fa-comments"></i> Contact</Link></li>
            </ul>
          </div>
          <i className="toggle fas fa-bars" style={toggle} onClick={() => this.toggleMenu()}></i>
        </div>
      </nav>
    )        
  }
}

export default Nav;
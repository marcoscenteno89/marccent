import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { Link } from 'react-router-dom';
import { GetMode } from "../inc/inc";
import { Clock } from "../inc/inc-classes";
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

    const toggle = {
      color: a.rev,
      borderColor: a.rev
    }
    
    const mobile = {
      backgroundColor: a.mode,
      display: this.state.menuOpen ? 'block' : 'none'
    }
    
    const background = `container-fluid main-nav ${a.glass ? ' glass' : ''}`;
    const clockstyles = {
      border: `1px solid ${a.rev}`,
      text: a.rev,
      bg: GetMode(a, '0.5')
    }
    return  (
      <nav className={background} style={{backgroundColor: a.mode}}>
        <div className="container flex-row">
          <ul className="navigation">
            <li>
              <Link  style={{ color: a.rev, borderColor: a.rev }} to="/"><i className="fas fa-home"></i> Home</Link>
            </li>
            <li>
              <Link style={{ color: a.rev, borderColor: a.rev }} to="/portfolio"><i className="fas fa-folder-open"></i> Portfolio</Link>
            </li>
            <li>
              <Link style={{ color: a.rev, borderColor: a.rev }}to="/apps/minesweeper"><i className="fab fa-windows"></i> Apps</Link>
            </li>
            <li>
              <Link style={{ color: a.rev, borderColor: a.rev }} to="/animations"><i className="fa-solid fa-faucet-drip"></i> Animations</Link>
            </li>
            <li>
              <Link style={{ color: a.rev, borderColor: a.rev }} to="/about"><i className="fas fa-address-card"></i> About</Link>
            </li>
            <li>
              <Link style={{ color: a.rev, borderColor: a.rev }} to="/contact"><i className="fas fa-comments"></i> Contact</Link>
            </li>
          </ul>
          <div className="mobile-navigation" style={mobile}>
            <ul>
              <li><Link style={{ color: a.rev }} to="/"><i className="fas fa-home"></i> Home</Link></li>
              <li><Link style={{ color: a.rev }} to="/portfolio"><i className="fas fa-folder-open"></i> Portfolio</Link></li>
              <li><Link style={{ color: a.rev }} to="/apps/minesweeper"><i className="fab fa-windows"></i> Apps</Link></li>
              <li><Link style={{ color: a.rev }} to="/animations"><i className="fa-solid fa-faucet-drip"></i> Animations</Link></li>
              <li><Link style={{ color: a.rev }} to="/about"><i className="fas fa-address-card"></i> About</Link></li>
              <li><Link style={{ color: a.rev }} to="/contact"><i className="fas fa-comments"></i> Contact</Link></li>
            </ul>
          </div>
          <i className="toggle fas fa-bars" style={toggle} onClick={() => this.toggleMenu()}></i>
          <Clock data={clockstyles} />
        </div>
      </nav>
    )        
  }
}

export default Nav;
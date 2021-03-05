import React, { Component } from "react";
import { Link } from 'react-router-dom';
// import { LinGrad } from "./inc";
import '../styles/Nav.scss';

class Nav extends Component {

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
        })
    }

    render() {
        if (!this.props.data) return (<h1>Loading...</h1>);
        const a = this.props.data;
        const nav = {
            backgroundColor: a.mode
        }
        const link = {
            background: `linear-gradient(to bottom, ${a.primary}, ${a.secondary})`
        }

        const toggle = {
            background: `linear-gradient(to bottom, ${a.primary}, ${a.secondary})`,
            border: `1px solid ${a.secondary}`
        }
        const mobile = {
            background: a.mode,
            display: this.state.menuOpen ? 'block' : 'none'
        }
        
        return  (
            <nav className="main-nav flex-center" style={nav}>
                <div className="container flex-row" style={{justifyContent: 'space-between'}}>
                    <Link style={link} className="btn" to="/"> <i className="fab fa-edge rotate"></i> Marccent</Link>
                    <ul className="navigation" style={link}>
                        <li>
                            <Link to="/"><i className="fas fa-home"></i> Home</Link>
                        </li>
                        <li style={{borderColor: a.secondary}}>
                            <Link to="/portfolio"><i className="fas fa-folder-open"></i> Portfolio</Link>
                        </li>
                        <li style={{borderColor: a.secondary}}>
                            <Link to="/apps/minesweeper"><i className="fab fa-windows"></i> Apps</Link>
                        </li>
                        <li style={{borderColor: a.secondary}}>
                            <Link to="/about"><i className="fas fa-address-card"></i> About</Link>
                        </li>
                        <li style={{borderColor: a.secondary}}>
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
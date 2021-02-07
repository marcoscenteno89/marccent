import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { LinGrad } from "./inc";
import '../styles/Nav.scss';

class Nav extends Component {

    render() {
        if (!this.props.data) return (<h1>Loading...</h1>);
        const a = this.props.data;
        const nav = {
            backgroundColor: a.mode
        }
        const link = {
            background: LinGrad(a.primary, a.secondary),
        }
        
        return  (
            <nav className="main-nav flex-center" style={nav}>
                <div className="container flex-row" style={{justifyContent: 'flex-end'}}>
                    {/* <Link style={btn} className="btn" to="/"> <i className="fab fa-edge rotate"></i> Marccent</Link> */}
                    <ul>
                        <li>
                            <Link to="/" style={link}>
                                <i style={link} className="fas fa-home"></i> Home
                            </Link>
                        </li>
                        <li style={{borderColor: a.secondary}}>
                            <Link to="/portfolio" style={link}>
                                <i style={link} className="fas fa-folder-open"></i> Portfolio
                            </Link>
                        </li>
                        <li style={{borderColor: a.secondary}}>
                            <Link to="/apps" style={link}>
                                <i style={link} className="fab fa-windows"></i> Apps
                            </Link>
                        </li>
                        <li style={{borderColor: a.secondary}}>
                            <Link to="/about" style={link}>
                                <i style={link} className="fas fa-address-card"></i> About
                            </Link>
                        </li>
                        <li style={{borderColor: a.secondary}}>
                            <Link to="/contact" style={link}>
                                <i style={link} className="fas fa-comments"> </i> Contact
                            </Link>
                        </li>
                    </ul> 
                </div>
            </nav>
        )        
    }
}

export default Nav;
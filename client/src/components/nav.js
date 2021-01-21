import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { LinGrad } from "./inc";
import '.././styles/Nav.scss';

class Nav extends Component {

    render() {
        if (!this.props.data) return (<h1>Error</h1>);
        const a = this.props.data;
        const btn = {
            backgroundImage: LinGrad(a.primary, a.secondary),
            color: '#FFFFFF'
        }
        const nav = {
            color: a.primary,
            backgroundColor: a.mode
        }
        // const ul = {
        //     height: '50px'
        // }
        const link = {color: a.primary}
        
        return  (
            <nav className="main-nav flex-center" style={nav}>
                <div className="container flex-row" style={{justifyContent: 'flex-end'}}>
                    {/* <Link style={btn} className="btn" to="/"> <i className="fab fa-edge rotate"></i> Marccent</Link> */}
                    <ul>
                        <li className="active"><Link to="/" style={link}>Home</Link></li>
                        <li><Link to="/portfolio" style={link}>Portfolio</Link></li>
                        <li><Link to="/apps" style={link}>Apps</Link></li>
                        <li><Link to="/about" style={link}>About</Link></li>
                        <li><Link to="/contact" style={link}>Contact</Link></li>
                    </ul> 
                </div>
            </nav>
        )        
    }
}

export default Nav;
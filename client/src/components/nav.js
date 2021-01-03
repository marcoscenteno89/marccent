import React, { Component } from "react";
import { BrowserRouter, Link } from 'react-router-dom';
import { Button, LinGrad } from "./inc";
import '.././styles/Nav.scss';

class Nav extends Component {

    render() {

        const btn = {}
        const nav = {}
        const link = {}
        if (this.props.data) {
            const a = this.props.data;
            nav.color = a.primary;
            nav.backgroundColor = this.props.data.mode;
            btn.backgroundImage = LinGrad(a.primary, a.secondary);
            btn.color = '#FFFFFF';
            link.color = a.primary;
        } 
        
        return  (
            <nav className="main-nav flex-center" style={nav}>
                <div className="container flex-row">
                    <BrowserRouter><Link to="/">
                        <Button className="btn" styles={btn} text="Marccent" />
                    </Link></BrowserRouter>
                    <ul>
                        <BrowserRouter>
                            <li><Link to="/portfolio" style={link}>Portfolio</Link></li>
                            <li><Link to="/apps" style={link}>Apps</Link></li>
                            <li><Link to="/about" style={link}>About</Link></li>
                            <li><Link to="/contact" style={link}>Contact</Link></li>
                        </BrowserRouter>
                    </ul> 
                </div>
            </nav>
        )        
    }
}

export default Nav;
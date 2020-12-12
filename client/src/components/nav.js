import React, { Component } from "react";
import { Button } from "./inc";
import '.././styles/Nav.scss';

class Nav extends Component {

    render() {

        const styles = {}
        if (this.props.data) {
            styles.color = this.props.data.primary;
            styles.backgroundColor = this.props.data.mode;
        } 
        
        return  (
            <nav className="main-nav flex-center" style={styles}>
                <div className="container flex-row">
                    <button>Logo</button>
                    <ul>
                        <li>Portfolio</li>
                        <li>About</li>
                        <li>Contact</li>
                        <li>Apps</li>
                    </ul> 
                </div>
            </nav>
        )        
    }
}

export default Nav;
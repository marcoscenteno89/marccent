import React, { Component } from "react";
import './../../styles/Contact.scss';
import Maps from "../map";
import { RevColor } from "../inc";

class Contact extends Component {
       
    render() {
        const a = this.props.data;
        const rev = RevColor(a.mode);
        const mpSquare = {
            width: '40%',
            height: '500px',
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            marginRight: '-25px'
        }
        return  (
            <div className="contact flex-center" style={{filter: `drop-shadow(0 0 5px ${rev})`}}>
                <div className="map-size" style={mpSquare}><Maps data={a} /></div>
                <div className="contact-info" style={{backgroundColor: a.mode}}>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        )        
    }
}

export default Contact;
import React, { Component, Fragment } from "react";
import './../../styles/Contact.scss';
import Maps from "../map";
import { RevColor, FooterText, Button, LinGrad, Title } from "../inc";

class Contact extends Component {


    onClick() {
        console.log('button clicker');
    }
    render() {
        const a = this.props.data;
        const rev = RevColor(a.mode);
        const mpSquare = {
            width: '100%',
            height: '500px',
            position: 'relative',
        }
        const text = {
            background: LinGrad(a.primary, a.secondary),
        }
        const bg = {
            background: LinGrad(a.primary, a.secondary),
            color: a.mode
        }
        const header = {
            background: `linear-gradient(to bottom, ${a.mode} 30%, rgba(0,0,0,0))`,
            color: rev
        }
        const footer = {
            background: `linear-gradient(to top, ${a.mode} 30%, rgba(0,0,0,0))`,
            color: rev
        }
        const cont = {backgroundImage: `linear-gradient(to bottom right, ${a.mode} 20%, rgba(0,0,0,0))`}
        return  (<div className="page-contact">
            <Title style={header} text="Contact" />
            <div className="contact flex-center">
                <div className="map-size" style={mpSquare}><Maps data={a} /></div>
                <div className="contact-info flex-col" style={cont}>
                    <form className="flex-col">
                        <h2 className="text" style={text}>Get in Touch</h2>
                        <input type="text" style={bg} id="name" name="name" value="Name" />
                        <input type="text" style={bg} id="email" name="email" value="Email" />
                        <textarea style={bg}>Comments</textarea>
                        <Button className="btn" styles={bg} onClick={() => this.onClick()} text="Submit" />
                    </form>
                </div>
            </div>
            <FooterText style={footer} />
            </div>)        
    }
}

export default Contact;
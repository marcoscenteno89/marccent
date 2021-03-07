import React, { Component } from "react";
import '../../styles/Contact.scss';
import Maps from "../map";
import { RevColor, FooterText, LinGrad, Title } from "../inc";

const server = `http://localhost:1337/`;

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'Full Name',
            email: 'Email',
            message: 'Message'
        }
    }

    onClick = async e => {
        e.preventDefault();
        const res = await fetch(`${server}messages`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'}),
            body: JSON.stringify(this.state)
        });
        let response = await res.json();
        console.log(response);
    }
    nameChange = e => this.setState({ name: e.target.value});
    emailChange = e => this.setState({ email: e.target.value});
    messageChange = e => this.setState({ message: e.target.value});

    render() {
        const a = this.props.data;
        const e = this.state;
        const rev = RevColor(a.mode);
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
        const mapData = {
            loc: {
                lat: 43.5, 
                lng: -112.05
            },
            zoom: 11
        }
        const cont = {backgroundImage: `linear-gradient(to bottom right, ${a.mode} 20%, rgba(0,0,0,0))`}
        return  (
            <section className="page-contact flex-center">
                <div className="container">
                    <Title style={header} text="Contact" />
                    <div className="contact flex-center">
                        <div className="map-size"><Maps mapData={mapData} data={a} /></div>
                        <div className="contact-info flex-col" style={cont}>
                            <form className="flex-col">
                                <h2 className="text" style={text}>Get in Touch</h2>
                                <input type="text" style={bg} onChange={this.nameChange} value={e.name} />
                                <input type="text" style={bg} value={e.email} onChange={this.emailChange} />
                                <textarea style={bg} value={e.message} onChange={this.messageChange} rows="5"></textarea>
                                <button className="btn" style={bg} onClick={(e) => this.onClick(e)}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )        
    }
}

export default Contact;
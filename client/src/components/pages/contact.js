import React, { Component } from "react";
import '../../styles/pages/Contact.scss';
import Maps from "../map";
import Modal from 'react-modal';
import { RevColor, FooterText, LinGrad, Title } from "../inc/inc";

const server = `http://localhost:1337/`;
Modal.setAppElement('#app');

class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'Full Name',
            email: 'Email',
            message: 'Message',
            modal: false
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
        if (response.id) {
            this.setState({ modal: true });
        }
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
        const popup = {
            overlay: {
              backgroundColor: 'rgba(56,61,68,0.2)',
            },
            content: {
                color: RevColor(a.mode),
                filter: `drop-shadow(0 0 10px rgba(0,0,0,0.8))`
            }
        }
        const popupBody = {
            backgroundColor: a.mode
        }
        const headingBreak = {
            background: `
                radial-gradient(circle at bottom left, rgba(0,0,0,0) 2rem, ${a.primary} 2rem) bottom left,
                radial-gradient(circle at bottom right, rgba(0,0,0,0) 2rem, ${a.secondary} 2rem) bottom right`,
            backgroundSize: '2rem 100%',
            backgroundRepeat: 'no-repeat'
        }
        const bodyBreak = {
            background: `
                radial-gradient(circle at top left, rgba(0,0,0,0) 2rem, ${a.mode} 2rem) top left,
                radial-gradient(circle at top right, rgba(0,0,0,0) 2rem, ${a.mode} 2rem) top right`,
            backgroundSize: '50% 100%',
            backgroundRepeat: 'no-repeat'
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
                    <Modal style={popup} className="modal" overlayClassName="overlay" isOpen={this.state.modal}>
                        <div style={text} className="heading flex-center">
                            <div style={{backgroundColor: a.primary}} className="left"></div>
                            <div style={{backgroundColor: a.secondary}} className="right"></div>
                            <h2>Status</h2>
                        </div>
                        <div style={headingBreak} className="break">
                            <div style={text} className="grad"></div>
                        </div>
                        <div style={bodyBreak} className="break"></div>
                        <div style={popupBody} className="body flex-center">
                            <div className="help">
                                <p>Message has been received.</p>
                            </div>
                            <div className="flex-center controller">
                                <button style={text} className="btn" onClick={() => this.setState({modal: false})}>Close</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </section>
        )        
    }
}

export default Contact;
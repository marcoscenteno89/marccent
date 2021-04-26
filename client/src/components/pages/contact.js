import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var"
import '../../styles/pages/Contact.scss';
import Maps from "../map";
import Modal from 'react-modal';
import { GetMode, Title } from "../inc/inc";

const server = `${process.env.REACT_APP_STRAPIURL}`;
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
        const res = await fetch(`${server}messages/`, {
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

    static contextType = ThemeContext;
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const e = this.state;
        const bg = {
            background: a.grad,
            color: a.mode
        }
        const header = {
            background: `linear-gradient(to top, ${GetMode(a, 1)}, ${GetMode(a, 0)})`,
            color: a.rev
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
                color: a.rev,
                filter: `drop-shadow(0 0 10px rgba(0,0,0,0.8))`
            }
        }

        const headingBreak = {
            background: `
                radial-gradient(circle at bottom left, rgba(0,0,0,0) 2rem, ${a.hex.primary} 2rem) bottom left,
                radial-gradient(circle at bottom right, rgba(0,0,0,0) 2rem, ${a.hex.secondary} 2rem) bottom right`,
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
        let background = `container${a.glass ? ' glass' : ''}`;
        return  (
            <section className="page-contact flex-center">
                <div className={background} style={{backgroundColor: a.mode}}>
                    <Title style={header} text="Contact" />
                    <div className="contact flex-center">
                        <div className="map-size">
                            <Maps mapData={mapData} />
                        </div>
                        <div className="contact-info flex-col" style={cont}>
                            <form className="flex-col">
                                <h2 className="text" style={{background: a.grad}}>Get in Touch</h2>
                                <input type="text" style={bg} onChange={this.nameChange} value={e.name} />
                                <input type="text" style={bg} value={e.email} onChange={this.emailChange} />
                                <textarea style={bg} value={e.message} onChange={this.messageChange} rows="5"></textarea>
                                <button className="btn" style={bg} onClick={(e) => this.onClick(e)}>Submit</button>
                            </form>
                        </div>
                    </div>
                    <Modal style={popup} className="modal" overlayClassName="overlay" isOpen={this.state.modal}>
                        <div style={{background: a.grad}} className="heading flex-center">
                            <div style={{backgroundColor: a.hex.primary}} className="left"></div>
                            <div style={{backgroundColor: a.hex.secondary}} className="right"></div>
                            <h2>Status</h2>
                        </div>
                        <div style={headingBreak} className="break">
                            <div style={{background: a.grad}} className="grad"></div>
                        </div>
                        <div style={bodyBreak} className="break"></div>
                        <div style={{ backgroundColor: a.mode }} className="body flex-center">
                            <div className="help">
                                <p>Message has been received.</p>
                            </div>
                            <div className="flex-center controller">
                                <button style={{background: a.grad}} className="btn" onClick={() => this.setState({modal: false})}>Close</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </section>
        )        
    }
}

export default Contact;
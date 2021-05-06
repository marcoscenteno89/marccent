import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var"
import { PopUp } from "../inc/inc-classes";
import '../../styles/pages/Contact.scss';
import Maps from "../map";
import Modal from 'react-modal';
import ValidForm from 'react-valid-form-component';
import { GetMode, Title } from "../inc/inc";

const server = `${process.env.REACT_APP_STRAPIURL}`;
Modal.setAppElement('#app');

class Contact extends Component {

    state = {
        name: '',
        email: '',
        message: '',
        modal: false
    }

    onClick = async () => {
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
        const mode = GetMode(a, 1);
        const bg = {
            background: a.grad,
            color: a.hex.light
        }
        const header = {
            background: `linear-gradient(to top, ${mode}, ${GetMode(a, 0)})`,
            color: a.rev
        }
        const mapData = {
            loc: {
                lat: 43.5, 
                lng: -112.05
            },
            zoom: 11
        }
        const cont = {backgroundImage: `linear-gradient(to bottom right, ${mode}, ${GetMode(a, 0.4)})`}
        let background = `container${a.glass ? ' glass' : ''}`;
        return  (
            <section className="page-contact flex-center">
                <div className={background} style={{backgroundColor: a.mode}}>
                    <Title style={header} text="Contact" />
                    <div className="contact flex-center">
                        <div className="map-size">
                            <Maps mapData={mapData} />
                        </div>
                        <ValidForm nosubmit onSubmit={(e) => this.onClick(e)} className="flex-col contact-info" style={cont}>
                            <input 
                                name="full_name"
                                type="text" 
                                required
                                placeholder="Full Name" 
                                style={bg} 
                                onChange={this.nameChange} 
                                value={e.name}
                            />
                            <input 
                                name="email"
                                type="email" 
                                required
                                placeholder="Email" 
                                style={bg} 
                                value={e.email} 
                                onChange={this.emailChange} 
                            />
                            <textarea 
                                required
                                name="message"
                                style={bg} 
                                placeholder="Message" 
                                value={e.message} 
                                onChange={this.messageChange} 
                                rows="5"
                            ></textarea>
                            <button className="btn" style={bg} type="submit">Send Form</button>
                        </ValidForm>
                    </div>
                    <PopUp header="Status" display={this.state.modal}>
                        <p>Message has been received.</p>
                    </PopUp>
                </div>
            </section>
        )        
    }
}

export default Contact;
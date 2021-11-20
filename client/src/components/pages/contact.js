import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var"
import { PopUp } from "../inc/inc-classes";
import '../../styles/pages/Contact.scss';
import Maps from "../map";
import Modal from 'react-modal';
import ValidForm from 'react-valid-form-component';
import { GetMode, Title, WaveSvg } from "../inc/inc";

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
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const e = this.state;
    const mode = GetMode(a, 1);
    const bg = {
      border: `1px solid ${a.hex.primary}`
    }
    const btn = {
      background: a.grad,
      color: a.hex.light
    }
    const mapData = {
      loc: {
        lat: 43.5, 
        lng: -112.05
      },
      zoom: 11
    }
    let background = `page-contact${a.glass ? ' glass' : ''}`;
    return  (
      <section className={background}>
        <WaveSvg dir="top" styles={{ fill: a.mode}} />
        <div className="contact flex-center">
          <div className="map-size" style={{height: '600px'}}>
            <Maps mapData={mapData} />
          </div>
          <div className="form-area flex-row" style={{ backgroundColor: mode }}>
            <ValidForm 
              nosubmit 
              onSubmit={(e) => this.onClick(e)} 
              className="flex-col contact-info" 
            >
              <h3 style={{color: a.rev}}>GET IN TOUCH</h3>
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
              <button className="btn" style={btn} type="submit">Send Form</button>
            </ValidForm>
            <div className="">

            </div>
          </div>
          
        </div>
        <WaveSvg dir="bottom" styles={{ fill: a.mode}} />
        <PopUp header="Status" display={this.state.modal}>
          <p>Message has been received.</p>
        </PopUp>
      </section>
    )        
  }
}

export default Contact;
import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var"
import { PopUp } from "../inc/inc-classes";
import '../../styles/pages/Contact.scss';
import Map from "../map";
import Modal from 'react-modal';
import ValidForm from 'react-valid-form-component';
import { GetMode, WaveSvg } from "../inc/inc";

// const server = `${process.env.REACT_APP_SERVERURL}`;

Modal.setAppElement('#app');

class Contact extends Component {
  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      message: '',
      popup: false,
      status: ''
    }
    this.popupClose = this.popupClose.bind(this);
  }

  popupClose() {
    this.setState({ popup: false })
  }

  onClick = async () => {
    const url = process.env.REACT_APP_SERVERURL;
    const res = await fetch(`${url}message/`, {
      method: 'POST',
      headers: new Headers({ 
        'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' 
      }),
      body: JSON.stringify(this.state)
    });
    let response = await res.json();
    
    if (response.response) {
      this.setState({ popup: true });
    }
  }
  firstNameChange(e) {
    this.setState({ first_name: e.target.value});
  }

  lastNameChange(e) {
    this.setState({ last_name: e.target.value});
  }

  emailChange(e) {
    this.setState({ email: e.target.value});
  }
  
  messageChange(e) {
    this.setState({ message: e.target.value});
  }

  render() {
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const e = this.state;
    const mode = GetMode(a, 1);
    const bg = {
      border: `1px solid ${a.hex.primary}`
    }
    const pg = {
      backgroundColor: a.mode,
    }
    const btn = {
      background: a.grad,
      color: a.hex.light
    }
    const map = {
      center: {
        lat: 43.5, 
        lng: -112.05
      },
      zoom: 11
    }
    let background = `page-contact ${a.glass ? ' glass' : ''}`;
    return  (
      <section className="container-fluid" style={{padding: '3rem 0'}}>
        <WaveSvg dir="top" styles={{ fill: a.mode}} />
        <section className={background} style={pg}>
          <div className="container">
            {/* <Map data={map} /> */}
            {/* <div className="map-size" style={{height: '600px'}}>
              <Maps mapData={mapData} />
            </div> */}
            <div className="form-area flex-row" style={{ backgroundColor: mode }}>
              <ValidForm 
                nosubmit 
                onSubmit={(e) => this.onClick(e)} 
                className="flex-col contact-info" 
              >
                <h3 style={{color: a.rev}}>GET IN TOUCH</h3>
                <input 
                  name="first_name"
                  type="text" 
                  required
                  placeholder="First Name" 
                  style={bg} 
                  onChange={this.firstNameChange} 
                  value={e.first_name}
                />
                <input 
                  name="last_name"
                  type="text" 
                  required
                  placeholder="Last Name" 
                  style={bg} 
                  onChange={this.lastNameChange} 
                  value={e.last_name}
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
              <div className="statusMsg">{this.state.status}</div>
            </div>
          </div>
        </section>
        <WaveSvg dir="bottom" styles={{ fill: a.mode}} />
        <PopUp header="Status" close={this.popupClose} display={this.state.popup}>
          <p>Message has been received.</p>
        </PopUp>
      </section>
    )        
  }
}

export default Contact;
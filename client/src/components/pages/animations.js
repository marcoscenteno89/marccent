import React, { Component, Fragment } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ThemeContext } from "../var";
import { Blob, Fire, LinesCircles, Liquid } from '../inc/canvas';
// import { Flames } from "../inc/inc";
// import { Liquid } from "../inc/shapes";
import { CodeSnipet } from "../inc/inc-classes";

class Animations extends Component {

  static contextType = ThemeContext;

  constructor(props) {
    super(props);
  }

  render() {
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    let rev = !a.is_dark ? a.hex.dark : a.hex.light;
    let mode = a.is_dark ? a.hex.dark : a.hex.light;
    const pg = {
      background: a.mode,
      color: a.rev
    }
    const snippet = `
      const formData = new FormData();
      formData.append('username', 'David');
      formData.append('password', '12345');
      fetch('https://example.com/authenticate', {
          method: 'POST',
          body: formData
      }).then(response => response.json()).then(data => {
          console.log(data);
      }).catch(error => {
          console.error('Error:', error);
      });
    `
    return  (
      <section className="page-privacy-policy container-fluid">
        <div className="container">
          <div style={pg}>
            <div className="container">
              <h2 style={{textAlign: 'center'}}>Animations</h2>
              <h3 style={{textAlign: 'center'}}>Blob</h3>
              <div className="row">
                <div className="col-4">
                  <div className="shadow" style={{ height: '600px' }}>
                    <Blob color={a.hex.primary} count="15" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="shadow" style={{ height: '600px' }}>
                    <CodeSnipet language="javascript" text={snippet} />
                  </div>
                </div>
              </div>
              <h3 style={{textAlign: 'center'}}>Liquid</h3>
              <div className="row">
                <div className="col-6">
                  <div className="shadow" style={{ height: '600px' }}>
                    <Fire color={a.hex.primary} count="40"/>
                  </div>
                </div>
                <div className="col-6">
                  <div className="shadow" style={{ height: '600px' }}>
                    <LinesCircles color={a.hex.primary} count="20" />
                  </div>
                </div>
              </div>
              <h3 style={{textAlign: 'center'}}>Flames</h3>
              <div className="row">
                <div className="col-12" >
                  <div className="shadow" style={{ height: '600px' }}>
                    <Liquid />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )        
  }
}

export default Animations;
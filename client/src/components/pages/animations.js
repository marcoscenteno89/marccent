import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { BlobContainer, Blob, Liquid, Flames } from "../inc/inc";
// import { Circle } from "../inc/inc-classes";

class Animations extends Component {

  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const pg = {
      background: a.mode,
      color: a.rev
    }
    const bg = {
      background: a.grad,
      color: a.hex.light
    }
    return  (
      <section className="page-privacy-policy container-fluid">
        <div className="container">
          <div style={pg}>
            <div className="container">
              <h2 style={{textAlign: 'center'}}>Animations</h2>
              <h3 style={{textAlign: 'center'}}>Blob</h3>
              <div className="shadow col-6" style={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
                <BlobContainer styles={{ position: 'absolute' }}>
                  <Blob y={10} x={10} min={2} max={6} count={7} ydirection="top" xdirection="left" styles={{background: a.rev}} />
                  <Blob y={15} x={75} min={4} max={8} count={7} ydirection="bottom" xdirection="right" styles={{background: a.rev}} />
                  <Blob y={85} x={10} min={6} max={10} count={7} ydirection="top" xdirection="left" styles={{background: a.rev}} />
                  <Blob y={85} x={85} min={8} max={15} count={7} ydirection="bottom" xdirection="left" styles={{background: a.rev}} />
                  <Blob y={40} x={40} min={10} max={20} count={7} ydirection="top" xdirection="left" styles={{background: a.rev}} />
                </BlobContainer>
              </div>
              <h3 style={{textAlign: 'center'}}>Liquid</h3>
              <div className="shadow col-6" style={{ height: '600px', margin: '1rem 0', overflow: 'hidden' }}>
                <Liquid color={a.grad} level={70} background={a.mode} />
              </div>
              <h3 style={{textAlign: 'center'}}>Flames</h3>
              <div className="row">
                <div className="col-6" >
                  <div className="shadow" style={{ height: '600px', margin: '1rem 0', overflow: 'hidden' }}>
                    <Flames color={a.hex.primary} count={40} background={a.rev} />
                  </div>
                  <div className="shadow" style={{ height: '600px', margin: '1rem 0', overflow: 'hidden' }}>
                    <Flames color={a.hex.secondary} count={40} background={a.rev} />
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
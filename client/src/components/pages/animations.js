import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { Title } from "../inc/inc";

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
      <section className="page-privacy-policy flex-center">
        <div className="container">
          <Title style={bg} text="Animations" />
          <div style={pg}>
            <div className="container" style={{padding: '1rem',margin: '0'}}>
              
            </div>
          </div>
        </div>
      </section>
    )        
  }
}

export default Animations;
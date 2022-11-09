import React, { Component, Fragment } from 'react';
import { ThemeContext } from "../var"
import { Notebook } from "../inc/inc";

class HeroBanner extends Component {
   
  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    return (
      <section className="hero-banner flex-center" style={{margin: '0'}}>
        <div className="container" style={{overflow: 'visible', width: '75%'}}>
          <Notebook data={a}>
            <h1>Hello, My Name is Marcos Centeno</h1>
            <h2>A Web Developer that specializes in front-end development</h2>
            <h3>Take a look around</h3>
            <h4>Work in progress, website under construction.</h4>
          </Notebook>
        </div>
      </section>
    )
  }
}

export default HeroBanner;
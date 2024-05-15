import React, { Component, Fragment } from 'react';
import { ThemeContext } from "../var"
import { Notebook } from "../inc/inc";

class HeroBanner extends Component {
  static contextType = ThemeContext;
  render() {
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    return (
      <section className="container-fluid hero-banner flex-center">
        <div className="container">
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
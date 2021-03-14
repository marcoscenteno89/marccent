import React, { Component } from 'react';
import { Notebook } from "../inc/inc";

class HeroBanner extends Component {
   
    render() {
        const a = this.props.data;
        return (
            <section className="hero-banner flex-center" style={{margin: '0'}}>
                <div className="container" style={{overflow: 'visible', width: '75%'}}>
                    <Notebook data={a}>
                        <h1>Hello,</h1>
                        <h1>I'm Marcos Centeno</h1>
                        <h2>A Web Developer that specializes in front-end development</h2>
                        <h4>Take a look around</h4>
                    </Notebook>
                </div>
            </section>
        )
    }
}

export default HeroBanner;
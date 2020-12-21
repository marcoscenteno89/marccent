import React, { Component } from "react";
import './../styles/Portfolio.scss';
import { Img, Circle, Background, Title, Footer } from "./inc";
import header from "./../img/img2.jpg";
import profile from "./../img/mcr.png";

class Portfolio extends Component {
       
    render() {
        const a = this.props.data;

        return  (
            <div className="portfolio" style={{backgroundColor: a.mode}}>
                <Img src={header} />
                <div className="con flex-center">
                    <div className="circle-con">
                        <Circle data={a}>
                            <Img src={profile} />
                        </Circle>
                    </div>
                </div>
                <section className="container">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </section>
            </div>
        )        
    }
}

export default Portfolio;
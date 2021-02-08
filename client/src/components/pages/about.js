import React, { Component } from "react";
import '../../styles/About.scss';
import { Img, SpCircle } from "../inc";
import header from "../../media/img2.jpg";
import profile from "../../media/mcr.png";

class About extends Component {
       
    render() {
        const a = this.props.data;

        return  (
            <section className="about" style={{backgroundColor: a.mode}}>
                <Img src={header} />
                <div className="con flex-center">
                    <div className="circle-con">
                        <SpCircle data={a}>
                            <Img src={profile} />
                        </SpCircle>
                    </div>
                </div>
                <div className="container">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </section>
        )        
    }
}

export default About;
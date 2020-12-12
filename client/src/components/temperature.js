import React, { Component } from "react";
import ".././styles/Temperature.scss";
import '../styles/keyframes.scss';
import { Today } from "./inc";

class Temperature extends Component {
    render() {
        const a = this.props.data;
        const grad = `linear-gradient(to right, ${a.primary}, ${a.secondary})`;
        const mod = a.mode === '#FFF' ? '#383d44' : '#FFF';
        
        return  (
            <div className="circle flex-center" style={{backgroundColor: a.mode}}>
                <div className="grad flex-center" style={{backgroundImage: grad}}>
                    <div className="inner-circle flex-center" style={{backgroundColor: a.mode}}>
                        <div className="today" style={{color: mod}} >
                            <Today />
                        </div>
                        <div className="third">
                            <div style={{backgroundColor: a.secondary}}></div>
                            <div style={{backgroundColor: a.secondary}}></div>
                            <div style={{backgroundColor: a.secondary}}></div>
                        </div>
                        <div className="second">
                            <div style={{backgroundColor: a.primary}}></div>
                            <div style={{backgroundColor: a.primary}}></div>
                            <div style={{backgroundColor: a.primary}}></div>
                        </div>
                        <div className="first">
                            <div style={{backgroundColor: a.secondary}}></div>
                            <div style={{backgroundColor: a.secondary}}></div>
                            <div style={{backgroundColor: a.secondary}}></div>
                        </div>
                        <svg><defs>
                            <filter id="filter">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
                                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10" result="filter" />
                                <feComposite in="SourceGraphic" in2="filter" operator="atop" />
                            </filter>
                        </defs></svg>
                    </div>
                </div>
            </div>
        )        
    }
}

export default Temperature;
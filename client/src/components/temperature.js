import React, { Component } from "react";
import ".././styles/Temperature.scss";
import '../styles/keyframes.scss';
import { Today, Blur, SpCircle, RevColor } from "./inc";

class Temperature extends Component {
    render() {
        const a = this.props.data;
        const mod = RevColor(a.mode);
        const styles = {
            width: '90vw',
            height: '90vw',
            maxWidth: '768px',
            maxHeight: '768px'
        }
        return  (<div style={styles}>
                    <SpCircle data={a}>
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
                        <Blur />
                    </SpCircle>
                </div>)        
    }
}

export default Temperature;
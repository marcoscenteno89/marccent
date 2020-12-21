import React, { Component } from "react";
import ".././styles/Temperature.scss";
import '../styles/keyframes.scss';
import { Today, Blur, Circle } from "./inc";

class Temperature extends Component {
    render() {
        const a = this.props.data;
        const mod = a.mode === '#FFF' ? '#383d44' : '#FFF';
        const styles = {
            width: '90vw',
            height: '90vw',
            maxWidth: '768px',
            maxHeight: '768px'
        }
        return  (<div style={styles}>
                    <Circle data={a}>
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
                    </Circle>
                </div>)        
    }
}

export default Temperature;
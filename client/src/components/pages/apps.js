import React, { Component } from "react";
// import { Background, RevColor, LinGrad } from "./inc";
import Carousel from "react-elastic-carousel";
import MineSweeper from "./../minesweeper";
import Temperature from "./../temperature";
import Maps from "./../map";

class Apps extends Component {

    render() {
        console.log(this);
        const a = this.props.data;
        const styles = {}
        const mpCircle = {
            width: '90vw',
            height: '90vw',
            maxWidth: '768px',
            maxHeight: '768px',
            position: 'relative',
            borderRadius: '50%',
            overflow: 'hidden'
        }
        return  (
            <Carousel>
                <section className="section" style={styles}>
                    <div className="content flex-center" >
                        <MineSweeper data={a} />
                    </div>
                </section>
                <section className="section flex-center" style={styles}>
                    <Temperature data={a} />
                </section>
                <section className="flex-center">
                    <div className="map-size" style={mpCircle}><Maps data={a} /></div>
                </section>
            </Carousel>        
        )        
    }
}

export default Apps;
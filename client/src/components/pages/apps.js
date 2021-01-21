import React, { Component } from "react";
import { RevColor, LinGrad } from "./../inc";
import Carousel from "react-elastic-carousel";
import MineSweeper from "./../minesweeper";
import Temperature from "./../temperature";
import Maps from "./../map";

class Apps extends Component {

    render() {
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
            <section className="section flex-center" style={styles}>

                <Carousel>
                    <MineSweeper data={a} />
                    <Temperature data={a} />
                    <div className="map-size" style={mpCircle}><Maps data={a} /></div>
                </Carousel>
            </section>    
        )        
    }
}

export default Apps;
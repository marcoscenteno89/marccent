import React, { Component } from "react";
import { BrowserRouter, Route } from 'react-router-dom';
import AppNav from "../app-nav";
import MineSweeper from "../minesweeper";
import Temperature from "../temperature";
import Maps from "../map";
import '../../styles/About.scss';
import { Img, SpCircle, mpCircle } from "../inc";

class Apps extends Component {
       
    render() {
        const a = this.props.data;
        const mpCircle = {}

        return  (
            <BrowserRouter>
                <div className="flex-center">
                    <div className="container">
                        <Route path="/minesweeper"><MineSweeper data={a} /></Route>
                        <Route path="/temp"><Temperature data={a} /></Route>
                        <Route path="/map"><div className="map-size" style={mpCircle}><Maps data={a} /></div></Route>
                    </div>
                    <AppNav data={a} />
                </div>
            </BrowserRouter>
        )        
    }
}

export default Apps;
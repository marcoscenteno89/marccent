import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import Carousel from "react-elastic-carousel";
import { Link } from 'react-router-dom';
import { } from "./inc";

class AppNav extends Component {

    static contextType = ThemeContext;
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const i = {
            background: a.grad
        }
        const breakPoints = [
            {width: 568, itemsToShow: 3},
            {width: 768, itemsToShow: 4},
            {width: 868, itemsToShow: 5},
            {width: 968, itemsToShow: 6},
        ]
        return  (
            <ul className="appnav section flex-center w-100">
                <Carousel breakPoints={breakPoints}>
                    <li style={{borderColor: a.secondary}}>
                        <Link to="/apps/temp">
                            <i style={i} className="fas fa-temperature-high"></i>
                            <h4 style={i}>Temperature</h4>
                        </Link>
                    </li>
                    <li>
                        <Link to="/apps/minesweeper">
                            <i style={i} className="fas fa-bomb"></i>
                            <h4 style={i}>Minesweeper</h4>
                        </Link>
                    </li>
                </Carousel>
            </ul>   
        )        
    }
}

export default AppNav;
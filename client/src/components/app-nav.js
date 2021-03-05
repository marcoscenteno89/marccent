import React, { Component } from "react";
// import '../styles/Apps.scss';
import Carousel from "react-elastic-carousel";
import { Link } from 'react-router-dom';
// import { LinGrad } from "./inc";

class AppNav extends Component {

    render() {
        const a = this.props.data;
        const link = {
            // background: LinGrad(a.primary, a.secondary),
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
                    <li>
                        <Link to="/apps/minesweeper" style={link}>
                            <i style={link} className="fas fa-bomb"></i> Minesweeper
                        </Link>
                    </li>
                    <li style={{borderColor: a.secondary}}>
                        <Link to="/apps/temp" style={link}>
                            <i style={link} className="fas fa-temperature-high"></i> Temperature
                        </Link>
                    </li>
                </Carousel>
            </ul>   
        )        
    }
}

export default AppNav;
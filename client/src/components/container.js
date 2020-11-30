import React, { Component } from "react";
import MineSweeper from './minesweeper';

class Container extends Component {

    render() {

        const styles = {}
        const page = {}
        if (this.props.data) {
            const a = this.props.data;
            styles.backgroundImage = `linear-gradient(to right, ${a.primary}, ${a.secondary})`;
            page.backgroundImage = `linear-gradient(to left, ${a.primary}, ${a.secondary})`;
            page.color = a.mode === '#FFF' ? '#383d44' : '#FFF';
            // body.backgroundColor = a.mode;
            // body.color = a.mode === '#FFF' ? '#383d44' : '#FFF';
            // head.color = a.mode === '#FFF' ? '#383d44' : '#FFF';
        } 
        
        return  (
            <div className="content flex-center" style={styles}>
            <div className="bg">
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
            </div>
            <svg><defs>
                <filter id="filter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10" result="filter" />
                <feComposite in="SourceGraphic" in2="filter" operator="atop" />
                </filter>
            </defs></svg>
            <div className="container">
                <div className="page" style={page}>
                    <div className="page-head flex-center">
                        Tittle Goes Here
                    </div>
                    <div className="page-body flex-center">
                        <MineSweeper data={this.props.data} />
                    </div>
                    <div className="page-footer flex-center">
                        Copyright ©2020 Marccent. All rights reserved
                    </div>
                </div>
            </div>
          </div>
        )        
    }
}

export default Container;
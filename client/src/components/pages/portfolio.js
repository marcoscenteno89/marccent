import React, { Component, Fragment } from "react";
import '../../styles/pages/Portfolio.scss';
import { ThemeContext } from "../var"
import { Img } from "../inc/inc";
import Site1 from "./../../media/site1.jpg";
import Site2 from "./../../media/site2.jpg";
import Site3 from "./../../media/site3.jpg";
import Site4 from "./../../media/site4.jpg";
import Site5 from "./../../media/site5.jpg";
import Site6 from "./../../media/site6.jpg";
import Site7 from "./../../media/site7.jpg";
const images = [
    {
        src: Site1,
        url: 'https://anthembroadband.com/'
    },
    {
        src: Site2,
        url: 'https://dynamitewireless.com/'
    },
    {
        src: Site3,
        url: 'https://sagemountainaccounting.com/'
    },
    {
        src: Site4,
        url: 'https://www.northwestdatacom.com/'
    },
    {
        src: Site5,
        url: 'https://rimrockconcretecurbing.com/'
    },
    {
        src: Site6,
        url: 'https://rc-imp.com/'
    },
    {
        src: Site7,
        url: 'https://safelinkinternet.com/'
    },
]

class Portfolio extends Component {
    
    static contextType = ThemeContext;
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const pg = {
            backgroundColor: a.mode,
            padding: '20px'
        }
        let background = `page-portfolio flex-center${a.glass ? ' glass' : ''}`;
        return  (
            <section className={background} style={pg}>
                <div className="container">
                    <h2 className="w-100"style={{textAlign: 'center'}}>Portfolio</h2>
                    <div className="flex-center">
                    {images.map((img, index) => <Card key={index} content={img} />)}
                    </div>
                </div>
            </section>
        )        
    }
}

class Card extends Component {
    
    static contextType = ThemeContext;
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        return  (
            <div style={{ background: a.rev }} className="card-container flex-col">
                <div className="img-container">
                    <Img src={this.props.content.src} />
                </div>
                <div className="flex-center">
                    <a href={this.props.content.url} target="blank">
                        <i style={{background: a.grad}} className="far large fa-circle"></i>
                    </a>
                </div>
            </div>
        )
    }
}      

export default Portfolio;
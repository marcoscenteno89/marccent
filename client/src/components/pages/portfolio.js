import React, { Component, Fragment } from "react";
import '../../styles/Portfolio.scss';
import { Img, Title, LinGrad, FooterText, RevColor } from "../inc";
import Site1 from "./../../media/site1.png";
import Site2 from "./../../media/site2.png";
import Site3 from "./../../media/site3.png";
import Site4 from "./../../media/site4.png";
import Site5 from "./../../media/site5.png";
import Site6 from "./../../media/site6.png";
import Site7 from "./../../media/site7.png";
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
       
    render() {
        const a = this.props.data;
        const title = {
            background: LinGrad(a.primary, a.secondary)
        }
        const pg = {
            backgroundColor: a.mode,
            padding: '20px'
        }
        return  (
            <Fragment>
                <Title text="Portfolio" style={title} />
                <div className="portfolio flex-center" style={pg}>
                    {images.map((img, index) => <Card data={a} key={index} content={img} />)}
                </div>
                <FooterText style={title} />
            </Fragment>
        )        
    }
}

class Card extends Component {
       
    render() {
        const a = this.props.data;
        const i = {
            background: LinGrad(a.primary, a.secondary)
        }
        const bg = {
            background: RevColor(a.mode)
        }
        return  (
            <div style={bg} className="card-container flex-col">
                <div className="img-container">
                    <Img src={this.props.content.src} />
                </div>
                <div className="flex-center">
                    {/* <i style={i} className="fas fa-expand-arrows-alt"></i> */}
                    <a href={this.props.content.url} target="blank"><i style={i} className="far large fa-circle"></i></a>
                    {/* <a href={this.props.content.url} target="blank"><i style={i} className="fas fa-external-link-alt"></i></a> */}
                </div>
            </div>
        )
    }
}      
  

export default Portfolio;
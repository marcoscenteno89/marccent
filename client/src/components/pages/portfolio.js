import React, { Component, Fragment } from "react";
import '../../styles/pages/Portfolio.scss';
import { ThemeContext } from "../var";
import Carousel from "react-elastic-carousel";
import { Img, WaveSvg } from "../inc/inc";
import Site1 from "./../../media/site1.webp";
import Site2 from "./../../media/site2.webp";
import Site3 from "./../../media/site3.webp";
import Site4 from "./../../media/site4.webp";
import Site5 from "./../../media/site5.webp";
import Site6 from "./../../media/site6.webp";
import Site7 from "./../../media/site7.webp";
const images = [
  {
    src: Site1,
    alt: 'Anthem Broadband Link',
    url: 'https://anthembroadband.com/'
  },
  {
    src: Site2,
    alt: 'Dynamite Wireless Link',
    url: 'https://dynamitewireless.com/'
  },
  {
    src: Site3,
    alt: 'Sage Mountain Link',
    url: 'https://sagemountainaccounting.com/'
  },
  {
    src: Site4,
    alt: 'NorthWest DataCom Link',
    url: 'https://www.northwestdatacom.com/'
  },
  {
    src: Site5,
    alt: 'Rimrock Concrete Curbing Link',
    url: 'https://rimrockconcretecurbing.com/'
  },
  {
    src: Site6,
    alt: 'R & C Construction Link',
    url: 'https://rc-imp.com/'
  },
  {
    src: Site7,
    alt: 'Safelink Internet Link',
    url: 'https://safelinkinternet.com/'
  },
]

class Portfolio extends Component {
    
  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const pg = {
      backgroundColor: a.mode,
    }
    let background = `page-portfolio flex-center${a.glass ? ' glass' : ''}`;
    const breakPoints = [
      {width: 768, itemsToShow: 1},
      {width: 868, itemsToShow: 2},
      {width: 968, itemsToShow: 3},
    ]
    return  (
      <div>
        <WaveSvg dir="top" styles={{ fill: a.mode}} />
        <section className={background} style={pg}>
          <div className="container" style={{margin: '0'}}>
            <h2 className="w-100"style={{textAlign: 'center'}}>Portfolio</h2>
            <div className="flex-center">
              <Carousel breakPoints={breakPoints}>
              {images.map((img, index) => <Card key={index} content={img} />)}
              </Carousel>
            </div>
          </div>
        </section>
        <WaveSvg dir="bottom" styles={{ fill: a.mode}} />
      </div>
    )        
  }
}

class Card extends Component {
    
  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    return  (
      <a 
        href={this.props.content.url}
        alt={this.props.content.alt}
        target="blank" 
        style={{ background: a.rev }} 
        className="card-container flex-col">
          <Img src={this.props.content.src} alt={this.props.content.alt} />
          <i style={{background: a.grad}} className="far large fa-circle"></i>
      </a>
    )
  }
}      

export default Portfolio;
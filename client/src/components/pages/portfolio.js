import React, { Component, Fragment } from "react";
import '../../styles/pages/Portfolio.scss';
import { ThemeContext } from "../var";
import { Swiper, SwiperSlide } from 'swiper/react';
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
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const pg = {
      backgroundColor: a.mode,
    }
    let background = `page-portfolio ${a.glass ? ' glass' : ''}`;
    const breakPoints = [
      {width: 768, itemsToShow: 1},
      {width: 868, itemsToShow: 2},
      {width: 968, itemsToShow: 3},
    ]
    return  (
      <section className="container-fluid" style={{padding: '3rem 0'}}>
        <WaveSvg dir="top" styles={{ fill: a.mode}} />
        <section className={background} style={pg}>
          <div className="container">
            <h2 className="col-12"style={{textAlign: 'center'}}>Portfolio</h2>
            <div className="flex-center">
              <Swiper
                spaceBetween={50}
                slidesPerView={3}
                // onSlideChange={() => console.log('slide change')}
                // onSwiper={(swiper) => console.log(swiper)}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <Card key={index} content={img} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
        <WaveSvg dir="bottom" styles={{ fill: a.mode}} />
      </section>
    )        
  }
}

class Card extends Component {
    
  static contextType = ThemeContext;
  render() {
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
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
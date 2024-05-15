import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var";
import { Link } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

class AppNav extends Component {
  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const i = {
      color: a.rev
    }
    const breakPoints = [
      {width: 568, itemsToShow: 3},
      {width: 768, itemsToShow: 4},
      {width: 868, itemsToShow: 5},
      {width: 968, itemsToShow: 6},
    ]
    return  (
      <Swiper
        modules={[ Navigation, Pagination ]}
        className="app-nav"
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        // onSlideChange={() => console.log('slide change')}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide key={0}>
            <Link to="/apps/temp">
              <i style={i} className="fas fa-temperature-high"></i>
              <h4 style={i}>Temperature</h4>
            </Link>
          </SwiperSlide>
          <SwiperSlide key={1}>
            <Link to="/apps/minesweeper">
              <i style={i} className="fas fa-bomb"></i>
              <h4 style={i}>Minesweeper</h4>
            </Link>
          </SwiperSlide>
          <SwiperSlide key={2}>
            <Link to="/apps/numpuz">
              <i style={i} className="fa-solid fa-grip-vertical"></i>
              <h4 style={i}>Num Puzzle</h4>
            </Link>
          </SwiperSlide>
      </Swiper>
    )        
  }
}

export default AppNav;
'use client';
// Canvas animations (canvas.js), loaded only in the browser: CurrentAnim draws the one the theme picked (the page
// background), AnimList is the footer slider to pick one.
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Loading, Button } from "@/components/server/component";
import { withT } from "./hoc";

const initAnim = () => {
  const animations = [];
  const animNameList = [
    'BlobWTRC','NetworkLoopWTRC', 'WaveWTRC', 'ParticleFlowfieldWTRC', 'OrbitAnimWTRC', 'FireWTRC'
  ];
  for (let i of animNameList) {
    animations.push(dynamic(() => import("./canvas").then(module => module[i]), {
      ssr: false,
      loading: () => <Loading require={[]} />,
    }));
  }
  return animations;
}

const animations = initAnim();

const CurrentAnim = (props) => {
  const MainAnim = animations[props.theme.animation];
  return <MainAnim {...props} />;
}

const AnimList = (props) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      scrollbar={{ draggable: true }}
      slidesPerView={2}
      spaceBetween={16} /* = the default grid gap (--grid-gap, --space: 1rem) */
      navigation
      pagination={{ clickable: true }}
    >
      {animations.map((Anim, i) => {
        return (
          <SwiperSlide key={`slide-${i}`}>
            <div className="bg border round pad grid cols-1 shadow">
              <Anim style={{height: '200px'}} id={`footer-${i}`} className="round" />
              <Button onClick={() => props.update({animation: i})}>
                {props.theme.animation === i ? 'Selected' : 'Select'}
              </Button>
            </div>
          </SwiperSlide>
        )}
      )}
    </Swiper>
  ) 
}

const AnimListWT = withT(AnimList); // W = With, T = Theme
const CurrentAnimWT = withT(CurrentAnim);

export { AnimListWT, CurrentAnimWT }

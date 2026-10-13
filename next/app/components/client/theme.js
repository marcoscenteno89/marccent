'use client';
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/components/context";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Form, Field, Modal, cx, Loading, Button } from "./component";
import { withT } from "./hoc";
import dynamic from 'next/dynamic';
import { ToastContext } from '@/components/context';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

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

const Body = (props) => {
  let { theme } = useContext(ThemeContext);
  if (!theme) theme = {};
  const is_dark = theme.is_dark ? 'dark' : 'light';
  return (
    <body className={cx(props.className, theme.glass && 'glass')} suppressHydrationWarning={true} data-theme={is_dark}>
      {props.children}
    </body>
  )  
}

const RainbowMode = (props) => {
  const rainbow = props.theme.rainbow;
  return (
    <Button icon={['fa-solid', rainbow ? 'fa-wand-magic-sparkles' : 'fa-wand-magic', props.className].filter(Boolean).join(' ')} aria-label="Toggle rainbow mode" onClick={() => props.update({rainbow: !rainbow})} />
  )  
}

const ThemeMode = (props) => {
  const is_dark = props.theme.is_dark; // Oposite
  return (
    <Button
      icon={is_dark ? 'sun' : 'moon'}
      onClick={() => props.update({is_dark: !is_dark})}>
      {is_dark ? 'Light' : 'Dark'}
    </Button>
  )  
}

const GlassMode = (props) => {
  const glass = props.theme.glass;
  return (
    <Button
      icon="fa-brands fa-hornbill"
      aria-pressed={!!glass}
      onClick={() => props.update({ glass: !glass })}>
      Glass
    </Button>
  )  
}

const Themes = (props) => {
  const { toast, setToast } = useContext(ToastContext);
  const [ modal, setModal ] = useState(false);
  const b_slt = { width: '80%', height: '60px' };
  const breakPoints = {
    268: {width: 268, slidesPerView: 3},
    368: {width: 368, slidesPerView: 4},
    468: {width: 468, slidesPerView: 5},
    568: {width: 568, slidesPerView: 6},
    668: {width: 668, slidesPerView: 7},
    768: {width: 768, slidesPerView: 8},
    868: {width: 868, slidesPerView: 9},
    1200: {width: 1200, slidesPerView: 10}
  }

  const current = props.theme.themeList[props.theme.active];

  const add = (data) => {
    setModal(false);
    props.setTheme(props.theme.add(data)); // data: { primary, secondary } from the form
    setToast(toast.add('Theme created successfully', 'success'));
  }

  const remove = (index, event) => {
    event.stopPropagation();
    if (index === props.theme.active) {
      setToast(toast.add('Currently selected theme cannot be deleted', 'danger'));
      return;
    }

    props.setTheme(props.theme.remove(index));
    setToast(toast.add('Theme deleted successfully', 'success'));
  }

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        scrollbar={{ draggable: true }}
        breakpoints={breakPoints}
        slidesPerView={10}
        navigation
        pagination={{ clickable: true }}
      >
        <SwiperSlide key={`slide-add`}>
          <Button
            icon="fa-solid fa-circle-plus display-6"
            aria-label="Add Theme"
            style={b_slt}
            onClick={() => setModal(true)} />
        </SwiperSlide>
        {props.theme.themeList.map((single, i) => (
          <SwiperSlide key={`slide-${i}`}>
            <ThemeBtn 
              data={single} 
              styles={b_slt} 
              id={i} 
              update={() => props.update({active:i})} 
              remove={remove} />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* New theme: two color pickers, opened by the + button above. They start at the active theme's colors;
          keyed by the active theme so they reset to it after a theme is added or picked. */}
      <Modal title="Add New Theme" show={modal} setShow={setModal}>
        <Form key={props.theme.active} onSubmit={add} submitLabel="Create Theme" submitIcon="circle-plus">
          <Field type="color" name="primary" label="Primary color" defaultValue={current?.primary.hex} required />
          <Field type="color" name="secondary" label="Secondary color" defaultValue={current?.secondary.hex} required />
          <p className="fs-sm opacity-75">Pick the same color twice for a single-color theme.</p>
        </Form>
      </Modal>
      {/* <Status status={status} setStatus={setStatus} /> */}
    </>
  )  
}

const ThemeBtn = (props) => {
  const { data, id, update, remove } = props;
  const bg = `linear-gradient(to right, ${data.primary.hex}, ${data.secondary.hex})`;
  const b_slt = { ...props.styles, backgroundImage: bg, position: 'relative' }; // relative: anchors the remove (x) icon
  const i_slt = { marginBottom: '-6px', marginLeft: '-3px' };
  return (
    <button
      aria-label={`Activate Theme #${id}`}
      className="btn" 
      style={b_slt} 
      onClick={() => update(id)}>
      <i className="fa-solid fa-circle-xmark position-absolute bottom-100 start-100" style={i_slt} onClick={(event) => remove(id, event)}></i>
    </button>
  )
}

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
      navigation
      pagination={{ clickable: true }}
    >
      {animations.map((Anim, i) => {
        return (
          <SwiperSlide key={`slide-${i}`}>
            <div className="bg border round pad grid cols-1 gap-2">
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

// W = With, T = Theme
const RainbowModeWT = withT(RainbowMode);
const ThemeModeWT = withT(ThemeMode);
const GlassModeWT = withT(GlassMode);
const ThemesWT = withT(Themes);
const AnimListWT = withT(AnimList);
const CurrentAnimWT = withT(CurrentAnim);

// Applies the saved theme: writes the six palette colors (styles/theme.css) on :root whenever the theme
// changes, from the same Color shades the canvas animations use. Renders nothing.
const UpdateThemeVariables = () => {
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement.style;
    for (const [ name, color ] of [[ 'primary', theme.primary() ], [ 'secondary', theme.secondary() ]]) {
      root.setProperty(`--${name}`, color.hex);
      root.setProperty(`--${name}-lighter`, color.lighter[1].hex); // 2 of 5 steps lighter
      root.setProperty(`--${name}-darker`, color.darker[1].hex);   // 2 of 5 steps darker
    }
  }, [theme]);
  return null;
}

export { Body, UpdateThemeVariables, RainbowModeWT, ThemeModeWT, GlassModeWT, ThemesWT, AnimListWT, CurrentAnimWT }
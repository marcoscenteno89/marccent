'use client';
import { useContext, useState } from "react";
import { ThemeContext } from "@/components/context";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from 'react-bootstrap/Button';
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { WebModal, WebFormWC } from "./component";
import { Loading } from "./component";
import { withCT, withT, withTheme } from "./hoc";
import dynamic from 'next/dynamic';
import { ToastContext } from '@/components/context';
import 'swiper/css';

const initAnim = () => {
  const animations = [];
  const animNameList = [
    'BlobWCTC','NetworkLoopWCTC', 'WaveWCTC', 'ParticleFlowfieldWCTC', 
    'OrbitAnimWCTC', 'FireWCTC'
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
  const cls = ['body'];
  if (theme.glass) cls.push('glass');
  const is_dark = theme.is_dark ? 'dark' : 'light';
  return (
    <body className={cls.join(' ')} suppressHydrationWarning={true} data-bs-theme={is_dark}>
      {props.children}
    </body>
  )  
}

const RainbowMode = (props) => {
  const rainbow = props.theme.rainbow;
  let on = 'fa-wand-magic-sparkles';
  let off = 'fa-wand-magic';
  props.className.add(rainbow ? on : off).remove(rainbow ? off : on);
  return (
    <li className="nav-item col-6 col-md-auto">
      <Button variant="linear-gradient" onClick={() => props.update({rainbow: !rainbow})}>
        <i className={props.className.print()}></i>
      </Button>
    </li>
  )  
}

const ThemeMode = (props) => {
  const is_dark = props.theme.is_dark; // Oposite
  props.className.add(is_dark ? 'light' : 'dark').remove(is_dark ? 'dark' : 'light');
  return(
    <li className="nav-item col-6 col-md-auto">
      <Button 
        aria-label="Update theme mode"
        variant={props.className.print()}
        onClick={() => props.update({is_dark: !is_dark})}>
        <i className={`fa-solid ${is_dark ? 'fa-sun' : 'fa-moon'}`}></i>
      </Button>
    </li>
  )  
}

const GlassMode = (props) => {
  const glass = props.theme.glass;
  let on = 'secondary';
  let off = 'outline-secondary';
  props.className.add(glass ? on : off).remove(glass ? off : on);
  return (
    <li className="nav-item col-6 col-md-auto">
      <Button 
        aria-label="Update glass mode"
        variant={props.className.print()} 
        onClick={() => props.update({ glass: !glass })}>
        <i className="fa-brands fa-hornbill"></i>
      </Button>
    </li>
  )  
}

const Themes = (props) => {
  const { toast, setToast } = useContext(ToastContext);
  const newThemeId = 'new-theme';
  const cls = ['py-5'];
  const [ modal, setModal ] = useState(false);
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

  const btn = {
    width: '80%',
    height: '60px'
  }

  const add = (data) => {
    setModal(false);
    const newTheme = {}
    Object.entries(data).forEach(([key, val]) => newTheme[val.name] = val.value);
    props.setTheme(props.theme.add(newTheme));
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
        className={cls.join(' ')}
        slidesPerView={10}
        navigation
        pagination={{ clickable: true }}
      >
        <SwiperSlide key={`slide-add`}>
          <Button 
            aria-label="Add Theme" 
            variant="info w-80 border-0" 
            style={btn}  
            onClick={() => setModal(true)}
            data-bs-target={`#${newThemeId}`}>
            <i className="fa-solid fa-circle-plus display-6"></i>
          </Button>
        </SwiperSlide>
        {props.theme.themeList.map((single, i) => (
          <SwiperSlide key={`slide-${i}`}>
            <ThemeBtn 
              data={single} 
              styles={btn} 
              id={i} 
              update={() => props.update({active:i})} 
              remove={remove} />
          </SwiperSlide>
        ))}
      </Swiper>
      <WebModal title="Add New Theme" show={modal} setShow={setModal}>
        <WebFormWC callBack={add}>
          <input type="color" name="primary" className="form-control-color" required />
          <input type="color" name="secondary" className="form-control-color" required />
        </WebFormWC>
      </WebModal>
      {/* <Status status={status} setStatus={setStatus} /> */}
    </>
  )  
}

const ThemeBtn = (props) => {
  const cls = ['btn', 'border-0', 'position-relative'];
  const icon = ['fa-solid', 'fa-circle-xmark', 'position-absolute', 'bottom-100', 'start-100']
  const { data, styles, id, update, remove } = props;
  const btn = Object.assign({}, styles);
  btn.backgroundImage = `linear-gradient(to right, ${data.primary.hex}, ${data.secondary.hex})`;
  const iStyles = { 
    marginBottom: '-6px', 
    marginLeft: '-3px' 
  }
  return (
    <button
      aria-label={`Activate Theme #${id}`}
      className={cls.join(' ')} 
      style={btn} 
      onClick={() => update(id)}>
      <i className={icon.join(' ')} style={iStyles} onClick={(event) => remove(id, event)}></i>
    </button>
  )
}

const NewTheme = (props) => {
  const [ status, setStatus ] = useState({ 
    active: false,
    msg: '',
    type: 'danger'
  }, []);

  const [ form, setForm ] = useState({ 
    primary: '',
    secondary: '',
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <WebFormWC>
      {Object.keys(form).map((key, index) => {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        return (
          <div className="col-auto" key={key}>
            <label className="sr-only" for={key}>Username</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">Select {name} Color</div>
              </div>
              <input 
                type="color" 
                id={key} 
                className="form-control" 
                value={form[key]} 
                onChange={handleChange} 
                name={key} />
            </div>
          </div>
        )}
      )}
      <p>Select same color for primary and secondary colors for single colored theme.</p>
      {/* <Status status={status} setStatus={setStatus} /> */}
    </WebFormWC>
  )
}

const CurrentAnim = (props) => {
  const MainAnim = animations[props.theme.animation];
  return <MainAnim {...props} />;
}

const AnimList = (props) => {
  const cls = ['py-2'];
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      scrollbar={{ draggable: true }}
      className={cls.join(' ')}
      slidesPerView={2}
      navigation
      pagination={{ clickable: true }}
    >
      {animations.map((Anim, i) => {
        const btn = [props.theme.animation === i ? 'primary' : 'secondary','mt-3', 'col-12'];
        const text = props.theme.animation === i ? 'Selected' : 'Select';
        return (
          <SwiperSlide key={`slide-${i}`}>
            <div className="pe-2">
              <div className="card">
                <div className="card-body">
                  <Anim style={{height: '200px'}} id={`footer-${i}`} className="rounded" />
                  <Button variant={btn.join(' ')} onClick={() => props.update({animation: i})}>
                    {text}
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        )}
      )}
    </Swiper>
  ) 
}

// W = With, C = Component, T = Theme
const RainbowModeWCT = withCT(RainbowMode);
const ThemeModeWCT = withCT(ThemeMode);
const GlassModeWCT = withCT(GlassMode);
const ThemesWT = withT(Themes);
const AnimListWT = withT(AnimList);
const CurrentAnimWT = withT(CurrentAnim);

export { Body, RainbowModeWCT, ThemeModeWCT, GlassModeWCT, ThemesWT, AnimListWT, CurrentAnimWT }
'use client';
import { useContext, useState } from "react";
import { ThemeContext } from "@/components/context";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { WebForm, CLS, STL, Loading, Button } from "./component";
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
  const b_cls = new CLS(props.className).add('body', theme.glass ? 'glass' : '');
  const is_dark = theme.is_dark ? 'dark' : 'light';
  return (
    <body className={b_cls.prt()} suppressHydrationWarning={true} data-bs-theme={is_dark}>
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
  const b_slt = new STL({width: '80%', height: '60px'});
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
        slidesPerView={10}
        navigation
        pagination={{ clickable: true }}
      >
        <SwiperSlide key={`slide-add`}>
          <Button
            icon="fa-solid fa-circle-plus display-6"
            aria-label="Add Theme"
            style={b_slt}
            onClick={() => setModal(true)}
            data-bs-target={'#new-theme'} />
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
      {/* <WebModal title="Add New Theme" show={modal} setShow={setModal}>
        <WebForm callBack={add}>
          <input type="color" name="primary" className="form-control-color" required />
          <input type="color" name="secondary" className="form-control-color" required />
        </WebForm>
      </WebModal> */}
      {/* <Status status={status} setStatus={setStatus} /> */}
    </>
  )  
}

const ThemeBtn = (props) => {
  const { data, id, update, remove } = props;
  const b_cls = new CLS('btn');
  const i_cls = new CLS('fa-solid fa-circle-xmark position-absolute bottom-100 start-100');
  const bg = `linear-gradient(to right, ${data.primary.hex}, ${data.secondary.hex})`;
  const b_slt = new STL(props.styles).add('backgroundImage', bg).add('position', 'relative'); // relative: anchors the remove (x) icon
  const i_slt = new STL({ marginBottom: '-6px', marginLeft: '-3px' });
  return (
    <button
      aria-label={`Activate Theme #${id}`}
      className={b_cls.prt()} 
      style={b_slt} 
      onClick={() => update(id)}>
      <i className={i_cls.prt()} style={i_slt} onClick={(event) => remove(id, event)}></i>
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
    <WebForm>
      {Object.keys(form).map((key, index) => {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        return (
          <div key={key}>
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
    </WebForm>
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
            <div className="card pad grid cols-1 gap-2">
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

export { Body, RainbowModeWT, ThemeModeWT, GlassModeWT, ThemesWT, AnimListWT, CurrentAnimWT }
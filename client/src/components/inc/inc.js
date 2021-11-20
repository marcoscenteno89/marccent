import React, {} from "react";
import { Link } from 'react-router-dom';

const CurrentDate = new Date();

const LinGrad = (a, b) => `linear-gradient(to right, ${a}, ${b})`;

const GetColor = (rgb, op) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${op})`;

const GetRgb = hex => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

const GetMode = (a, op) => a.is_dark ? GetColor(a.rgb.dark, op) : GetColor(a.rgb.light, op);

const RevColor = (a, op) => !a.is_dark ? GetColor(a.rgb.dark, op) : GetColor(a.rgb.light, op);

const RandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const Button = props => {
  return (
    <button 
      style={props.styles} 
      aria-label={props.text} 
      className={props.className} 
      onClick={() => props.onClick()}
    >
      <i className="fab fa-edge rotate"></i> 
      <span style={{marginLeft: '5px'}}>{props.text}</span>
    </button>
  )
}

const Bomb = () => {
  function hover(a) {
    a.target.style.background = 'none';
  }
  return (
  <i className="fas fa-bomb" 
    onMouseOver={hover.bind(this)}
    onMouseLeave={hover.bind(this)}
    style={{backgroundColor: 'none !important'}}
    >
    </i>
  )
}

const Flag = () => {
  function hover(a) {
    a.target.style.background = 'none';
  }
  return (
  <i className="fas fa-flag" 
    onMouseOver={hover.bind(this)}
    onMouseLeave={hover.bind(this)}
    style={{backgroundColor: 'none !important'}}
    >
  </i>)
}

const Background = props => {
  const arr = [];
  for (let i = 0; i < 8; i++) {
    let ran = RandomNum(60, 100);
    let ball = {
      width: `${ran * 3}px`,
      height: `${ran * 3}px`,
      top: `${RandomNum(60, 100)}%`,
      left: `${RandomNum(60, 100)}%`
    }
    arr.push(ball);
  };
  for (let i = 0; i < 8; i++) {
    let ran = RandomNum(60, 100);
    let ball = {
      width: `${ran * 3}px`,
      height: `${ran * 3}px`,
      top: `${RandomNum(0, 40)}%`,
      left: `${RandomNum(0, 40)}%`
    }
    arr.push(ball);
  };
  return (
    <React.Fragment key="1">
      <div className="bg"><div className="cont">
        {arr.map((i, index) => <div key={index} className="ball" style={i}></div>)}
      </div></div>
      <Blur />
    </React.Fragment>
  )
}

const WaveSvg = (props) => {
  const classes = `wave-section wave-${props.dir}`;
  return (
    <svg 
      className={classes} 
      style={props.styles} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1000 100" 
      preserveAspectRatio="none"
    >
      <path 
        className="fill wave-one" 
        opacity="0.33" 
        d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"
      ></path>
      <path 
        className="fill wave-one" 
        opacity="0.66" 
        d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"
      ></path>
      <path 
        className="fill wave-one" 
        d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"
      ></path>
    </svg>
  )
}

const Blur = props => {
  return (
    <svg className="blur-svg">
      <defs>
        <filter id="filter">
          <feGaussianBlur 
            in="SourceGraphic" 
            stdDeviation="18" 
            result="blur"
         />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10" 
            result="filter" 
          />
          <feComposite 
            in="SourceGraphic" 
            in2="filter" 
            operator="atop" 
          />
        </filter>
      </defs>
    </svg>
  )
}

const Title = props => {
  return (<h2 className="header flex-center" style={props.style}>{props.text}</h2>)
}

const Img = props => {
  return (<React.Fragment key="1">
    <img 
      src={props.src} 
      alt={props.alt}
      style={props.styles} 
      loading="lazy" 
    />
  </React.Fragment>)
}

const FooterText = props => {
  return (
    <div className="footer flex-center" style={props.style}>
      Copyright ©{CurrentDate.getFullYear()} 
      Marccent. All rights reserved | 
      <ul>
        <li><Link style={props.style} to="/privacy-policy"> Privacy Policy</Link></li>
      </ul>
    </div>
  )
}

const Notebook = props => {
  const a = props.data;
  const notebook = {
    backgroundColor: GetMode(a, 0.3),
  }
  const full = {
    backgroundColor: GetMode(a, 0.5),
    color: a.rev
  }
  return (
    <div className="notebook">
      <div className="layer-1" style={notebook}>
      <div className="layer-2" style={notebook}>
      <div className="layer-3" style={notebook}>
      <div className="layer-4" style={notebook}>
      <div className="layer-5" style={notebook}>
      <div className="layer-6" style={notebook}>
        <div className="notebook-content" style={full}>{props.children}</div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
    </div>
  )
}

const CustDate = (props) => {
  const i = props.date ? new Date(props.date) : CurrentDate;
  const days = [
    "Sunday", 
    "Monday", 
    "Tuesday", 
    "Wednesday",
    "Thursday", 
    "Friday", 
    "Saturday"
  ];
  const month = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
  ];
  const o = FormatTime(i);
  let string = '';
  if (props.ver) {
    let e = props.ver;
    if (e == '1') string = `${days[i.getDay()]}, ${month[i.getMonth()]} ${i.getDate()}, ${i.getFullYear()}`;
    if (e == '2') string = `${days[i.getDay()]} ${i.getDate()}, ${o.hour}:${o.min} ${o.tod}`;
  }
  
  return (string);
}

const SpCircle = props => {
  if (!props.data) return (<div>No data Found</div>)
  const o = props.styles;
  return (
    <div className="cir cir-xl flex-center" style={o.circle}>
      <div className="cir cir-ml flex-center" style={o.grad}>
        <div className="cir cir-m anim flex-center" style={o.innerCircle}>
          {props.children}
        </div>
      </div>
    </div>
  ) 
}

const ColorList = is_dark => {
  const list = {}
  if (is_dark) {
    list.a = '#6b6b6b';
    list.b = '#212121';
    list.c = '#181818';
    list.d = '#000000';
  } else {
    list.a = '#656565';
    list.b = '#f5f5f5';
    list.c = '#e5e5e5';
    list.d = '#FFFFFF';
  }
  return list;
}

const MapStyle = (a) => {
  const col =  ColorList(a.is_dark);
  const mode = a.is_dark ? a.hex.dark : a.hex.light;
  const rev = a.is_dark ? a.hex.light : a.hex.dark;
  const prim = a.hex.primary;
  const sec = a.hex.secondary;
  return [
    {elementType: 'geometry', stylers: [{color: mode}]},
    {elementType: 'labels.text.stroke', stylers: [{color: rev}]},
    {elementType: 'labels.text.fill', stylers: [{color: mode}]},
    {featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: mode}]},
    {featureType: 'poi', elementType: 'labels.text.fill', stylers: [{color: mode}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{color: col.c}]},
    {featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{color: mode}]},
    {featureType: 'road', elementType: 'geometry', stylers: [{color: sec}]},
    {featureType: 'road', elementType: 'geometry.stroke', stylers: [{color: col.d}]},
    {featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: mode}]},
    {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: prim}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: sec}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{color: mode}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: prim}]},
    {featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{color: mode}] },
    {featureType: 'water', elementType: 'geometry', stylers: [{color: col.d}]},
    {featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: mode}]},
    {featureType: 'water', elementType: 'labels.text.stroke', stylers: [{color: rev}]}
  ]
}

const FormatTime = (i) => {
  const singleDig = (num) => {
    return num < 10 ? `0${num}` : num;
  }
  return {
    hour: singleDig(i.getHours() > 12 ? i.getHours() - 12 : i.getHours()),
    min: singleDig(i.getMinutes()),
    sec: singleDig(i.getSeconds()),
    tod: i.getHours() > 12 ? 'PM' : 'AM'
  }
}

export { 
    SpCircle, Blur, Button, Background, Title, FooterText, MapStyle, Bomb, Notebook, GetMode,
    CurrentDate, CustDate, Img, ColorList, RandomNum, Flag, LinGrad, GetColor, GetRgb, RevColor,
    WaveSvg, FormatTime
}
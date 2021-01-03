import React, {} from "react";

const CurrentDate = new Date();

const RevColor = (color) => color === '#FFFFFF' ? '#383d44' : '#FFFFFF';

const LinGrad = (a, b) => `linear-gradient(to right, ${a}, ${b})`;

const Button = props => {
    let classList = `${props.className} flex-center`;
    return (
        <button style={props.styles} className={classList} onClick={() => props.onClick()}>
            <i className="fab fa-edge rotate"></i> <span style={{marginLeft: '5px'}}>{props.text}</span>
        </button>
    )
}

const ColorList = color => {
    const list = {}
    if (color === '#FFFFFF') {
        list.a = '#656565';
        list.b = '#f5f5f5';
        list.c = '#e5e5e5';
        list.d = '#FFFFFF';
        list.main = '#FFFFFF';
    } else {
        list.a = '#6b6b6b';
        list.b = '#212121';
        list.c = '#181818';
        list.d = '#000000';
        list.main = '#383d44';
    }
    return list;
}

const Background = props => {
    return (
        <React.Fragment key="1">
            <div className="bg">
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
            </div>
            <Blur />
        </React.Fragment>
    )
}

const Blur = props => {
    return (
        <svg><defs>
            <filter id="filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10" result="filter" />
            <feComposite in="SourceGraphic" in2="filter" operator="atop" />
            </filter>
        </defs></svg>
    )
}

const Title = props => {
    return (<div className="header flex-center" style={props.style}>{props.text}</div>)
}

const Img = props => {
    return (<React.Fragment key="1">
        <img src={props.src} alt={props.alt} />
    </React.Fragment>)
}

const FooterText = props => {
    return (
    <div className="footer flex-center" style={props.style}>
        Copyright ©{CurrentDate.getFullYear()} Marccent. All rights reserved
    </div>)
}

const Today = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday" ,"Thursday", "Friday", "Saturday"];
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const i = CurrentDate;
    return (`${days[i.getDay()]}, ${month[i.getMonth()]} ${i.getDate()}, ${i.getFullYear()}`);
}

const SpCircle = props => {
    
    if (props.data) {
        const a = props.data;
        const grad = LinGrad(a.primary, a.secondary);
        return (
            <div className="circle flex-center" style={{backgroundColor: a.mode}}>
                <div className="grad flex-center" style={{backgroundImage: grad}}>
                    <div className="inner-circle flex-center" style={{backgroundColor: a.mode}}>
                        {props.children}
                    </div>
                </div>
            </div>
        )
    } else {
        return (<div>No data Found</div>)
    }
    
}

const MapStyle = (a) => {
    if (a.mode) {
        const col =  ColorList(a.mode);
        return [
            {elementType: 'geometry', stylers: [{color: col.main}]},
            {elementType: 'labels.text.stroke', stylers: [{color: col.d}]},
            {elementType: 'labels.text.fill', stylers: [{color: a.secondary}]},
            {featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: a.secondary}]},
            {featureType: 'poi', elementType: 'labels.text.fill', stylers: [{color: a.secondary}]},
            {featureType: 'poi.park', elementType: 'geometry', stylers: [{color: col.c}]},
            {featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{color: a.primary}]},
            {featureType: 'road', elementType: 'geometry', stylers: [{color: a.secondary}]},
            {featureType: 'road', elementType: 'geometry.stroke', stylers: [{color: col.d}]},
            {featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: a.secondary}]},
            {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: a.primary}]},
            {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: col.d}]},
            {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{color: a.secondary}]},
            {featureType: 'transit', elementType: 'geometry', stylers: [{color: a.primary}]},
            {featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{color: a.secondary}] },
            {featureType: 'water', elementType: 'geometry', stylers: [{color: col.d}]},
            {featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: a.secondary}]},
            {featureType: 'water', elementType: 'labels.text.stroke', stylers: [{color: col.d}]}
        ]
    } else {
        return []
    }
}

export { 
    SpCircle, Blur, Button, Background, Title, FooterText, MapStyle,
    CurrentDate, Today, Img, RevColor, LinGrad, ColorList
}
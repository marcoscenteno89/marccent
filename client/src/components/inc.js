import React, { Component, Fragment } from "react";

const CurrentDate = new Date();

const Gradient = props => {
    const backgroundImage = `linear-gradient(to ${props.direcction ? props.direcction : 'left'}, ${props.primary}, ${props.secondary})`;
    return backgroundImage;
}

const Button = props => {
    return (<button style={props.styles} className={props.classes} onClick={() => props.onClick()}>{props.text}</button>)
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
            <svg><defs>
                <filter id="filter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10" result="filter" />
                <feComposite in="SourceGraphic" in2="filter" operator="atop" />
                </filter>
            </defs></svg>
        </React.Fragment>
    )
}

const Title = props => {
    return (<div className="header flex-center" style={props.style}>{props.text}</div>)
}

const Footer = props => {
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

export { Button, Background, Title, Footer, CurrentDate, Gradient, Today }
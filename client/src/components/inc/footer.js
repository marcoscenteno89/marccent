import React, { Component,Fragment } from "react";
import { ThemeContext } from "../var"
import Carousel from "react-elastic-carousel";
import { FooterText } from "./inc"
import '../../styles/inc/Footer.scss';

class Footer extends Component {

    static contextType = ThemeContext;

    addTheme = () => {
        console.log('works till here');
    } 

    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        
        const breakPoints = [
            {width: 368, itemsToShow: 2},
            {width: 468, itemsToShow: 3},
            {width: 568, itemsToShow: 5},
            {width: 668, itemsToShow: 6},
            {width: 768, itemsToShow: 7},
        ]

        let background = `main-footer flex-center${a.glass ? ' glass' : ''}`;
        
        return  (
            <footer className={background} style={{backgroundColor: a.mode}}>
                <div className="container" style={{paddingTop: '1rem'}}>
                    <FooterNav />
                    <div className="m-10 flex-center">
                        <LightDark />
                    </div>
                    <div className="flex-row">
                        <Carousel breakPoints={breakPoints}>
                            <button key={0} className="single flex-center" onClick={() => this.addTheme()}>
                                <div className="inner flex-center">
                                    <i style={{fontSize: '2rem'}} className="fas fa-plus"></i>
                                </div>
                            </button>
                            {this.context.themeList.map(single => (
                                <Choices key={single.id} data={single} />
                            ))}
                        </Carousel>
                    </div>
                    <FooterText style={{ color : a.rev }} />
                </div>
            </footer>
        )        
    }
}

class Choices extends Component {
    
    static contextType = ThemeContext;

    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const b = this.context;
        const c = this.props.data;
        const btn = {
            backgroundImage: a.grad,
            boxShadow: `0px 0px 10px ${c.primary}, 0px 0px 10px ${c.secondary}`
        }
        let inner = {
            backgroundColor: a.mode,
            boxShadow: `inset 0 0 5px ${c.primary}, inset 0 0 5px ${c.secondary}`
        }

        const shadow = {
            filter: `drop-shadow(-25px 0 9px ${c.primary}) drop-shadow(25px 0 9px ${c.secondary}) blur(2px)`,
            background: a.mode
        }
            
        return (
        <button key={c.id} className="single flex-center" style={btn} onClick={() => b.updateTheme(c.id)}>
            <div className="inner flex-center" style={inner}>
                <div className="shadow" style={shadow}></div>
            </div>
        </button>
        )
    }
}

class LightDark extends Component {

    updateMode(i) {
        i.is_dark = i.is_dark === true ? false : true;
        this.context.isDark(i.is_dark);
    }

    static contextType = ThemeContext;
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const slider = {
            backgroundImage: a.grad,
            boxShadow: `0 0 10px ${a.hex.primary}, 0 0 10px ${a.hex.secondary}`
        }
        
        return (
            <label className='switch'>
                <input type='checkbox' onChange={() => this.updateMode(a)} defaultChecked={a.is_dark} />
                <div className='slider' style={slider}>
                    <div className="pointer flex-center" style={{ backgroundColor: a.mode }}>
                        <i className="fas fa-sun" style={{ color: a.hex.primary }}></i>
                        <i className="fas fa-moon" style={{ color: a.hex.secondary}}></i>
                    </div>
                </div>
            </label>
        )        
    }
}

class FooterNav extends Component {

    static contextType = ThemeContext;
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        let i = {
            backgroundImage: a.grad
        }
        let e = {
            backgroundColor: a.mode
        }
        let menu = {
            animation: `rotate 3s linear infinite`,
            backgroundImage: a.grad
        }
        return (
            <ul className="flex-center footer-nav w-100" style={{color: a.rev}}>
                <li style={e}>
                    <a href="https://www.facebook.com/marcos.centeno.75" rel="noopener noreferrer" target="_blank">
                        <i style={i} className="fab fa-facebook"></i>
                    </a>
                </li>
                <li style={e}>
                    <a href="https://github.com/marcoscenteno89" rel="noopener noreferrer" target="_blank">
                        <i style={i} className="fab fa-github"></i>
                    </a>
                </li>
                <li style={e}>
                    <a href="mailto:marcoscenteno89@gmail.com" rel="noopener noreferrer" target="_blank">
                        <i style={i} className="fas fa-envelope"></i>
                    </a>
                </li>
                <li style={e} className="menu flex-center"><i style={menu} className="fab fa-ethereum"></i></li>
                <li style={e}>
                    <a href="https://www.linkedin.com/in/marcos-centeno-0b1a7b65/" rel="noopener noreferrer" target="_blank">
                        <i style={i} className="fab fa-linkedin"></i>
                    </a>
                </li>
                <li style={e}>
                    <a href="https://stackoverflow.com/users/8151467/marcos-centeno" rel="noopener noreferrer" target="_blank">
                        <i style={i} className="fab fa-stack-overflow"></i>
                    </a>
                </li>
                <li style={e}>
                    <a href="https://www.pinterest.com/marcoscenteno75" rel="noopener noreferrer" target="_blank">
                        <i style={i} className="fab fa-pinterest-square"></i>
                    </a>
                </li>
            </ul>
        )
    }
}

export default Footer;
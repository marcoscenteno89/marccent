import React, { Component,Fragment } from "react";
import { ThemeContext } from "../var"
import Carousel from "react-elastic-carousel";
import { FooterText, GetMode, Button } from "./inc"
import '../../styles/inc/Footer.scss';
import Modal from 'react-modal';

class Footer extends Component {

    static contextType = ThemeContext;

    state = {
        showForm: false,
        primary: this.context.active.hex.primary,
        secondary: this.context.active.hex.secondary
    }

    showForm = () => {
        this.setState({
            showForm: this.state.showForm ? false : true
        });
    }
    addTheme = () => {
        this.context.addTheme(this.state)
    }
    primary = e => this.setState({ primary: e.target.value});
    secondary = e => this.setState({ secondary: e.target.value});

    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const b = this.state;
        const breakPoints = [
            {width: 368, itemsToShow: 2},
            {width: 468, itemsToShow: 3},
            {width: 568, itemsToShow: 5},
            {width: 668, itemsToShow: 6},
            {width: 768, itemsToShow: 7},
        ]

        const popup = {
            overlay: {
              backgroundColor: 'rgba(56,61,68,0.2)',
            },
            content: {
                color: a.rev,
                filter: `drop-shadow(0 0 10px rgba(0,0,0,0.8))`
            }
        }

        const headingBreak = {
            background: `
                radial-gradient(circle at bottom left, rgba(0,0,0,0) 2rem, ${a.hex.primary} 2rem) bottom left,
                radial-gradient(circle at bottom right, rgba(0,0,0,0) 2rem, ${a.hex.secondary} 2rem) bottom right`,
            backgroundSize: '2rem 100%',
            backgroundRepeat: 'no-repeat'
        }
        const bodyBreak = {
            background: `
                radial-gradient(circle at top left, rgba(0,0,0,0) 2rem, ${a.mode} 2rem) top left,
                radial-gradient(circle at top right, rgba(0,0,0,0) 2rem, ${a.mode} 2rem) top right`,
            backgroundSize: '50% 100%',
            backgroundRepeat: 'no-repeat'
        }

        let background = `main-footer flex-center${a.glass ? ' glass' : ''}`;
        
        return  (
            <footer className={background} style={{backgroundColor: a.mode}}>
                <div className="container" style={{paddingTop: '1rem'}}>
                    <FooterNav />
                    <div className="m-10 flex-center">
                        <LightDark />
                        <Glass />
                    </div>
                    <div className="flex-row">
                        <Carousel breakPoints={breakPoints}>
                            <button key={0} className="single flex-center" onClick={() => this.showForm()}>
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
                <Modal style={popup} className="modal" overlayClassName="overlay" isOpen={b.showForm}>
                    <div style={{background: a.grad}} className="heading flex-center">
                        <div style={{backgroundColor: a.hex.primary}} className="left"></div>
                        <div style={{backgroundColor: a.hex.secondary}} className="right"></div>
                        <h2>Add Theme</h2>
                    </div>
                    <div style={headingBreak} className="break">
                        <div style={{background: a.grad}} className="grad"></div>
                    </div>
                    <div style={bodyBreak} className="break"></div>
                    <div style={{backgroundColor: a.mode}} className="body flex-center">
                        <form>
                            <h4>Select Primary Color</h4>
                            <input 
                                type="color" 
                                value={this.state.primary} 
                                style={{backgroundColor: a.rev}} 
                                onChange={this.primary} 
                            />
                            <h4>Select Secondary Color</h4>
                            <input 
                                type="color"
                                value={this.state.secondary} 
                                style={{backgroundColor: a.rev}} 
                                onChange={this.secondary} 
                            />
                            <div><i>Select same color for primary and secundary colors<br />for single colored theme.</i></div>
                        </form>
                        <div className="flex-center controller">
                            <Button styles={{background: a.grad}} className="btn" onClick={() => this.addTheme()} text="Submit" />
                            <Button styles={{background: a.grad}} className="btn" onClick={() => this.showForm()} text="Close" />
                        </div>
                    </div>
                </Modal>
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
        const mode = GetMode(a, 1);
        const btn = {
            backgroundImage: `linear-gradient(to right, ${c.primary}, ${c.secondary})`,
            boxShadow: `0px 0px 10px ${c.primary}, 0px 0px 10px ${c.secondary}`
        }
        let inner = {
            backgroundColor: mode,
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
        const mode = GetMode(a, 1);
        const slider = {
            backgroundImage: a.grad,
            boxShadow: `0 0 10px ${a.hex.primary}, 0 0 10px ${a.hex.secondary}`
        }
        
        return (
            <label className='switch'>
                <div className="name">MODE</div>
                <input type='checkbox' onChange={() => this.updateMode(a)} defaultChecked={a.is_dark} />
                <div className='slider' style={slider}>
                    <div className="pointer flex-center" style={{ backgroundColor: mode }}>
                        <i className="fas fa-sun" style={{ color: a.hex.primary }}></i>
                        <i className="fas fa-moon" style={{ color: a.hex.secondary}}></i>
                    </div>
                </div>
            </label>
        )        
    }
}

class Glass extends Component {

    updateMode(i) {
        i.glass = i.glass === true ? false : true;
        this.context.isGlass(i.glass);
    }

    static contextType = ThemeContext;
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const mode = GetMode(a, 1);
        const slider = {
            backgroundImage: a.grad,
            boxShadow: `0 0 10px ${a.hex.primary}, 0 0 10px ${a.hex.secondary}`
        }
        
        return (
            <label className='switch'>
                <div className="name">GLASS</div>
                <input type='checkbox' onChange={() => this.updateMode(a)} defaultChecked={a.glass} />
                <div className='slider' style={slider}>
                    <div className="pointer flex-center" style={{ backgroundColor: mode }}>
                        <i className="fas fa-toggle-off" style={{ color: a.hex.primary }}></i>
                        <i className="fas fa-toggle-on" style={{ color: a.hex.secondary}}></i>
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
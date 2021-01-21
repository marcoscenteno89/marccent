import React, { Component } from "react";
import Carousel from "react-elastic-carousel";
import { LinGrad, RevColor, FooterText } from "./inc"
import '.././styles/Footer.scss';

class Footer extends Component {

    render() {
        const footer = {};
        const footerTitle = {};
        if (this.props.data.active) {
            const a = this.props.data.active;
            footer.color = a.primary;
            footer.backgroundColor = a.mode;
            footer.filter= `drop-shadow(0 0 5px ${RevColor(a.mode)})`;
            footerTitle.backgroundColor = a.mode;
            footerTitle.color = RevColor(a.mode);
        }
        
        const breakPoints = [
            {width: 468, itemsToShow: 2},
            {width: 568, itemsToShow: 3},
            {width: 768, itemsToShow: 4},
            {width: 868, itemsToShow: 5},
            {width: 968, itemsToShow: 6},
        ]

        return  (
            <footer className="main-footer flex-center" style={footer}>
                <div className="container" style={{paddingTop: '1rem'}}>
                    <div className="flex-center footer-nav-container">
                        <FooterNav data={this.props.data.active} />
                    </div>
                    {/* <FooterText style={footerTitle} /> */}
                    <div className="m-20 flex-center">
                        <LightDark data={this.props.data.active} update={this.props.update} />
                    </div>
                    <div className="flex-row">
                        <Carousel breakPoints={breakPoints}>
                            {this.props.data.themes.map(single => (
                                <Choices key={single.id} data={single} active={this.props.data.active} update={this.props.update}  />
                            ))}
                        </Carousel>
                    </div>
                </div>
            </footer>
        )        
    }
}

class Choices extends Component {
    
    render() {
        if (this.props.active) this.props.data.mode = this.props.active.mode;
        const btn = {}
        const inner = {}
        const shadow = {}
        let classes = '';
        if (this.props.data) {
            const a = this.props.data;
            classes += `single flex-center single-${a.id}`;
            btn.backgroundImage = LinGrad(a.primary, a.secondary);
            btn.boxShadow = `0px 0px 10px ${a.primary}, 0px 0px 10px ${a.secondary}`;
            inner.background = a.mode;
            inner.boxShadow = `inset 0 0 5px ${a.primary}, inset 0 0 5px ${a.secondary}`;
            shadow.filter = `drop-shadow(-25px 0 9px ${a.primary}) drop-shadow(25px 0 9px ${a.secondary}) blur(2px)`;
            shadow.background = a.mode;
        }
        return (
        <button key={this.props.data.id} className={classes} style={btn} onClick={() => this.props.update(this.props.data)}>
            <div className="inner flex-center" style={inner}>
                <div className="shadow" style={shadow}></div>
            </div>
        </button>
        )
    }
}

class LightDark extends Component {

    updateMode(current) {
        current.mode = current.mode === '#FFFFFF' ? '#383d44' : '#FFFFFF';
        this.props.update(current);
    }

    render() {
        const i = this.props.data;
        const slider = {
            backgroundImage: `linear-gradient(to right, ${i.primary}, ${i.secondary})`,
            boxShadow: `0 0 15px ${i.primary}, 0 0 15px ${i.secondary}`
        }
        
        return (
            <label className='switch'>
                <input type='checkbox' onChange={() => this.updateMode(this.props.data)} defaultChecked={i.mode === '#FFFFFF' ? '' : 'checked'} />
                <div className='slider' style={slider}>
                    <div className="pointer flex-center" style={{ backgroundColor: i.mode }}>
                        <i className="fas fa-sun" style={{ color: i.primary }}></i>
                        <i className="fas fa-moon" style={{ color: i.secondary }}></i>
                    </div>
                </div>
            </label>
        )        
    }
}

class FooterNav extends Component {

    render() {
        const a = this.props.data;
        let i = {
            backgroundImage: LinGrad(a.primary, a.secondary)
        }
        let e = {
            backgroundColor: a.mode
        }
        let menu = {
            animation: `rotate 3s linear infinite`,
            backgroundImage: LinGrad(a.primary, a.secondary)
        }
        return (
            <ul className="flex-center footer-nav" style={{color: RevColor(a.mode)}}>
                <li style={e}><i style={i} className="fab fa-facebook"></i></li>
                <li style={e}><i style={i} className="fab fa-github"></i></li>
                <li style={e}><i style={i} className="fas fa-envelope"></i></li>
                <li style={e} className="menu flex-center"><i style={menu} className="fab fa-ethereum"></i></li>
                <li style={e}><i style={i} className="fab fa-linkedin"></i></li>
                <li style={e}><i style={i} className="fab fa-instagram-square"></i></li>
                <li style={e}><i style={i} className="fab fa-pinterest-square"></i></li>
            </ul>
        )
    }
}

export default Footer;
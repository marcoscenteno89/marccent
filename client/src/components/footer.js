import React, { Component } from "react";
import Carousel from "react-elastic-carousel";
import '.././styles/Footer.scss';

class Footer extends Component {

    render() {
        const styles = {}
        if (this.props.data.active) {
            const a = this.props.data.active;
            styles.color = a.primary;
            styles.backgroundColor = a.mode;
        }
        const breakPoints = [
            {width: 468, itemsToShow: 2},
            {width: 568, itemsToShow: 3},
            {width: 668, itemsToShow: 4},
            {width: 768, itemsToShow: 5},
            {width: 868, itemsToShow: 6},
            {width: 968, itemsToShow: 7},
            {width: 1068, itemsToShow: 8}
        ]

        return  (
            <footer className="main-footer flex-center" style={styles}>
                <div className="container">
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
            // if (a.active === 1) styles.animation = `glow-${a.name} 1s ease-in-out infinite alternate`;
            btn.backgroundImage = `linear-gradient(to right, ${a.primary}, ${a.secondary})`;
            btn.boxShadow = `0px 0px 10px ${a.primary}, 0px 0px 10px ${a.secondary}`;
            inner.background = this.props.data.mode;
            inner.boxShadow = `inset 0 0 5px ${a.primary}, inset 0 0 5px ${a.secondary}`;
            shadow.filter = `drop-shadow(-25px 0 13px ${a.primary}) drop-shadow(25px 0  13px ${a.secondary}) blur(3px)`;
            shadow.background = this.props.data.mode;
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
        current.mode = current.mode === '#FFF' ? '#383d44' : '#FFF';
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
                <input type='checkbox' onChange={() => this.updateMode(this.props.data)} defaultChecked={i.mode === '#FFF' ? '' : 'checked'} />
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

export default Footer;
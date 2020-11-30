import React, { Component } from "react";
import '.././styles/Footer.scss';

class Footer extends Component {

    render() {
        
        const styles = {}
        if (this.props.data.active) {
            const a = this.props.data.active;
            styles.color = a.primary;
            styles.backgroundColor = a.mode;
        } 

        return  (
            <footer className="main-footer flex-center" style={styles}>
                <div className="container">
                    <div className="m-20 flex-center">
                        <LightDark data={this.props.data.active} update={this.props.update} />
                    </div>
                    <div className="flex-row">
                        {this.props.data.themes.map(single => (
                            <Choices key={single.id} data={single} active={this.props.data.active} update={this.props.update}  />
                        ))}
                    </div>
                </div>
            </footer>
        )        
    }
}

class Choices extends Component {
    
    render() {
        if (this.props.active) this.props.data.mode = this.props.active.mode;
        const styles = {}
        let classes = '';
        if (this.props.data) {
            const a = this.props.data;
            classes += `single single-${a.id}`;
            // if (a.active === 1) styles.animation = `glow-${a.name} 1s ease-in-out infinite alternate`;
            styles.backgroundImage= `linear-gradient(to right, ${a.primary}, ${a.secondary})`;
        }
        
        return (
            <button key={this.props.data.id} style={styles} className={classes} onClick={() => this.props.update(this.props.data)}></button>
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
        return (
            <label className='switch'>
                <input type='checkbox' onChange={() => this.updateMode(this.props.data)} defaultChecked={i.mode === '#FFF' ? '' : 'checked'} />
                <div className='slider' style={{backgroundImage: `linear-gradient(to right, ${i.primary}, ${i.secondary})`}}>
                    <div className="pointer flex-center" style={{ backgroundColor: i.mode }}>
                        <i className="fas fa-sun" style={{ color: i.mode === '#FFF' ? i.primary : i.secondary }}></i>
                        <i className="fas fa-moon" style={{ color: i.mode === '#FFF' ? i.primary : i.secondary }}></i>
                    </div>
                </div>
            </label>
        )        
    }
}

export default Footer;
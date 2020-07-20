import React, { Component } from "react";
const url = "http://localhost:5000/api/theme";

class Theme extends Component {

    constructor(props) {
        super(props);
        this.state = {
            themes: false,
            active: false,
        }
    }

    async componentDidMount() {
        let themes = JSON.parse(sessionStorage.getItem('themes'));
        if (!themes) {
            const res = await fetch(url);
            themes = await res.json();
            sessionStorage.setItem('themes', JSON.stringify(themes));
        } 
        
        this.setState({
            themes: themes,
            active: themes.filter(i => i.active === 1)[0],
        }, () => {
            document.body.style.backgroundColor = this.state.active.primary_color;
            document.body.style.color = this.state.active.primary_color;
            this.renderCss();
        });
    }
    
    updateList(themes, active) {
        console.log(themes, active);
        this.setState({
            themes: themes,
            active: active,
        }, () => {
            document.body.style.backgroundColor = this.state.active.primary_color;
            document.body.style.color = this.state.active.primary_color;
            sessionStorage.setItem('themes', JSON.stringify(themes));
        });
    }

    renderCss() {
        if (this.state.themes) {
            let link  = document.createElement('style');
            link.type = 'text/css';
            let text = 'nav {}';
            this.state.themes.map(a => (
                text += `
                .single-${a.name}:hover {
                    animation: glow-${a.name} 1s ease-in-out infinite alternate;
                }
                @keyframes glow-${a.name} {
                    from {box-shadow: 0 0 10px #fff, 0 0 30px #fff, 0 0 50px ${a.primary_color}, 0 0 60px ${a.primary_color};}
                    to { box-shadow: 0 0 20px #fff, 0 0 40px #fff, 0 0 60px ${a.primary_color}, 0 0 70px ${a.primary_color};}
                }`
            ));
            link.innerHTML = `<style>${text}</style>`;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }

    render() {
        if (this.state.themes === false) return <footer className="theme">No theme found</footer>
        
        return (
            <footer className="theme">
                <div className="container">
                    {this.state.themes.map(single => (
                        <Choices key={single.id} data={single} updateList={this.updateList.bind(this)}></Choices>
                    ))}
                </div>
            </footer>
        )
    }
}

class Choices extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data.id,
            name: this.props.data.name,
            primary_color: this.props.data.primary_color,
            secundary_color: this.props.data.secundary_color,
            is_dark: this.props.data.is_dark,
            active: this.props.data.active,
            expired: this.props.data.expired,
            expiration_date_time: this.props.data.expiration_date_time,
        }
    }
    update(active) {
        const themes = JSON.parse(sessionStorage.getItem('themes'));
        for (let theme of themes) {
            if (theme.active === 1) {
                theme.active = 0;
                document.querySelector(`.single-${theme.name}`).style.animation = '';
            }
            if (theme.id === active.id) theme.active = 1;
        }
        
        this.setState({
            active: 1, 
        }, () => this.props.updateList(themes, this.state));
    }

    render() {
        const style = {}
        const classes = `single single-${this.state.name}`;
        if (this.state.active === 1) style.animation = `glow-${this.state.name} 1s ease-in-out infinite alternate`;

        return (
            <button 
                key={this.state.id} className={classes} style={style} onClick={() => this.update(this.state)}>
                <i className="fas fa-fan small" style={{color: this.state.primary_color}}></i>
                <i className="fas fa-globe median" style={{color: this.state.primary_color}}></i>
                <i className="fab fa-hornbill large" style={{color: this.state.primary_color}}></i>
            </button>
        )
    }
}
export default Theme;
import React, { Component, Fragment } from 'react';
import Nav from './nav';
import Footer from './footer';
import Container from './container';
const url = "http://localhost:5000/api/theme";

class Theme extends Component {

    constructor(props) {
        super(props);
        this.state = {
            themes: false,
            active: false,
        }
        this.update = this.update.bind(this);
    }

    async componentDidMount() {
        let themes = JSON.parse(sessionStorage.getItem('themes'));
        let active = JSON.parse(sessionStorage.getItem('active'));
        if (!themes) {
            const res = await fetch(url);
            themes = await res.json();
            sessionStorage.setItem('themes', JSON.stringify(themes));
        } 
        if (!active) {
            active = themes[0];
            active.mode = '#FFF';
            sessionStorage.setItem('active', JSON.stringify(active));
        }
        
        this.setState({
            themes: themes,
            active: active
        }, () => this.renderCss());
    }

    update(active) {
        if (!active.mode) active.mode = this.state.active.mode;
        this.setState({
            active: active,
        }, () => sessionStorage.setItem('active', JSON.stringify(active)));
    }

    renderCss() {
        if (this.state.themes) {
            let link  = document.createElement('style');
            link.type = 'text/css';
            let text = 'nav {}';
            this.state.themes.map(a => (
                text += `
                .single-${a.id}:hover {
                    animation: glow-${a.id} 1s ease-in-out infinite alternate;
                }
                @keyframes glow-${a.id} {
                    from {box-shadow: 0 0 0px #fff, 0 0 10px #fff, 0 0 20px ${a.primary}, 0 0 30px ${a.primary};}
                    to { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px ${a.primary}, 0 0 40px ${a.primary};}
                }`
            ));
            link.innerHTML = `<style>${text}</style>`;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }

    render() {
        if (this.state.themes === false) return <Fragment>No theme found</Fragment>
        return (
            <Fragment>
                <Nav data={this.state.active} />
                <Container data={this.state.active} />
                <Footer data={this.state} update={this.update} />
            </Fragment>
        )
    }
}

export default Theme;
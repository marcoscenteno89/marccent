import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../styles/Global.scss';
import '../styles/keyframes.scss';
import { Background, RevColor, LinGrad, Notebook, toRgb } from "./inc/inc";
import Nav from './inc/main-nav';
import Footer from './inc/footer';
import Urls from './urls';
const url = "http://localhost:1337/themes";

class Theme extends Component {

    constructor(props) {
        super(props);
        this.state = {
            themes: false,
            active: false,
            // path: `${window.location.pathname}${window.location.search}`
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
            active.mode = '#FFFFFF';
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
                    animation: glow-${a.id} 2s ease-in-out infinite alternate;
                }
                @keyframes glow-${a.id} {
                    from {
                        filter: 
                        drop-shadow(0 0 0.01rem #fff) 
                        drop-shadow(0 0 0.02rem ${a.primary});
                    }
                    to {
                        filter: 
                        drop-shadow(0 0 0.1rem #fff) 
                        drop-shadow(0 0 0.2rem #fff) 
                        drop-shadow(0 0 0.3rem ${a.primary});
                    }
                }`
            ));
            link.innerHTML = `<style>${text}</style>`;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }

    render() {
        if (this.state.themes === false) return <Fragment>No theme found</Fragment>

        const a = this.state.active;
        const bg = {backgroundImage: LinGrad(a.primary, a.secondary)}
        const page = {
            backgroundImage: LinGrad(a.primary, a.secondary),
            color: RevColor(a.mode)
        }
        const cont = {
            color: RevColor(a.mode), 
        }
        return (
            <Fragment>
                <BrowserRouter>
                <Nav data={a} />
                <div className="page flex-center" style={page}>
                    <Background styles={bg} />
                    <div className="content" style={cont}>
                        <Urls data={a} />
                    </div>
                </div>
                <Footer data={this.state} update={this.update} />
                </BrowserRouter> 
            </Fragment>
        )
    }
}

export default Theme;
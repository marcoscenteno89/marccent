import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import '../styles/Global.scss';
import '../styles/keyframes.scss';
import { Background, RevColor, LinGrad } from "./inc";
import About from "./pages/about";
import Contact from "./pages/contact";
import Nav from './main-nav';
import Footer from './footer';
import Portfolio from './pages/portfolio';
import MineSweeper from "./minesweeper";
import Temperature from "./temperature";
import AppNav from "./app-nav";
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
            <Fragment><BrowserRouter>
                <Nav data={a} />
                <div className="page flex-center" style={page}>
                    <Background styles={bg} />
                    <div className="content" style={cont}>
                        <Route path="/portfolio"><Portfolio data={a}/></Route>
                        <Route path="/about"><About data={a}/></Route>
                        <Route path="/contact"><Contact data={a}/></Route>
                        <Route path="/apps/minesweeper"><MineSweeper data={a} /></Route>
                        <Route path="/apps/temp"><Temperature data={a} /></Route>
                        <Route exact path="/">
                            <section className="hero-banner flex-center">
                                <div className="container">
                                    <h1>Hello,</h1>
                                    <h1>I'm Marcos Centeno</h1>
                                    <h2>A Web Developer that specializes in front-end development</h2>
                                    <h4>Take a look around</h4>
                                </div>
                            </section>
                            <Temperature data={a} />
                            <Contact data={a}/>
                            <About data={a}/>
                            <Portfolio data={a}/>
                        </Route>
                    </div>
                </div>
                <Footer data={this.state} update={this.update} /> 
            </BrowserRouter></Fragment>
        )
    }
}

export default Theme;
import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Background, RevColor, LinGrad } from "./inc";
import About from "./pages/about";
import Apps from "./pages/apps";
import Contact from "./pages/contact";
import Nav from './main-nav';
import Footer from './footer';
import Portfolio from './pages/portfolio';
// import MineSweeper from "./minesweeper";
// import Temperature from "./temperature";
// import Maps from "./map";
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
            // backgroundImage: LinGrad(a.primary, a.secondary),
            margin: '3rem 5px 5rem 5px',
            color: RevColor(a.mode), 
        }
        const link = {color: a.primary}

        const mpCircle = {
            width: '90vw',
            height: '90vw',
            maxWidth: '768px',
            maxHeight: '768px',
            position: 'relative',
            borderRadius: '50%',
            overflow: 'hidden'
        }

        return (
            <Fragment><BrowserRouter>
                <Nav data={a} />
                <div className="page flex-center" style={page}>
                    <Background styles={bg} />
                    <div className="container" style={cont}>
                        <Route path="/portfolio"><Portfolio data={a}/></Route>
                        <Route path="/about"><About data={a}/></Route>
                        <Route path="/apps"><Apps data={a}/></Route>
                        <Route path="/contact"><Contact data={a}/></Route>
                        {/* <Route path="/minesweeper"><MineSweeper data={a} /></Route>
                        <Route path="/temp"><Temperature data={a} /></Route>
                        <Route path="/map"><div className="map-size" style={mpCircle}><Maps data={a} /></div></Route> */}
                        <Route path="/"></Route>
                    </div>
                </div>
                <Footer data={this.state} update={this.update} /> 
            </BrowserRouter></Fragment>
        )
    }
}

export default Theme;
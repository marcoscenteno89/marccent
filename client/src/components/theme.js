import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Background, RevColor, LinGrad } from "./inc";
import About from "./pages/about";
import Contact from "./pages/contact";
import Apps from "./pages/apps";
import Nav from './nav';
import Footer from './footer';
// import Container from './container';
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
        const styles = {
            backgroundImage: LinGrad(a.primary, a.secondary)
        }
        const page = {
            backgroundImage: LinGrad(a.primary, a.secondary),
            color: RevColor(a.mode)
        }

        return (
            <Fragment>
                <Nav data={a} />
                <div className="page flex-center" style={page}>
                    <Background styles={styles} />
                    <div className="container" style={{paddingBottom: '6rem'}}>
                        <BrowserRouter>
                            <Route path="/contact" render={() => <Contact data={a}/>} />
                            {/* <Title text="Applications" style={{backgroundColor: a.mode, color: RevColor(a.mode)}} /> */}
                            <Route path="/about" render={() => <About data={a}/>} />
                            <Route path="/apps" render={() => <Apps data={a}/>} />
                            {/* <FooterText style={{backgroundColor: a.mode, color: RevColor(a.mode)}} /> */}
                        </BrowserRouter>
                    </div>
                </div>
                <Footer data={this.state} update={this.update} />
            </Fragment>
        )
    }
}

export default Theme;
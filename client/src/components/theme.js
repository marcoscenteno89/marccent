import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '../styles/Global.scss';
import '../styles/keyframes.scss';
import { Background, RevColor } from "./inc/inc";
import Nav from './inc/main-nav';
import Footer from './inc/footer';
import Urls from './urls';
import { ThemeContext } from "./var"

class Theme extends Component {

    static contextType = ThemeContext;

    async componentDidMount() {
        await this.context.getThemes();
    }

    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        let rev = RevColor(a, 1);
        const page = {
            backgroundImage: a.grad,
            color: rev
        }
        return (
            <Fragment>
                <BrowserRouter>
                <Nav />
                <div className="page flex-center" style={page}>
                    <Background styles={{ backgroundImage: a.grad }} />
                    <div className="content" style={{ color: rev }}>
                        <Urls />
                    </div>
                </div>
                <Footer /> 
                </BrowserRouter> 
            </Fragment>
        )
    }
}

export default Theme;
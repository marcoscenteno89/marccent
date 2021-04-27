import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '../styles/Global.scss';
import '../styles/keyframes.scss';
import { Background } from "./inc/inc";
import Nav from './inc/main-nav';
import Footer from './inc/footer';
import Urls from './urls';
import { ThemeContext } from "./var"

class Theme extends Component {

    static contextType = ThemeContext;

    componentDidMount() {
        this.context.getThemes();
    }

    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const body = {
            backgroundImage: a.grad,
            color: a.rev
        }
        return (
            <div className="body" style={body}>
                <Background styles={{ backgroundImage: a.grad }} />
                <BrowserRouter>
                <Nav />
                <div className="page flex-center">
                    <div className="content">
                        <Urls />
                    </div>
                </div>
                <Footer /> 
                </BrowserRouter> 
            </div>
        )
    }
}

export default Theme;
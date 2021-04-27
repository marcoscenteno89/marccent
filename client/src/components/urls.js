import React, { Component, Fragment } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import About from "./pages/about";
import Contact from "./pages/contact";
import Portfolio from './pages/portfolio';
import PrivacyPolicy from './pages/privacy-policy';
import HeroBanner from './sections/hero-banner';
import Apps from './pages/apps';
import MineSweeper from "./mini-app/minesweeper";
import Temperature from "./mini-app/temperature";

class Urls extends Component {
   
    render() {
        return (
            <Fragment>
            <Switch>
                <Route path="/portfolio"><Portfolio /></Route>
                <Route path="/about"><About /></Route>
                <Route path="/contact"><Contact /></Route>
                <Route path="/privacy-policy"><PrivacyPolicy /></Route>
                <Route exact path="/">
                    <HeroBanner />
                    <About />
                    <Temperature />
                    <Apps />
                    <Portfolio />
                    <Contact />
                </Route>
                <Route>
                    <Route path="/apps/minesweeper"><MineSweeper /></Route>
                    <Route path="/apps/temp"><Temperature /></Route>
                    <Apps />
                </Route>
            </Switch>
            </Fragment>
        )
    }
}

export default Urls;
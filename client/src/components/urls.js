import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import About from "./pages/about";
import Contact from "./pages/contact";
import Portfolio from './pages/portfolio';
import PrivacyPolicy from './pages/privacy-policy';
import HeroBanner from './sections/hero-banner'
import MineSweeper from "./mini-app/minesweeper";
import Temperature from "./mini-app/temperature";

class Urls extends Component {
   
    render() {
        const a = this.props.data;
        return (
            <Fragment>
                <Switch>
                    <Route path="/portfolio"><Portfolio data={a}/></Route>
                    <Route path="/about"><About data={a}/></Route>
                    <Route path="/contact"><Contact data={a}/></Route>
                    <Route path="/apps/minesweeper"><MineSweeper data={a} /></Route>
                    <Route path="/apps/temp"><Temperature data={a} /></Route>
                    <Route path="/privacy-policy"><PrivacyPolicy data={a} /></Route>
                    <Route exact path="/">
                        <HeroBanner data={a} />
                        <About data={a}/>
                        <Temperature data={a} />
                        <Portfolio data={a}/>
                        <Contact data={a}/>
                    </Route>
                </Switch>
            </Fragment>
        )
    }
}

export default Urls;
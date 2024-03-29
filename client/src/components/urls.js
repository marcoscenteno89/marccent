import React, { Component, lazy, Suspense, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import HeroBanner from "./sections/hero-banner";
const Contact = lazy(() => import("./pages/contact"));
const Portfolio = lazy(() => import("./pages/portfolio"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const Animations = lazy(() => import("./pages/animations"));
const Apps = lazy(() => import("./pages/apps"));
const MineSweeper = lazy(() => import("./mini-app/minesweeper"));
const Temperature = lazy(() => import("./mini-app/temperature"));
const NumPuz = lazy(() => import("./mini-app/numpuz"));
const About = lazy(() => import("./pages/about"));

class Urls extends Component {
   
  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path="/"><HeroBanner /></Route>
        </Switch>
        <Switch>
          <Suspense fallback={<h2>Loading...</h2>}>
            <Route path="/portfolio"><Portfolio /></Route>
            <Route path="/about"><About /></Route>
            <Route path="/contact"><Contact /></Route>
            <Route path="/privacy-policy"><PrivacyPolicy /></Route>
            <Route path="/animations"><Animations /></Route>
            <Route exact path="/">
              <About />
              <Portfolio />
              <Temperature />
              <Apps />
              <Contact />
            </Route>
            <Route path="/apps">
              <Route path="/apps/minesweeper"><MineSweeper /></Route>
              <Route path="/apps/temp"><Temperature /></Route>
              <Route path="/apps/numpuz"><NumPuz /></Route>
              <Apps />
            </Route>
          </Suspense>
        </Switch>
      </Fragment> 
    )
  }
}

export default Urls;
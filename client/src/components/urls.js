import React, { Component, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import HeroBanner from "./sections/hero-banner";
const Temperature = lazy(() => import("./mini-app/temperature"));
const Contact = lazy(() => import("./pages/contact"));
const Portfolio = lazy(() => import("./pages/portfolio"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const Animations = lazy(() => import("./pages/animations"));
const MineSweeper = lazy(() => import("./mini-app/minesweeper"));
const NumPuz = lazy(() => import("./mini-app/numpuz"));
const About = lazy(() => import("./pages/about"));

export default class Urls extends Component {
  render() {
    return (
      <Suspense  fallback={<h2>Loading...</h2>}>
        <Routes>
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/animations" element={<Animations />} />
          <Route exact path="/" element={[
            <HeroBanner key={0} />, 
            <About key={1} />, 
            <Portfolio key={2} />, 
            <Temperature key={3} />,  
            <Contact key={5} />
          ]} />
          <Route path="/apps/minesweeper" element={<MineSweeper key={0} />} />
          <Route path="/apps/temp" element={<Temperature key={0} />} />
          <Route path="/apps/numpuz" element={<NumPuz key={0} />} />
        </Routes>
      </Suspense> 
    )
  }
}
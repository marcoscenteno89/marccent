import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '../styles/Global.scss';
import '../styles/keyframes.scss';
import Nav from './inc/main-nav';
import { Blob, LinesCircles } from './inc/canvas';
import Footer from './inc/footer';
import { ThemeContext } from "./var"
import Urls from './urls';
import { LoadScript } from '@react-google-maps/api';

class Theme extends Component {

  static contextType = ThemeContext;

  componentDidMount() {
    this.context.getThemes();
  }

  render() {
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
    let a = this.context.theme;
    const body = {
      backgroundImage: this.context.theme.grad,
      color: this.context.theme.rev
    }
    let rev = !a.is_dark ? a.hex.dark : a.hex.light;
    let mode = a.is_dark ? a.hex.dark : a.hex.light;
    return (
      <div className="body" style={body}>
        <Blob color={mode} className="bg" count="15" />
        {/* <LinesCircles color={mode} className="bg" count="20" /> */}
        <BrowserRouter>
          <Nav />
          <div className="page">
            <div className="content">
              <Urls />
            </div>
          </div>
          <Footer />
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API} />
        </BrowserRouter> 
      </div>
    )
  }
}
export default Theme;
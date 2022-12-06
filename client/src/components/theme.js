import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '../styles/Global.scss';
import '../styles/keyframes.scss';
import { BlobContainer, Blob } from "./inc/inc";
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
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;

    const body = {
      backgroundImage: a.grad,
      color: a.rev
    }
    
    return (
      <div className="body" style={body}>
        <BlobContainer>
          <Blob y={20} x={5} min={15} max={22} count={10} ydirection="top" xdirection="left" styles={{background: a.mode}} />
          <Blob y={5} x={5} min={10} max={17} count={10} ydirection="bottom" xdirection="right" styles={{background: a.mode}} />
          <Blob y={50} x={50} min={5} max={12} count={10} ydirection="top" xdirection="left" styles={{background: a.mode}} />
        </BlobContainer>
        <BrowserRouter>
          <Nav />
          <div className="page">
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
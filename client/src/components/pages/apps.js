import React, { Component, Fragment } from "react";
import '../../styles/pages/Portfolio.scss';
import { ThemeContext } from "../var";
import AppNav from "../inc/app-nav";

class Apps extends Component {
    
  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const pg = {
      backgroundColor: a.mode,
      padding: '20px'
    }
    let background = `container${a.glass ? ' glass' : ''}`;
    return  (
      <section className="container-fluid page-apps">
        <div className={background} style={pg}>
          <AppNav />
        </div>
      </section>
    )        
  }
}

export default Apps;
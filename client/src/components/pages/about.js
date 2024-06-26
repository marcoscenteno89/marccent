import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var"
import '../../styles/pages/About.scss';
import { Img } from "../inc/inc";
import { SpCircle } from "../inc/shapes";
import { StatusBar } from "../inc/inc-classes";
import header from "../../media/img2.webp";
import profile from "../../media/mcr.webp";

class About extends Component {
    
  static contextType = ThemeContext;
  time = x => {
    const year = x === 1 ? 'Year' : 'Years';
    return `${x} ${year}`;
  }
  render() {
    if (!this.context.theme.id) return <Fragment>Loading Navigation...</Fragment>
    const a = this.context.theme;
    const circle = {
      circle: {
        backgroundColor: a.mode,
      },
      innerCircle: {
        backgroundColor: a.mode,
      },
      grad: {
        backgroundImage: a.grad,
        boxShadow: '0 0 1rem rgba(0,0,0,0.5)',
      }
    }
    const icon = {
      color: a.hex.primary,
      width: '15%'
    }
    const icons = [
      {icon: <i style={icon} className="fab fa-html5"></i>, bar: {current: 5, total: 5}},
      {icon: <i style={icon} className="fab fa-css3-alt"></i>, bar: {current: 5, total: 5}},
      {icon: <i style={icon} className="fab fa-js-square"></i>, bar: {current: 5, total: 5}},
      {icon: <i style={icon} className="fab fa-react"></i>, bar: {current: 1, total: 5}},
      {icon: <i style={icon} className="fab fa-node"></i>, bar: {current: 1, total: 5}},
      {icon: <i style={icon} className="fab fa-php"></i>, bar: {current: 4, total: 5}},
      {icon: <i style={icon} className="fab fa-wordpress"></i>, bar: {current: 4, total: 5}},
      {icon: <i style={icon} className="fab fa-python"></i>, bar: {current: 1, total: 5}},
      {icon: <i style={icon} className="fab fa-sass"></i>, bar: {current: 1, total: 5}},
      {icon: <i style={icon} className="fab fa-git-square"></i>, bar: {current: 2, total: 5}},
      {icon: <i style={icon} className="fab fa-linux"></i>, bar: {current: 2, total: 5}},
      {icon: <i style={icon} className="fab fa-ubuntu"></i>, bar: {current: 2, total: 5}},
      {icon: <i style={icon} className="fas fa-database"></i>, bar: {current: 4, total: 5}},
      {icon: <i style={icon} className="fab fa-aws"></i>, bar: {current: 1, total: 5}}
    ]
    const yr = {
      color: a.hex.secondary, 
      paddingLeft: '5px'
    }
    const img = {
      backgroundImage: `url('${header}')`,
      height: '15rem'
    }
    
    const barStyles = {
      backgroundImage: a.grad,
      color: a.hex.light
    }
    let background = `container${a.glass ? ' glass' : ''}`;
    return  (
      <section className="container-fluid page-about">
        <div className={background} style={{backgroundColor: a.mode}}>
          <div className="image" style={img} />
          <div className="con flex-center">
            <div className="circle-con">
              <SpCircle styles={circle} data={a}>
                <Img src={profile} alt="Marcos Centeno profile picture" />
              </SpCircle>
            </div>
          </div>
            <div className="container row p-3">
              <div className="col-4">
                <div className="shadow p-3">
                  {icons.map((single, index) => (
                    <div className="flex-row" key={index}>
                      {single.icon}
                      <div style={{width: '50%', paddingLeft: '5px'}}>
                        <StatusBar bar={single.bar} styles={barStyles} />
                      </div>
                      <div style={yr}> {this.time(single.bar.current)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-8">
                <div className="shadow p-3">
                  <div className="title">
                    <strong>Safelink Internet</strong>, Idaho Falls, ID — <em style={{color: a.hex.secondary}}>Web Developer</em>
                  </div>
                  <br />
                  <em>Feb 2016 - <span style={{color: a.hex.secondary}}>PRESENT</span></em>
                  <hr />
                  <ul>
                    <li>Build & maintain Safelink Internet websites as part of our marketing team.</li>
                    <li>Wordpress Plugin and Theme development, using PHP, MySQL, HTML, CSS and Javascript.</li>
                    <li>Work with our graphic designer to build front-end animations mainly using CSS animations and Vanilla Javascript, (sometimes jQuery).</li>
                    <li>Develop and update python websites using Django framework, jQuery and Bootstrap.</li>
                    <li>Make sure that websites follow responsive and Cross-Browser standards.</li>
                    <li>Manage Linux containers on AWS EC2/S3 or our own servers for some of Safelink's Python/Django applications. The main tasks are build containers using Dockerfiles and Docker Compose, setup & configure NGINX servers, setup HTTPS encryption using letsencrypt.</li>
                    <li>Update Legacy code.</li>
                    <li>Help outline & modify sales processes based on our current needs.</li>
                    <li>Manage Website databases Mainly MySQL but sometimes PostgreSQL and SQLite.</li>
                    <li>Help come up with ideas that streamline our sales pipeline, Improve our tracking methods, overall improving the way we utilize our resources.</li>
                    <li>Build Mapping interfaces using Google Map API.</li>
                    <li>Develop and update Company web applications that integrate with third-party APIs: consuming data feeds (JSON), RESTful services</li>
                  </ul>
                </div>
              </div>
            </div>
        </div>
      </section>
    )        
  }
}

export default About;
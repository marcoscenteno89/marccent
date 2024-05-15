import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var"
import Pagination from 'rc-pagination';
import "rc-pagination/assets/index.css";
import ValidForm from 'react-valid-form-component';
import { CustDate, Img, GetMode } from "../inc/inc";
import { SpCircle } from "../inc/shapes";
import { Clock, Accordion } from "../inc/inc-classes";
import { Liquid } from '../inc/canvas';
import Map from "../map";
import AppNav from "../inc/app-nav";
const openWeather = `${process.env.REACT_APP_OPENWEATHERURL}data/2.5/forecast`;
const token = `&units=imperial&appid=${process.env.REACT_APP_OPENWEATHER}`;

class Temperature extends Component {

    static contextType = ThemeContext;
    state = {
      query: false,
      city: false
    }
    
    componentDidMount() {
      this.setState({
        query: 'Idaho Falls',
      }, () => this.update());
    }

    async update() {
      const res = await fetch(`${openWeather}?q=${this.state.query}${token}`);
      const data = await res.json();
      if (data.cod === "200") this.setState({ city: data });
    }

    onClick = () => this.update();

    onChange = (e) => this.setState({query: e.target.value});

    render() {
      if (!this.state.city) return <Fragment>Loading...</Fragment>
      if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
      const a = this.context.theme;
      const e = this.state.city;
      const sec = {
        background: a.mode,
      }
      const bg = {
        background: a.grad,
        color: a.hex.light
      }
      const input = {
        border: `solid 1px ${a.hex.primary}`,
        backgroundColor: a.mode,
        marginRight: '3px !important'
      }
      const map = {
        center: {
          lat: e.city.coord.lat,
          lng: e.city.coord.lon
        },
        zoom: 11
      }
      return  (
        <section className="container-fluid temp">
          <div className={`container${a.glass ? ' glass' : ''}`} style={sec}>
            <div className="header" style={{textAlign: 'center'}}>
              <h3>{e.city.name}'s Population: {e.city.population}</h3>
              <ValidForm 
                nosubmit 
                onSubmit={() => this.onClick()} 
                className="flex-center temp-form">
                <input 
                  name="city"
                  type="text" 
                  required
                  placeholder={this.state.query} 
                  style={input} 
                  onChange={this.onChange} 
                />
                <span style={{width: '10px'}}></span>
                <button className="btn" style={bg} type="submit">Send Form</button>
              </ValidForm>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="shadow flex-col-center p-3">
                  <TempCir temp={e.list[0]} />
                  <Map data={map} />
                  {/* <div className="map-size" style={{marginTop: '2rem', height: '400px'}}>
                    <Maps mapData={mapData} />
                  </div> */}
                </div>
              </div>
              <div className="col-6">
                <WeatherHistory list={e.list} />
              </div>
            </div>
            <AppNav key={0} />
          </div>
        </section>
      )        
    }
}

class WeatherHistory extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.list,
      currentList: [],
      current: 1,
      pageSize: 10
    }
    this.updatePage = this.updatePage.bind(this);
  }

  componentDidMount() {
    this.setState({ currentList: this.state.items.slice(0, this.state.pageSize) });
  }

  updatePage(current) {
    this.setState({
      current: current
    }, () => {
      const i = this.state;
      const to = i.pageSize * current;
      const from = to - i.pageSize;
      // update state with new page of items
      this.setState({ currentList: i.items.slice(from, to) }); 
    })
  }
  
  render() {
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const i = this.state;
    const paginationStyles = {
      a: {
        background: a.rev,
        borderColor: a.rev,
        color: a.mode
      }
    }

    return (
      <div className="flex-col list shadow p-3">
        <h3>Weather Forecast</h3>
        {i.currentList.map((item, index) => {
          let icon = `${process.env.REACT_APP_OPENWEATHERURL}img/w/${item.weather[0].icon}.png`;
          return <Accordion key={`accordion-temp-${index}`}>
            <span className="head-content">
              <Img src={icon} styles={{width: '40px'}} alt={item.weather[0].description} />
              <strong>{item.main.temp}&#176;</strong>
              <span><CustDate date={item.dt_txt}ver="2" /></span>
            </span>
            <div className="body-content flex-row">
              <div style={{width:'50%',padding: '0 0.5rem'}} className="flex-col">
                <strong>{item.weather[0].description}</strong>
                <span>Humidity: {item.main.humidity}</span>
              </div>
              <div style={{width:'50%',padding: '0 0.5rem'}} className="flex-col">
                <span>Low: {item.main.temp_min}</span>
                <span>High: {item.main.temp_max}</span>
                <span>Feels like: {item.main.feels_like}</span>
              </div>
            </div>
          </Accordion>
        })}
        <Pagination 
          total={i.items.length} 
          pageSize={i.pageSize} 
          onChange={this.updatePage} 
          current={i.current} />
      </div>
    )
  }
}

class TempCir extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      temp: this.props.temp
    }
  }

  render() {
    if (!this.context.theme.id) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const o = this.state.temp;
    const icon = `https://openweathermap.org/img/w/${o.weather[0].icon}.png`;
    const circle = {
      circle: {
        backgroundColor: a.mode,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
      },
      innerCircle: {
        backgroundColor: a.mode,
        boxShadow: 'inset 0 0 75px rgba(0,0,0,0.5)',
        width: '90%'
      },
      grad: {
        backgroundImage: a.grad,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
        width: '90%'
      }
    }
    const clockstyles = {
      border: `1px solid ${a.rev}`,
      text: a.rev,
      bg: GetMode(a, '0.5')
    }
    return (
      <SpCircle styles={circle} data={a}>
        <Liquid className="circle" />
        <div className="temp-cont-outer flex-center box-shadow circle">
          <div className="temp-cont-inner flex-col" style={{color: a.rev}}>
            <Img 
              src={icon} 
              styles={{width: '60%', marginBottom: '-1.5rem'}} 
              alt={o.weather[0].description} />
            <h3 style={{padding: '0', margin: '0.5rem'}}>{o.main.temp}&#176;</h3>
            <small><CustDate ver="1" /></small>
            <Clock data={clockstyles} />
          </div>
        </div>
      </SpCircle>
    )
  }
}
export default Temperature;
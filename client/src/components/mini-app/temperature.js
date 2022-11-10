import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var"
import JwPagination from 'jw-react-pagination';
import ValidForm from 'react-valid-form-component';
import "../../styles/mini-app/Temperature.scss";
import '../../styles/keyframes.scss';
import { CustDate, Img, SpCircle, GetMode } from "../inc/inc";
import { Clock, Accordion } from "../inc/inc-classes";
import Maps from "../map";
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
      if (data.cod === "200") {
        this.setState({
          city: data
        });
      } 
    }

    onClick = () => this.update();

    onChange = (e) => this.setState({query: e.target.value});

    render() {
      if (!this.state.city) return <Fragment>Loading...</Fragment>
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
      const mapData = {
        loc: {
          lat: e.city.coord.lat,
          lng: e.city.coord.lon
        },
        zoom: 11
      }
      let background = `container flex-row${a.glass ? ' glass' : ''}`;
      return  (
        <section className="temp flex-center">
          <div className={background} style={sec}>
            <div className="header flex-row w-100" style={{alignItems:'flex-start',padding:'1rem calc(3rem + 0.5%)'}}>
              <h3>{e.city.name}'s Population: {e.city.population}</h3>
              <ValidForm nosubmit onSubmit={(e) => this.onClick()} className="flex-row contact-info" style={{flexWrap: 'nowrap'}}>
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
            <div className="w-50" style={{padding: '0 1rem'}}>
              <TempCir temp={e.list[0]} />
              <div className="map-size" style={{marginTop: '2rem', height: '400px'}}>
                <Maps mapData={mapData} />
              </div>
            </div>
            <div className="w-50" style={{padding: '0 1rem'}}>
              <h3>Weather Forecast</h3>
              <WeatherHistory list={e.list} />
            </div>
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
      pageOfItems: []
    }
    this.onChangePage = this.onChangePage.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      items: props.list
    });
  }
  
  onChangePage(pageOfItems) {
    this.setState({ pageOfItems: pageOfItems }); // update local state with new page of items
  }
  
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const paginationStyles = {
      li: {
        background: a.rev,
        color: a.mode
      }
    }
    return (
      <div className="flex-row history">
        {this.state.pageOfItems.map((item, index) => (
          <List key={index} data={a} item={item} />
        ))}
        <JwPagination 
          pageSize={10} 
          items={this.state.items} 
          onChangePage={this.onChangePage}
          styles={paginationStyles}
        />
      </div>
    )
  }
}

class List extends Component {
    
  static contextType = ThemeContext;
  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const o = this.props.item;
    const icon = `${process.env.REACT_APP_OPENWEATHERURL}img/w/${o.weather[0].icon}.png`;
    const bg = {
      background: a.grad,
      color: a.hex.light
    }

    return (
      <div className="list-outer shadow-s" style={{background: a.mode}}>
        <div style={bg} className="list-inner shadow-xs">
        <Accordion>
          <span className="head-content">
            <Img src={icon} styles={{width: '40px'}} alt={o.weather[0].description} />
            <strong>{o.main.temp}&#176;</strong>
            <span><CustDate date={o.dt_txt}ver="2" /></span>
          </span>
          <div className="body-content flex-row">
            <div style={{width:'50%',padding: '0 0.5rem'}} className="flex-col">
              <strong>{o.weather[0].description}</strong>
              <span>Humidity: {o.main.humidity}</span>
            </div>
            <div style={{width:'50%',padding: '0 0.5rem'}} className="flex-col">
              <span>Low: {o.main.temp_min}</span>
              <span>High: {o.main.temp_max}</span>
              <span>Feels like: {o.main.feels_like}</span>
            </div>
          </div>
        </Accordion>
        </div>
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

  // UNSAFE_componentWillReceiveProps(props) {
  //   this.setState({
  //     temp: props.temp
  //   });
  // }

  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const o = this.state.temp;
    const prim = a.hex.primary;
    const sec = a.hex.secondary;
    const circle = {
      circle: {
        backgroundColor: a.mode,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
      },
      innerCircle: {
        backgroundColor: a.mode,
        boxShadow: 'inset 0 0 75px rgba(0,0,0,0.5)'
      },
      grad: {
        backgroundImage: a.grad,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
      }
    }
    const clockstyles = {
      border: `1px solid ${a.rev}`,
      text: a.rev,
      bg: GetMode(a, '0.5')
    }
    const icon = `https://openweathermap.org/img/w/${o.weather[0].icon}.png`;
    const grad = `linear-gradient(to bottom, ${sec}, ${prim})`;
    return (
      <SpCircle styles={circle} data={a}>
        <div className="water" style={{ background: grad }}></div>
        <div className="water-circle one" style={{ backgroundColor: a.mode }}></div>
        <div className="water-circle two" style={{ backgroundColor: a.mode }}></div>
        <div className="box-shadow"></div>
        <div className="temp-cont flex-col" style={{color: a.rev}}>
          <Img src={icon} styles={{width: '60%', marginBottom: '-1rem'}} alt={o.weather[0].description} />
          <h3 style={{padding: '0'}}>{o.main.temp}&#176;</h3>
          <small><CustDate ver="1" /></small>
          <Clock data={clockstyles} />
        </div>
      </SpCircle>
    )
  }
}
export default Temperature;
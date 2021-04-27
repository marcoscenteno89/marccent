import React, { Component, Fragment } from "react";
import { ThemeContext } from "../var"
import JwPagination from 'jw-react-pagination';
import "../../styles/mini-app/Temperature.scss";
import '../../styles/keyframes.scss';
import { Today, Blur, SpCircle } from "../inc/inc";
import Maps from "../map";
const openWeather = `${process.env.REACT_APP_OPENWEATHERURL}data/2.5/forecast`;
const token = `&units=imperial&appid=${process.env.REACT_APP_OPENWEATHER}`;
const url = 'http://api.openweathermap.org/';

class Temperature extends Component {

    static contextType = ThemeContext;
    constructor(props) {
        super(props);
        this.state = {
            query: false,
            city: false
        }
        this.update = this.update.bind(this);
        this.onClick = this.onClick.bind(this);
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

    onClick = e => {
        e.preventDefault();
        this.update();
    }

    onChange = (e) => {
        this.setState({query: e.target.value});
    }

    render() {
        if (!this.state.city) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
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
            backgroundColor: a.mode
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
                    <div className="header flex-row w-100">
                        <h1>{e.city.name}</h1>
                        <h3>Population: {e.city.population}</h3>
                        <form className="flex-center">
                            <input type="text" style={input} value={this.state.query} onChange={this.onChange} />
                            <button className="btn" style={bg} onClick={(e) => this.onClick(e)}>Update City</button>
                        </form>
                    </div>
                    <div className="w-50 flex-col" style={{alignItems: 'center'}}>
                        <TempCir temp={e.list[0]} />
                        <div className="map-size" style={{marginTop: '2rem'}}>
                            <Maps mapData={mapData} />
                        </div>
                    </div>
                    <div className="w-50">
                        <h3>Weather History</h3>
                        <WeatherHistory list={e.list} />
                    </div>
                </div>
            </section>
        )        
    }
}

class List extends Component {
    
    static contextType = ThemeContext;
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        const o = this.props.item;
        const list = {
            backgroundImage: `url('${url}img/w/${o.weather[0].icon}.png')`,
            height: '50px'
        }
        const bg = {
            background: a.grad,
            color: a.hex.light
        }
        return (
            <div className="list-outer shadow-s" style={{background: a.mode}}>
                <div style={bg} className="list-inner shadow-xs">
                    <div className="transparent flex-row">
                        <div className="image" style={list} />
                        <strong className="one">{o.main.temp}&#176;</strong>
                        <div className="container">
                            <div className="flex-row table">
                                <span>{o.dt_txt}</span>
                            </div>
                            <div className="flex-row table">
                                <span className="one">Feels like: {o.main.feels_like}</span>
                                <span className="two">Humidity: {o.main.humidity}</span>
                            </div>
                            <div className="flex-row table">
                                <span className="one">Low: {o.main.temp_min}</span>
                                <span className="two">High: {o.main.temp_max}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

    componentWillReceiveProps(props) {
        this.setState({
            items: props.list
        });
    }
    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems }); // update local state with new page of items
    }
    
    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
        return (
            <div className="flex-row history">
                {this.state.pageOfItems.map((item, index) => (
                    <List key={index} data={a} item={item} />
                ))}
                <JwPagination pageSize={8} items={this.state.items} onChangePage={this.onChangePage} />
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

    componentWillReceiveProps(props) {
        this.setState({
            temp: props.temp
        });
    }

    render() {
        if (this.context.active.id === 0) return <Fragment>Loading...</Fragment>
        const a = this.context.active;
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
        const list = {
            backgroundImage: `url('https://openweathermap.org/img/w/${o.weather[0].icon}.png')`,
            height: '3.5rem'
        }

        return (
            <SpCircle styles={circle} data={a}>
                <div className="temp-cont flex-col" style={{color: a.rev}}>
                    <div className="image" style={list} />
                    <h3>{o.main.temp}&#176;</h3>
                    <p><Today /></p>
                </div>
                <div className="third">
                    <div style={{backgroundColor: sec}}></div>
                    <div style={{backgroundColor: sec}}></div>
                    <div style={{backgroundColor: sec}}></div>
                </div>
                <div className="second">
                    <div style={{backgroundColor: prim}}></div>
                    <div style={{backgroundColor: prim}}></div>
                    <div style={{backgroundColor: prim}}></div>
                </div>
                <div className="first">
                    <div style={{backgroundColor: sec}}></div>
                    <div style={{backgroundColor: sec}}></div>
                    <div style={{backgroundColor: sec}}></div>
                </div>
                <Blur />
            </SpCircle>
        )
    }
}
export default Temperature;
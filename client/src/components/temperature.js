import React, { Component } from "react";
import JwPagination from 'jw-react-pagination';
import "../styles/Temperature.scss";
import '../styles/keyframes.scss';
import { Today, Blur, SpCircle, RevColor, LinGrad } from "./inc";
import AppNav from "./app-nav";
import Maps from "./map";
const openWeather = `http://api.openweathermap.org/data/2.5/forecast`;
const token = `&units=imperial&appid=${process.env.REACT_APP_OPENWEATHER}`;
// const token = '';

class Temperature extends Component {

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
        if (!this.state.city) return (<h1>Loading...</h1>);
        const e = this.state.city;
        console.log(e);
        const a = this.props.data;
        const sec = {
            background: a.mode,
            borderRadius: '5px'
        }
        const bg = {
            background: LinGrad(a.primary, a.secondary),
            color: '#FFF'
        }
        const input = {
            border: `solid 1px ${a.primary}`,
            backgroundColor: a.mode
        }
        const mapData = {
            loc: {
                lat: e.city.coord.lat,
                lng: e.city.coord.lon
            },
            zoom: 11
        }

        return  (
            <section className="temp flex-center">
                <div className="container flex-row" style={sec}>
                    <div className="header flex-row w-100">
                        <h1>{e.city.name}</h1>
                        <h3>Population: {e.city.population}</h3>
                        <form className="flex-center">
                            <input type="text" style={input} value={this.state.query} onChange={this.onChange} />
                            <button className="btn" style={bg} onClick={(e) => this.onClick(e)}>Update City</button>
                        </form>
                    </div>
                    <div className="w-50 flex-col" style={{alignItems: 'center'}}>
                        <TempCir data={a} temp={e.list[0]} />
                        <div className="map-size"><Maps mapData={mapData} data={a} /></div>
                    </div>
                    <div className="w-50">
                        <h3>Weather History</h3>
                        <WeatherHistory list={e.list} data={a} />
                    </div>
                    <AppNav data={a} />
                </div>
            </section>
        )        
    }
}

class List extends Component {
    
    render() {
        if (!this.props.data) return (<h1>Loading...</h1>);
        const a = this.props.data;
        const o = this.props.item;
        const list = {
            backgroundImage: `url('http://openweathermap.org/img/w/${o.weather[0].icon}.png')`,
            height: '50px'
        }
        const bg = {
            background: LinGrad(a.primary, a.secondary),
            color: '#FFF'
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
        if (!this.props.data) return (<h1>Loading...</h1>);
        const a = this.props.data;
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
        if (!this.props.data) return (<h1>Loading...</h1>);
        const a = this.props.data;
        const o = this.state.temp;
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
                backgroundImage: LinGrad(a.primary, a.secondary),
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
            }
        }
        const list = {
            backgroundImage: `url('http://openweathermap.org/img/w/${o.weather[0].icon}.png')`,
            height: '3.5rem'
        }

        return (
            <SpCircle styles={circle} data={a}>
                <div className="temp-cont flex-col" style={{color: RevColor(a.mode)}}>
                    <div className="image" style={list} />
                    <h3>{o.main.temp}&#176;</h3>
                    <p><Today /></p>
                </div>
                <div className="third">
                    <div style={{backgroundColor: a.secondary}}></div>
                    <div style={{backgroundColor: a.secondary}}></div>
                    <div style={{backgroundColor: a.secondary}}></div>
                </div>
                <div className="second">
                    <div style={{backgroundColor: a.primary}}></div>
                    <div style={{backgroundColor: a.primary}}></div>
                    <div style={{backgroundColor: a.primary}}></div>
                </div>
                <div className="first">
                    <div style={{backgroundColor: a.secondary}}></div>
                    <div style={{backgroundColor: a.secondary}}></div>
                    <div style={{backgroundColor: a.secondary}}></div>
                </div>
                <Blur />
            </SpCircle>
        )
    }
}
export default Temperature;
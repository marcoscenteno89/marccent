import React, { Component } from "react";
import "../styles/Temperature.scss";
import '../styles/keyframes.scss';
import { Today, Blur, SpCircle, RevColor } from "./inc";
import AppNav from "./app-nav";
const openWeather = `http://api.openweathermap.org/data/2.5/forecast`;

class Temperature extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: false,
        }
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        
        this.setState({
            query: 'Idaho%Falls,us',
        }, () => this.update());
    }

    async update() {
        const url = `${openWeather}?q=${this.state.query}&appid=${process.env.REACT_APP_OPENWEATHER}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
    }

    render() {
        if (!this.props.data) return (<h1>Loading...</h1>);
        const a = this.props.data;
        const mod = RevColor(a.mode);
        const styles = {
            width: '90vw',
            height: '90vw',
            maxWidth: '768px',
            maxHeight: '768px'
        }
        return  (
            <div>
                <div style={styles}>
                    <SpCircle data={a}>
                        <div className="today" style={{color: mod}} >
                            <Today />
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
                </div>
                <AppNav data={a} />
            </div>
        )        
    }
}

export default Temperature;
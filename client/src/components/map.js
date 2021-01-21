import React, { Component } from "react";
import './../styles/Map.scss';
import { Circle, Map, GoogleApiWrapper } from 'google-maps-react';
import { MapStyle } from "./inc";

export class Maps extends Component {

    constructor(props) {
        super(props);
        this.state = {
            map: false,
        }
    }

    componentDidUpdate() {
        this.state.map.setOptions({styles: MapStyle(this.props.data)});
    }

    update(mapProps, map) {
        this.setState({map: map});
    }

    render() {
        const a = this.props.data;
        const customStyle = MapStyle(a);
        const con = {
            position: 'relative',  
            width: '100%',
            height: '100%'
        }
        const center = {
            lat: 43.5, 
            lng: -112.05
        }
        return (
            <Map 
                style={con} 
                containerStyle={con} 
                google={this.props.google} 
                zoom={12} 
                initialCenter={center}
                styles={customStyle}
                map={this}
                onReady={(mapProps, map) => this.update(mapProps, map, customStyle)}
            >
                {[...Array(4)].map((x,i) => <Circle
                    radius={i * 1000}
                    key={i}
                    center={center}
                    strokeColor='transparent'
                    strokeOpacity={0}
                    strokeWeight={5}
                    fillColor={a.primary}
                    fillOpacity={0.5}
                />)}
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API
})(Maps)
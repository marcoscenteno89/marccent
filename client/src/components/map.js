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
                zoom={10} 
                initialCenter={center}
                styles={customStyle}
                map={this}
                onReady={(mapProps, map) => this.update(mapProps, map, customStyle)}
            >
                <Circle
                    radius={7000}
                    center={center}
                    // onMouseover={() => console.log('mouseover')}
                    // onClick={() => console.log('click')}
                    // onMouseout={() => console.log('mouseout')}
                    strokeColor='transparent'
                    strokeOpacity={0}
                    strokeWeight={5}
                    fillColor={a.primary}
                    fillOpacity={0.5}
                />
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyABF80pQepngcW0rojqPcKQGwKRcqiPhu4'
})(Maps)
import React, { Component, Fragment } from "react";
import { ThemeContext } from "./var"
import '../styles/Map.scss';
import { Circle, Map, GoogleApiWrapper } from 'google-maps-react';
import { MapStyle } from "./inc/inc";

export class Maps extends Component {

  static contextType = ThemeContext;
  constructor(props) {
    super(props);
    this.state = {
      map: false,
      mapData: this.props.mapData
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      mapData: props.mapData
    }, () => this.updateMap());
  }

  updateMap() {
    this.state.map.setOptions({styles: MapStyle(this.context.theme)});
    this.state.map.setCenter({
      lat: this.state.mapData.loc.lat, 
      lng: this.state.mapData.loc.lng
    });
  }

  componentDidUpdate() {
    this.updateMap();
  }

  update(mapProps, map) {
    this.setState({map: map});
  }

  render() {
    if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
    const a = this.context.theme;
    const d = this.state.mapData;
    const customStyle = MapStyle(a);
    const con = {
      position: 'relative',  
      width: '100%',
      height: '100%'
    }
    return (
      <div className="map" style={this.props.styles}>
        <Map 
          style={con} 
          containerStyle={con} 
          google={this.props.google} 
          zoom={d.zoom ? d.zoom : 12} 
          initialCenter={d.loc}
          styles={customStyle}
          map={this}
          onReady={(mapProps, map) => this.update(mapProps, map, customStyle)}
        >
          {[...Array(4)].map((x,i) => <Circle
            radius={i * 1000}
            key={i}
            center={d.loc}
            strokeColor='transparent'
            strokeOpacity={0}
            strokeWeight={5}
            fillColor={a.hex.primary}
            fillOpacity={0.5}
          />)}
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API
})(Maps)
import React, { Component, Fragment, useMemo } from "react";
import { ThemeContext } from "./var"
import '../styles/Map.scss';
import { GoogleMap, Circle } from '@react-google-maps/api';

// import { Circle, Map, GoogleApiWrapper } from 'google-maps-react';
// import { MapStyle } from "./inc/inc";

// export class Maps extends Component {

//   static contextType = ThemeContext;
//   constructor(props) {
//     super(props);
//     this.state = {
//       map: false,
//       mapData: this.props.mapData
//     }
//   }

//   UNSAFE_componentWillReceiveProps(props) {
//     this.setState({
//       mapData: props.mapData
//     }, () => this.updateMap());
//   }

//   updateMap() {
//     this.state.map.setOptions({styles: MapStyle(this.context.theme)});
//     this.state.map.setCenter({
//       lat: this.state.mapData.loc.lat, 
//       lng: this.state.mapData.loc.lng
//     });
//   }

//   componentDidUpdate() {
//     this.updateMap();
//   }

//   update(mapProps, map) {
//     this.setState({map: map});
//   }

//   render() {
//     if (this.context.theme.id === 0) return <Fragment>Loading...</Fragment>
//     const a = this.context.theme;
//     const d = this.state.mapData;
//     const customStyle = MapStyle(a);
//     const con = {
//       position: 'relative',  
//       width: '100%',
//       height: '100%'
//     }
//     return (
//       <div className="map" style={this.props.styles}>
//         <Map 
//           style={con} 
//           containerStyle={con} 
//           google={this.props.google} 
//           zoom={d.zoom ? d.zoom : 12} 
//           initialCenter={d.loc}
//           styles={customStyle}
//           map={this}
//           onReady={(mapProps, map) => this.update(mapProps, map, customStyle)}
//         >
//           <Circle
//             radius={4000}
//             key={0}
//             center={d.loc}
//             strokeColor='transparent'
//             strokeOpacity={0}
//             strokeWeight={5}
//             fillColor={a.hex.primary}
//             fillOpacity={0.5}
//           />
//         </Map>
//       </div>
//     )
//   }
// }

// export default GoogleApiWrapper({
//   apiKey: process.env.REACT_APP_GOOGLE_API
// })(Maps)

class Map extends Component {
  render() {
    const a = this.props.data;
    const i = this.context.theme;
    // const customStyle = MapStyle(i);
    const containerStyle = {
      width: '100%',
      height: '400px'
    };
    
    return (
        <GoogleMap
          center={a.center}
          zoom={a.zoom ? a.zoom : 12}
          mapContainerStyle={containerStyle}
          // styles={customStyle}
        >

        </GoogleMap>
    )
  }
}

export default Map;

// const Map = (center) => {

//   const containerStyle = {
//     width: '100%',
//     height: '400px'
//   };
  
//   const center = {
//     lat: -3.745,
//     lng: -38.523
//   };

//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_API
//   })

//   const [map, setMap] = React.useState(null)

//   const onLoad = React.useCallback(function callback(map) {
//     // This is just an example of getting and using the map instance!!! don't just blindly copy!
//     const bounds = new window.google.maps.LatLngBounds(center);
//     map.fitBounds(bounds);

//     setMap(map)
//   }, [])

//   // const onUnmount = React.useCallback(function callback(map) {
//   //   setMap(null)
//   // }, [])

//   return isLoaded ? (
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={11}
//         onLoad={onLoad}
//         // onUnmount={onUnmount}
//       >
//         { /* Child components, such as markers, info windows, etc. */ }
//         <></>
//       </GoogleMap>
//   ) : <></>
// }

// export default useMemo(Map)

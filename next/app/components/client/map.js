'use client';
import { useState, useMemo, useEffect, useRef } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { withCTR } from "./hoc";

const Map = (props) => {
  const ref = useRef(null);
  const { zoom, className, theme } = props;
  const [center] = useState(props.center ? props.center : { lat: 43.49, lng: -112.034 });
  className.add('col-12', 'map');
  const [map, setMap] = useState(null);
  const mapStyles = MapStyles(theme);
  const mapOptions = {
    center: center,
    zoom: zoom,
    styles: mapStyles
  };

  useEffect(() => {
    const init = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API,
        version: "weekly",
        libraries: ["places"]
      });
      const { Map } = await loader.importLibrary('maps');
      setMap(new Map(ref.current, mapOptions));
    }
    init();
  }, [theme])

  useMemo(() => {
    if (map) {
      map.setCenter(new window.google.maps.LatLng(center));
      map.setOptions({ styles: mapStyles});
      setMap(map);
    }
  }, [theme, center, zoom])

  return <div {...props} className={className.print()} require={{theme, map}}  ref={ref}></div>;
}

const MapStyles = (theme) => {
  const subtleA = theme.is_dark ? theme.dark.lighter[1].hex : theme.light.darker[1].hex;
  const subtleB = theme.is_dark ? theme.dark.lighter[2].hex : theme.light.darker[2].hex;
  const subtleC = theme.is_dark ? theme.dark.lighter[3].hex : theme.light.darker[3].hex;
  const subtleD = theme.is_dark ? theme.dark.lighter[4].hex : theme.light.darker[4].hex;
  const mode = theme.is_dark ? theme.dark.hex : theme.light.hex;
  const primary = theme.themeList[theme.active].primary.hex;
  const secondary = theme.themeList[theme.active].secondary.hex;
  const primarySubtle = theme.themeList[theme.active].primary.lighter[4];
  return [
    {elementType: 'landscape', elementType: 'geometry', stylers: [{color: mode}]},
    {featureType: 'poi', elementType: 'geometry', stylers: [{color: subtleA}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{color: subtleB}]},
    {featureType: 'road', elementType: 'geometry', stylers: [{color: secondary}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: primary}]},
    {featureType: 'water', elementType: 'geometry', stylers: [{color: subtleD}]},
    {elementType: 'labels.text.stroke', stylers: [{color: primarySubtle}]},
    {elementType: 'labels.text.fill', stylers: [{color: primary}]},
  ]
}

const MapWTCL = withCTR(Map);

export default MapWTCL;
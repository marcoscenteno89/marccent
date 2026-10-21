'use client';
import { useEffect, useRef } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { withTR } from "@/components/theme/hoc";
import { cx } from '@/lib/cx';
import { cssBackground } from '@/lib/css-color';

/*
 * Google Map in the site's theme colors. The map is created once; theme, center and zoom changes update it in
 * place (a new search re-centers it, a theme switch recolors it) instead of rebuilding it.
 */

const DEFAULT_CENTER = { lat: 43.49, lng: -112.034 }; // Idaho Falls

// One loader per page: the Maps script loads once however many maps there are (the loader also refuses a
// second instance with different options).
let loader = null;
const loadMaps = () => {
  loader ??= new Loader({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API, version: "weekly" });
  return loader.importLibrary('maps');
}

const Map = ({ center = DEFAULT_CENTER, zoom = 10, theme, className, style }) => {
  const ref = useRef(null);
  const map = useRef(null);
  const position = { lat: center.lat, lng: center.lng };

  useEffect(() => {
    let cancelled = false;
    loadMaps().then(({ Map }) => {
      if (!cancelled) map.current = new Map(ref.current, { center: position, zoom, styles: mapStyles(theme) });
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => { map.current?.setOptions({ styles: mapStyles(theme) }); }, [theme]);
  useEffect(() => {
    map.current?.setCenter(position);
    map.current?.setZoom(zoom);
  }, [center.lat, center.lng, zoom]);

  return <div ref={ref} className={className} style={{ minHeight: 'var(--map-height)', ...style }} />;
}

// A theme shade, falling back to the last one (util 2.x skips repeated shades, so lists can be short).
const shade = (list, i) => (list[i] ?? list.at(-1))?.hex;

const mapStyles = (theme) => {
  const subtle = (i) => (theme.is_dark ? shade(theme.dark.lighter, i) : shade(theme.light.darker, i));
  const { primary, secondary } = theme.themeList[theme.active];
  return [
    // The panel color (.bg, --surface: a step off the page color), so the map matches the box it sits in.
    { elementType: 'geometry', stylers: [{ color: cssBackground('bg').hex }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: subtle(1) }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: subtle(2) }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: secondary.hex }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: primary.hex }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: subtle(4) }] },
    // Labels for reading: text in the opposite mode's color (light on a dark map, dark on a light one) with a halo in
    // the current mode's page color, so every label sits on a clean band of background whatever it crosses.
    { elementType: 'labels.text.fill', stylers: [{ color: (theme.is_dark ? theme.light : theme.dark).hex }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: theme.mode().hex }, { weight: 3 }] },
  ];
}

const MapWTR = withTR(Map);

export default MapWTR;

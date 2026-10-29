'use client';
import { useEffect, useRef, useState } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { withThemeRead } from "marccent-theme/components/theme/hoc";
import { cx } from 'marccent-theme/lib/cx';
import { toHex } from 'marccent-theme/lib/css-color';

/*
 * Google Map in the theme colors of the box it sits in (a section themed on its own, a landing page's palette, the
 * mode), read from the page's CSS where the map is, not from the site-wide theme. The map is created once; theme,
 * center and zoom changes update it in place (a new search re-centers it, a theme switch recolors it) instead of
 * rebuilding it.
 */

const DEFAULT_CENTER = { lat: 43.49, lng: -112.034 }; // Idaho Falls

// One loader per page: the Maps script loads once however many maps there are (the loader also refuses a
// second instance with different options).
let loader = null;
// Any Maps library by name ('maps', 'geocoding'…) from the one loader.
const loadMapsLibrary = (name) => {
  loader ??= new Loader({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API, version: "weekly" });
  return loader.importLibrary(name);
}
const loadMaps = () => loadMapsLibrary('maps');

/**
 * @param {number} [recenter] - Change it to put the map back on center and zoom (a Reset button), after the
 *   visitor has panned or zoomed.
 * @param {string} [overlay] - A tile layer over the map: a URL with {z}, {x} and {y} (the weather app's layers,
 *   app/api/weather/tile). Changing it swaps the layer; none: just the map.
 * @param {(map: google.maps.Map) => void} [onLoad] - Called once with the map when it's made, to draw on it (Zones).
 */
const Map = ({ center = DEFAULT_CENTER, zoom = 10, recenter, overlay, onLoad, theme, className, style }) => {
  const ref = useRef(null);
  const map = useRef(null);
  const [ ready, setReady ] = useState(false);
  const position = { lat: center.lat, lng: center.lng };

  useEffect(() => {
    let cancelled = false;
    loadMaps().then(({ Map }) => {
      if (cancelled) return;
      map.current = new Map(ref.current, { center: position, zoom, styles: mapStyles(ref.current) });
      setReady(true);
      onLoad?.(map.current);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const layers = map.current?.overlayMapTypes;
    if (!layers) return;
    layers.clear();
    if (overlay) layers.push(new window.google.maps.ImageMapType({
      getTileUrl: ({ x, y }, z) => overlay.replace('{z}', z).replace('{x}', x).replace('{y}', y),
      tileSize: new window.google.maps.Size(256, 256),
      opacity: 0.8,
    }));
  }, [ ready, overlay ]);
  // After a theme change, on the next frame: the section's new colors are in the CSS by then.
  useEffect(() => {
    const frame = requestAnimationFrame(() => map.current?.setOptions({ styles: mapStyles(ref.current) }));
    return () => cancelAnimationFrame(frame);
  }, [theme, theme?.version]);
  useEffect(() => {
    map.current?.setCenter(position);
    map.current?.setZoom(zoom);
  }, [center.lat, center.lng, zoom, recenter]);

  return <div data-component="map" ref={ref} className={className} style={{ minHeight: 'var(--map-height, 500px)', ...style }} />;
}

// A CSS color (a var(), color-mix()…) as the browser computes it where the map is, as hex: a probe beside the map
// (Google fills the map's own box), so it gets the same scope, palette and mode.
const readColor = (el, css) => {
  const probe = document.createElement('span');
  probe.style.color = css;
  el.parentElement.append(probe);
  const hex = toHex(getComputedStyle(probe).color);
  probe.remove();
  return hex;
};

const mapStyles = (el) => {
  const color = (css) => readColor(el, css);
  // Shades a step at a time from the panel color toward the text color.
  const subtle = (pct) => color(`color-mix(in srgb, var(--body-color) ${pct}%, var(--surface))`);
  return [
    // The panel color (.bg, --surface: a step off the page color), so the map matches the box it sits in.
    { elementType: 'geometry', stylers: [{ color: color('var(--surface)') }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: subtle(6) }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: subtle(10) }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: color('var(--secondary)') }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: color('var(--primary)') }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: subtle(18) }] },
    // Labels for reading: text in the body color with a halo in the page color, so every label sits on a clean band
    // of background whatever it crosses.
    { elementType: 'labels.text.fill', stylers: [{ color: color('var(--body-color)') }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: color('var(--body-bg)') }, { weight: 3 }] },
  ];
}

const ThemedMap = withThemeRead(Map);

export default ThemedMap;
export { loadMapsLibrary };

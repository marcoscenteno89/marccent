'use client';
import React, { useEffect, useState } from "react";
import { get } from "@marccent/util";
import dynamic from 'next/dynamic';
import dayjs from "dayjs";
import { Clock } from '@/components/ui/clock';
import { Form } from '@/components/ui/form';
import { Pagination } from '@/components/ui/pagination';
import { cx } from '@/lib/cx';
import { Loading } from '@/components/ui/loading';
import { Input } from '@/components/ui/field';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { toastSI } from '@/lib/toasts';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/widgets/layout';
import ThemedMap from "./map";

// Our own route (app/api/weather) fetches the forecast, so the OpenWeather key stays on the server.
const forecastUrl = (city) => `/api/weather?q=${encodeURIComponent(city)}`;
const ICONS = 'https://openweathermap.org/img/w/'; // OpenWeather's public icon images (no key needed)
const PAGE_SIZE = 8; // forecast rows per page (3-hour steps: one day)
const airUrl = ({ lat, lon }) => `/api/weather/air?lat=${lat}&lon=${lon}`;
const tileUrl = (layer) => `/api/weather/tile/${layer}/{z}/{x}/{y}`;

// The weather map layers (OpenWeather tiles over the Google map). The map zooms out with one on: they're drawn for
// regions, and read as blank squares up close.
const LAYERS = [
  { name: null, label: 'Map', icon: 'map' },
  { name: 'clouds_new', label: 'Clouds', icon: 'cloud' },
  { name: 'precipitation_new', label: 'Rain', icon: 'cloud-rain' },
  { name: 'temp_new', label: 'Temperature', icon: 'temperature-half' },
  { name: 'wind_new', label: 'Wind', icon: 'wind' },
  { name: 'pressure_new', label: 'Pressure', icon: 'gauge' },
];

// OpenWeather's air quality index, 1 to 5.
const AQI = [ null, 'Good', 'Fair', 'Moderate', 'Poor', 'Very poor' ];
const POLLUTANTS = [ [ 'pm2_5', 'PM2.5' ], [ 'pm10', 'PM10' ], [ 'o3', 'Ozone' ], [ 'no2', 'NO\u2082' ] ];

const WaveCanvas = dynamic(() => import("@/components/visuals/canvas").then(module => module.WaveCanvas), {
  ssr: false,
  loading: () => <Loading require={[]} />,
});

const Weather = () => {
  const [ city, setCity ] = useState(null);
  const [ layer, setLayer ] = useState(null); // a LAYERS name, or null: the map alone
  // get() resolves to the JSON with ok added, or { ok: false } when the request fails (unknown city: 404).
  const update = (q) => {
    get(forecastUrl(q)).then(res => {
      if (!res.ok || !res.city) return toastSI.add(`Couldn't load weather for "${q}".`, 'danger');
      res.city.coord.lng = res.city.coord.lon; // Google Maps wants lng
      setCity(res);
      toastSI.add('Loaded city data');
    });
  }
  useEffect(() => update('Idaho Falls'), []);

  const [ air, setAir ] = useState(null); // air quality at the city (app/api/weather/air), once loaded
  const [ recenter, setRecenter ] = useState(0); // bumped by Reset: the map goes back to the city
  useEffect(() => {
    if (!city) return;
    setAir(null);
    get(airUrl(city.city.coord)).then(res => res.ok && setAir(res));
  }, [ city ]);
  const reset = () => { setLayer(null); setRecenter(n => n + 1); };

  if (!city) return <Loading require={[]} />;
  const now = city.list[0];
  const { sunrise, sunset, timezone } = city.city;
  // A collage of cards on one dense grid (like widgets/collage.js), five columns: the search across the top; under it
  // the forecast (two columns by four rows), now over the map (squares, two by two) and a column of four small cards;
  // the air details (four columns) and the last small card close the bottom row. One column on a phone.
  return (
    <div data-component="weather" className="grid" style={{ '--cols': 5, '--min': '13rem', gridAutoRows: 'minmax(11rem, auto)', gridAutoFlow: 'dense' }}>
      <Card name="search" className="span-full" style={{ alignContent: 'center' }}>
        <h3>{city.city.name}&apos;s Population: {city.city.population}</h3>
        <Form className="grid inline-form" onSubmit={(v) => update(v.city)} submitLabel="Search" submitIcon="magnifying-glass">
          <Input name="city" required />
        </Form>
      </Card>
      <History list={city.list} key={city.city.id} className="span-2" style={{ gridRow: 'span 4' }} /> {/* key: a new city starts on page 1 */}
      <Card name="now" className="span-2" style={{ gridRow: 'span 2', alignContent: 'center' }}><CurrentConditions temp={now} /></Card>
      <Card name="map" className="span-2" style={{ gridRow: 'span 2', gridTemplateRows: 'auto minmax(18rem, 1fr)' }}>
        {/* The map's controls: the weather layers (icon buttons that widen to their name on hover; the one shown stays
            filled), then Reset at the end: the plain map, back on the city. */}
        <div className="grid gap-sm items-center" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
          <div data-component="map-layers" className="row-wrap" role="group" aria-label="Map layer" style={{ '--gap': 'var(--space-xs)' }}>
            {LAYERS.map(l => (
              <Button key={l.name} data-name={l.name ?? 'map'} icon={l.icon} className="hover-expand" aria-pressed={layer === l.name} onClick={() => setLayer(l.name)}>{l.label}</Button>
            ))}
          </div>
          <Button icon="rotate-left" className="hover-expand" title="Back to the plain map, on the city" onClick={reset}>Reset</Button>
        </div>
        <ThemedMap center={city.city.coord} zoom={layer ? 6 : 10} recenter={recenter} overlay={layer && tileUrl(layer)}
          className="w-100 h-100 round" style={{ minHeight: '18rem' }} />
      </Card>
      {air && <AirRing air={air} />}
      <StatCard name="feels-like" className="bg border" icon="temperature-half" value={`${Math.round(now.main.feels_like)}\u00B0`} label="Feels like" />
      <StatCard name="humidity" className="bg border" icon="droplet" fill={now.main.humidity} value={`${now.main.humidity}%`} label="Humidity" />
      {air && <AirDetails air={air} />}
      <StatCard name="wind" className="bg border" icon="wind" value={`${Math.round(now.wind.speed)} mph`} label={`Wind from the ${compass(now.wind.deg)}`} />
      <StatCard name="sun" className="bg border" icon="sun" value={localTime(sunset, timezone)} label={`Sunset \u00B7 sunrise ${localTime(sunrise, timezone)}`} />
    </div>
  );
}

// A card of the collage: the site's panel (bg border round shadow pad), its content in one column. name: which
// card it is (data-name).
const Card = ({ name, className, style, children }) => (
  <div data-component="weather-card" data-name={name} className={cx('bg border round shadow pad grid cols-1 gap-sm content-start', className)} style={style}>{children}</div>
);

// The city's own clock time of a unix time (OpenWeather gives the city's offset from UTC, in seconds): "7:42 PM".
const localTime = (unix, offset) => {
  const d = new Date((unix + offset) * 1000);
  const h = d.getUTCHours();
  return `${h % 12 || 12}:${String(d.getUTCMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

// Where the wind comes from, as one of 8 compass points.
const compass = (deg) => [ 'north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest' ][Math.round(deg / 45) % 8];

const History = (props) => {
  const [ current, setCurrent ] = useState(1);
  const list = props.list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  return (
    <Card name="forecast" className={props.className} style={props.style}>
      <h3>Weather Forecast</h3>
      <Accordion>
        {list.map((item) => {
          const icon = `${ICONS}${item.weather[0].icon}.png`;
          return (
            <AccordionItem key={item.dt} className="grid fixed cols-5 gap-0 divide text-center fs-sm" header={<>
                {/* Date first (half, left-aligned so times line up down the list), then icon and temp (a quarter each).
                    Cells stretch to the row height (so .divide lines are full height); content is centered inside each. */}
                <div className="grid fixed cols-4 gap-0 divide text-center">
                  <div className="span-2 grid cols-1 items-center text-start">{dayjs(item.dt_txt).format('ddd DD, h:mm A')}</div>
                  <div className="col-center"><img src={icon} alt={item.weather[0].description} /></div>
                  <strong className="col-center">{Math.round(item.main.temp)}&#176;</strong>
                </div>
              </>}>
                <Stat label="Conditions" value={item.weather[0].description} className="text-capitalize" />
                <Stat label="Humidity" value={`${item.main.humidity}%`} />
                <Stat label="Low" value={`${Math.round(item.main.temp_min)}\u00B0`} />
                <Stat label="High" value={`${Math.round(item.main.temp_max)}\u00B0`} />
                <Stat label="Feels like" value={`${Math.round(item.main.feels_like)}\u00B0`} />
            </AccordionItem>
          )
        })}
      </Accordion>
      <Pagination total={props.list.length} current={current} pageSize={PAGE_SIZE} update={setCurrent} className="divide border round" />
    </Card>
  )
}

// Air quality at the city, in two cards: the index now in a ring (filled a fifth per step), then the main pollutants
// and the worst index of each coming day.
const AirRing = ({ air }) => {
  const aqi = air.now.main.aqi;
  return <StatCard name="air-quality" className="bg border" accent icon="lungs" fill={aqi * 20} value={AQI[aqi]} label={`Air quality: ${aqi} of 5`} />;
}

const AirDetails = ({ air }) => {
  // The worst hour of each day ahead, in order.
  const days = Object.entries(Object.groupBy(air.forecast, (h) => dayjs.unix(h.dt).format('ddd')))
    .map(([ day, hours ]) => [ day, Math.max(...hours.map(h => h.main.aqi)) ]);
  return (
    <Card name="air-details" className="span-4" style={{ alignContent: 'center' }}>
      <h3>Air Quality</h3>
      <small className="opacity-75">Now, in µg/m³</small>
      <div className="grid fixed gap-0 divide border round text-center" style={{ '--cols': POLLUTANTS.length }}>
        {POLLUTANTS.map(([ key, label ]) => <Stat key={key} label={label} value={Math.round(air.now.components[key] * 10) / 10} />)}
      </div>
      <small className="opacity-75">The days ahead, at their worst</small>
      <div className="grid fixed gap-0 divide border round text-center" style={{ '--cols': days.length }}>
        {days.map(([ day, i ]) => <Stat key={day} label={day} value={AQI[i]} />)}
      </div>
    </Card>
  );
}

// One forecast tile: small label over its value, centered in a cell that stretches to the row height
// (so the .divide line between tiles is full height). --pad is tighter than the default so 5 fit in a row.
const Stat = ({ label, value, className }) => (
  <div className={cx('col-center pad', className)} style={{ '--pad': '.5rem .25rem' }}>
    <small className="opacity-75">{label}</small>
    <strong>{value}</strong>
  </div>
)

// Current conditions: a gradient ring (5% pad) around the wave canvas, with the readout layered on the wave
// (.stack). The readout's bottom padding lifts it above the waterline.
const CurrentConditions = ({ temp }) => (
  <div data-component="current-conditions" className="square circle bg-gradient shadow-inset stack pad" style={{ '--pad': '5%' }}>
    <WaveCanvas className="circle shadow-inset" />
    <div className="col-center text-center pad" style={{ '--pad': '0 0 20%' }}>
      <img src={`https://openweathermap.org/img/wn/${temp.weather[0].icon}@2x.png`} width={80} height={80} alt="" />
      <span className="display-lg fw-bold">{Math.round(temp.main.temp)}&#176;</span>
      <span className="text-capitalize">{temp.weather[0].description}</span>
      <Clock format="ddd, MMM D · h:mm:ss A" className="fs-sm opacity-75" />
    </div>
  </div>
)

export default Weather;
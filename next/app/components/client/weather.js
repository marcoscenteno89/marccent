'use client';
import React, { useEffect, useState, useContext } from "react";
import { get } from "@marccent/util";
import dynamic from 'next/dynamic';
import dayjs from "dayjs";
import { Clock, Form, Pagination } from "./component";
import { cx, Loading, Input, Accordion, AccordionItem } from "@/components/server/component";
import { ToastContext } from '@/components/context';
import MapWTR from "./map";

const url = process.env.NEXT_PUBLIC_OPENWEATHERURL;
const forecastUrl = (city) =>
  `${url}data/2.5/forecast?q=${encodeURIComponent(city)}&units=imperial&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API}`;
const PAGE_SIZE = 8; // forecast rows per page (3-hour steps: one day)

const WaveWTRC = dynamic(() => import("./canvas").then(module => module.WaveWTRC), {
  ssr: false,
  loading: () => <Loading require={[]} />,
});

const Weather = () => {
  const { toast, setToast } = useContext(ToastContext);
  const [ city, setCity ] = useState(null);
  // get() resolves to the JSON with ok added, or { ok: false } when the request fails (unknown city: 404).
  const update = (q) => {
    get(forecastUrl(q)).then(res => {
      if (!res.ok || !res.city) return setToast(toast.add(`Couldn't load weather for "${q}".`, 'danger'));
      res.city.coord.lng = res.city.coord.lon; // Google Maps wants lng
      setCity(res);
      setToast(toast.add('Loaded city data'));
    });
  }
  useEffect(() => update('Idaho Falls'), []);

  return (!city ? <Loading require={[]} /> : (
    <div className="grid cols-1">
      <h3>{city.city.name}&apos;s Population: {city.city.population}</h3>
      <Form className="grid inline-form" onSubmit={(v) => update(v.city)} submitLabel="Search" submitIcon="magnifying-glass">
        <Input name="city" required />
      </Form>
      {/* --min: each panel needs ~24rem, so the forecast drops below the circle/map when the row is under ~49rem. */}
      <div className="grid cols-2" style={{ '--min': '24rem' }}>
        <div className="shadow grid cols-1 justify-center content-start gap-sm pad">
          <Circle temp={city.list[0]} />
          <MapWTR center={city.city.coord} zoom={10} />
        </div>
        <History list={city.list} key={city.city.id} /> {/* key: a new city starts on page 1 */}
      </div>
    </div>
    ))        
}

const History = (props) => {
  const [ current, setCurrent ] = useState(1);
  const list = props.list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  return (
    <div className="shadow pad round grid cols-1 content-start gap-sm">
      <h3>Weather Forecast</h3>
      <Accordion>
        {list.map((item) => {
          const icon = `${url}img/w/${item.weather[0].icon}.png`;
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
    </div>
  )
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
const Circle = ({ temp }) => (
  <div className="square circle bg-gradient shadow-inset stack pad" style={{ '--pad': '5%' }}>
    <WaveWTRC className="circle shadow-inset" />
    <div className="col-center text-center pad" style={{ '--pad': '0 0 20%' }}>
      <img src={`https://openweathermap.org/img/wn/${temp.weather[0].icon}@2x.png`} width={80} height={80} alt="" />
      <span className="display-lg fw-bold">{Math.round(temp.main.temp)}&#176;</span>
      <span className="text-capitalize">{temp.weather[0].description}</span>
      <Clock format="ddd, MMM D · h:mm:ss A" className="fs-sm opacity-75" />
    </div>
  </div>
)

export default Weather;
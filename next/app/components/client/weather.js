'use client';
import React, { useEffect, useState, useContext, useCallback } from "react";
import { get } from "@marccent/util";
import dynamic from 'next/dynamic';
import Image from 'react-bootstrap/Image';
import { Clock } from "./component";
import MapWTR from "./map";
import { Loading } from "@/components/client/util";
import { WebForm, WebPagination, Accordion, AccordionItem } from "./component";
import dayjs from "dayjs";
const url = process.env.NEXT_PUBLIC_OPENWEATHERURL;
const openWeather = `${url}data/2.5/forecast`;
const token = `&units=imperial&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API}`;
import { ToastContext } from '@/components/context';

const WaveWTRC = dynamic(() => import("./canvas").then(module => module.WaveWTRC), {
  ssr: false,
  loading: () => <Loading require={[]} />,
});

const Weather = () => {
  const { toast, setToast } = useContext(ToastContext);
  const [ city, setCity ] = useState(null);
  useEffect(() => update('Idaho Falls'), []);
  const onClick = (data) => update(data.city.value);
  const update = (q) => {
    get(new URL(`${openWeather}?q=${q}${token}`)).then(res => {
      res.city.coord.lng = res.city.coord.lon;
      setCity(res);
      setToast(toast.add('Loaded city data'));
    }).catch(e => setToast(toast.add('An error occurred while fetching city data', 'danger')));
  }

  return (!city ? <Loading require={[]} /> : (
    <div className="grid cols-1 gap-3">
      <h3>{city.city.name}&apos;s Population: {city.city.population}</h3>
      <WebForm callBack={onClick}>
        <input type="text" name="city" required />
      </WebForm>
      {/* --min: each panel needs ~24rem, so the forecast drops below the circle/map when the row is under ~49rem. */}
      <div className="grid cols-2 gap-3" style={{ '--min': '24rem' }}>
        <div className="shadow-md grid cols-1 justify-center content-start gap-2 pad">
          <Circle temp={city.list[0]} />
          <MapWTR center={city.city.coord} zoom={10} />
        </div>
        <History list={city.list} />
      </div>
    </div>
    ))        
}

const History = (props) => {
  const [ current, setCurrent ] = useState(1);
  const [ list, setList ] = useState([]);
  const [ pageSize ] = useState(8);
  const [ total ] = useState(props.list.length);
  useEffect(() => update(current), [props.list]);
  const update = (current) => {
    const to = pageSize * current;
    const from = to - pageSize;
    setCurrent(current);
    setList(props.list.slice(from, to));
  }
  return (
    <div className="shadow-md pad round grid cols-1 content-start gap-2">
      <h3>Weather Forecast</h3>
      <Accordion>
        {list.map((item, index) => {
          const icon = `${url}img/w/${item.weather[0].icon}.png`;
          return (
            <AccordionItem key={index} className="grid fixed cols-5 gap-0 divide text-center fs-sm" header={<>
                {/* Date first (half, left-aligned so times line up down the list), then icon and temp (a quarter each).
                    Cells stretch to the row height (so .divide lines are full height); content is centered inside each. */}
                <div className="grid fixed cols-4 gap-0 divide text-center">
                  <div className="span-2 grid cols-1 items-center text-start">{dayjs(item.dt_txt).format('ddd DD, h:mm A')}</div>
                  <div className="col-center"><Image src={icon} alt={item.weather[0].description} /></div>
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
      <WebPagination total={total} current={current} pageSize={pageSize} update={update} />
    </div>
  )
}

// One forecast tile: small label over its value, centered in a cell that stretches to the row height
// (so the .divide line between tiles is full height). --pad is tighter than the default so 5 fit in a row.
const Stat = ({ label, value, className = '' }) => (
  <div className={`col-center pad ${className}`.trim()} style={{ '--pad': '.5rem .25rem' }}>
    <small className="opacity-75">{label}</small>
    <strong>{value}</strong>
  </div>
)

// Current conditions: a gradient ring (5% pad) around the wave canvas, with the readout layered on the wave
// (.stack). The readout's bottom padding lifts it above the waterline.
const Circle = ({ temp }) => (
  <div className="square circle linear-gradient shadow-inset stack pad" style={{ '--pad': '5%' }}>
    <WaveWTRC className="circle shadow-inset" />
    <div className="col-center text-center pad" style={{ '--pad': '0 0 20%' }}>
      <Image src={`https://openweathermap.org/img/wn/${temp.weather[0].icon}@2x.png`} width={80} height={80} alt="" />
      <span className="display-5 fw-bold">{Math.round(temp.main.temp)}&#176;</span>
      <span className="text-capitalize">{temp.weather[0].description}</span>
      <Clock format="ddd, MMM D · h:mm:ss A" className="fs-sm opacity-75" />
    </div>
  </div>
)

export default Weather;
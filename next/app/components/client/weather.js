'use client';
import React, { useEffect, useState, useContext } from "react";
import { get } from "@marccent/util";
import dynamic from 'next/dynamic';
import Image from 'react-bootstrap/Image';
import { SpCircle, ClockWC } from "./component";
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import MapWTC from "./map";
import { Loading } from "./component";
import { WebFormWC, WebPagination } from "./component";
import dayjs from "dayjs";
const url = process.env.NEXT_PUBLIC_OPENWEATHERURL;
const openWeather = `${url}data/2.5/forecast`;
const token = `&units=imperial&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API}`;
import { ToastContext } from '@/components/context';
import { withComponent } from "./hoc";

const WaveWCTC = dynamic(() => import("./canvas").then(module => module.WaveWCTC), {
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
      <div className="row">
        <h3 className="col-12">{city.city.name}&apos;s Population: {city.city.population}</h3>
        <WebFormWC className="col-12" callBack={onClick}>
          <input type="text" name="city" required />
        </WebFormWC>
        <div className="col-md-6">
          <div className="shadow flex-col-center p-3">
            <Circle temp={city.list[0]} />
            <MapWTC center={city.city.coord} zoom={10} />
          </div>
        </div>
        <div className="col-md-6">
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
    <div className="shadow p-3 rounded">
      <h3>Weather Forecast</h3>
      <Accordion defaultActiveKey="0">
        {list.map((item, index) => {
          const icon = `${url}img/w/${item.weather[0].icon}.png`;
          return (
            <Accordion.Item key={index} eventKey={index}>
              <Accordion.Header>
                <ListGroup horizontal className="row col-12">
                  <ListGroup.Item className="col-2 py-0">
                    <Image src={icon} alt={item.weather[0].description} />
                  </ListGroup.Item>
                  <ListGroup.Item className="col-3 flex-center">{item.main.temp}&#176;</ListGroup.Item>
                  <ListGroup.Item className="col-6 flex-center">
                    {dayjs(item.dt_txt).format('dddd DD, h:mm A')}
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Header>
              <Accordion.Body className="row">
                <ListGroup className="col-6">
                  <ListGroup.Item>{item.weather[0].description}</ListGroup.Item>
                  <ListGroup.Item className="d-flex">
                    <div className="col-6 border-end">Humidity</div><div className="col-1"></div>
                    <div className="col-5">{item.main.humidity}</div>
                  </ListGroup.Item>
                </ListGroup>
                <ListGroup className="col-6">
                  <ListGroup.Item className="d-flex">
                    <div className="col-6 border-end">Low</div><div className="col-1"></div>
                    <div className="col-5">{item.main.temp_min}</div>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex">
                    <div className="col-6 border-end">High</div><div className="col-1"></div>
                    <div className="col-5">{item.main.temp_max}</div>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex">
                    <div className="col-6 border-end">Feels like</div><div className="col-1"></div>
                    <div className="col-5">{item.main.feels_like}</div>
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          )
        })}
      </Accordion>
      <WebPagination total={total} current={current} pageSize={pageSize} update={update} />
    </div>
  )
}

const Circle = (props) => {
  const { temp } = props;
  const icon = `https://openweathermap.org/img/w/${temp.weather[0].icon}.png`;
  return (
    <SpCircle>
      <WaveWCTC className="shadow-inset circle" canvasCls="anim" />
      <div className="inner text-center flex-col-center front" style={{marginTop:'-4rem'}}>
        <Image 
          src={icon} 
          styles={{width: '75px', marginBottom: '-1.5rem'}} 
          alt={temp.weather[0].description} />
        <h3 style={{padding: '0', margin: '0.5rem'}}>{temp.main.temp}&#176;</h3>
        <small>{dayjs().format('dddd DD, MMMM, YYYY')}</small>
        <ClockWC className="col-6 mt-3 border" />
      </div>
    </SpCircle>
  )
}

const WeatherWC = withComponent(Weather);

export default WeatherWC;
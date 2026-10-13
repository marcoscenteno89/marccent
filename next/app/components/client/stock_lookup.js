'use client';
import React, { useState, useEffect } from 'react';
import { WebForm, Input, Accordion, AccordionItem, Loading } from "./component";
import { cloneDeep as cd } from 'lodash';
import { get } from "@marccent/util";
import { GraphWTRC } from './canvas';
import dayjs from 'dayjs';
import ListGroup from 'react-bootstrap/ListGroup';

const url = process.env.NEXT_PUBLIC_CLIENT;

/**
 * StockLookup is a React component that displays ticker data from an API.
 * 
 * @returns {JSX.Element} The StockLookup JSX element.
 */

const StockLookup = () => {

  // Declare State
  // Base value for price table
  // base controls the number of price points displayed in the price table
  const [ base ] = useState(100);
  const [ err, setErr ] = useState(false);
  const [ data, setData ] = useState({
    min: null,
    max: null,
    dateList: null,
    ticker: null
  });

  useEffect(() => {
    const t = setTimeout(() => getTicker('SP500', null), 2000);
    return () => clearTimeout(t);
  }, []);
  
  /**
   * Retrieves ticker data from the API and updates the component state.
   * 
   * @param {string} ticker - The ticker symbol.
   * @param {HTMLElement} field - The input field element.
   * @returns {void}
   */

  const getTicker = (ticker, field) => {
    const obj = {}
    try {
      get(`${url}api/stock_lookup/ticker/${ticker}/`).then(res => {
        if (Array.isArray(res)) {
          setErr(false);
          const dt = res.filter(i => i.Close !== null).reverse();
          if (dt.length > 0) {
            // Convert date strings to date objects
            const dates = [];
            for (let i of dt) {
              const dateArr = i.Date.split('/');
              i.Date = dayjs(`${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`);
              dates.push(i.Date);
            }

            // Generate data object and set state
            let min = dt.reduce((min, i) => i.Close < min.Close ? i : min).Close;
            let max = dt.reduce((max, i) => i.Close > max.Close ? i : max).Close;
            let range = (max - min) * 0.2;
            obj.min = min - range;
            obj.max = max + range;
            obj.dateList = dates;
            obj.data = dt;
            obj.ticker = ticker;
            setData(cd(obj));
          } else {
            if (field) {
              // Display error message in input field
              field.value = '';
              field.placeholder = res[0].Symbol;
              field.classList.add('bg-danger');
            }
          }
        } else {
          // Most likely a server error
          setData(true);
          setErr(true);
        }
      }); 
    } catch (error) {
      setData(true);
      setErr(true);
      console.error(error);
    }
  };

  /**
   * Handles the click event.
   *
   * @param {Object} data - The data object containing search value and reference.
   * @returns {void}
   */

  const onClick = (data) => getTicker(data.search.value, data.search.ref);
  return (
    <div className="grid cols-1 gap-2">
      <Loading require={[data.ticker]}>
        <WebForm className="single-line-form" callBack={onClick}>
          <Input type="text" name="search" no-label placeholder={data.ticker} required />
        </WebForm>
      </Loading>
      <div className="grid layout-2-1 gap-3">
        <div>
          <Loading require={[data.ticker]}>
            <div className="graph-container round bg pad border">
              {/* order-first on the readout (canvas.js) puts it above the canvas. */}
              <div className="grid cols-1 gap-0">
                <GraphWTRC obj={data} pts={(data.max - data.min) / base} base={base} />
              </div>
              <PriceTable base={base} min={data.min} pts={((data.max - data.min) / base) * 10} />
              <DateTable dateList={data.dateList} />
            </div>
          </Loading>
        </div>
        <div>
          <TickerList callBack={getTicker} />
        </div>
      </div>
    </div>
  );
}
const TickerList = (props) => {
  const [ list, setList ] = useState(null);
  useEffect(() => {
    try {
      get(`${url}api/stock_lookup/ticker-list/`).then(res => {
        if (Array.isArray(res))  setList(res);
      });
    } catch (error) {
      console.error(error); // Most likely a server error
    }
  }, []);
  return (
    <Loading require={[list]}>
      <Accordion>
        {list && list.map((country, i) => (
          <AccordionItem key={i} header={`${country.name} (${country.list.length})`} className="bg">
              <ListGroup className="bg">
                {country.list.map((item, idx) => (
                  <ListGroup.Item onClick={() => props.callBack(item.Symbol)} className="bg" key={idx}>
                    {item.Name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
          </AccordionItem>
        ))}
      </Accordion>
    </Loading>
  );
}

const PriceTable = (props) => {
  const { min, base, pts } = props;
  const [ priceList, setPriceList ] = useState(null);
  useEffect(() => {
    // Create price table
    const price = [];
    let baseline = min;
    for (let i = 0; i < Math.ceil(base * 0.1); i++) {
      price.push(baseline);
      baseline += pts;
    }
    
    setPriceList(price.reverse()); // Set state for Price
  }, [min]);

  return (
    <>
      {/* Rows stretch to equal heights; 50px top offset = the .selected readout above the chart. */}
      <div className="grid cols-1 gap-0" style={{paddingTop: '50px'}}>
        {priceList && priceList.map((item, index) => (
          <div className="grid cols-1 items-end justify-center" key={index}>
            {parseInt(item)}
          </div>
        ))}
      </div>
    </>
  );
}

const DateTable = (props) => {
  return (
    <div className="cq center">
      {props.dateList && props.dateList.map((item, index) => (
        <div className="single" key={index}>
          <div>{item.format('DD')} </div><div>{item.format('MM')}</div>
        </div>
      ))}
    </div>
  );
}

export { StockLookup };
export default StockLookup;
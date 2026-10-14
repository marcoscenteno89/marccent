'use client';
import React, { useState, useEffect } from 'react';
import { Form } from "./component";
import { Input, Accordion, AccordionItem, Loading, Button, Alert } from "@/components/server/component";
import { cloneDeep as cd } from 'lodash';
import { get } from "@marccent/util";
import { GraphWTRC } from './canvas';
import dayjs from 'dayjs';

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
    getTicker('SP500', null);
  }, []);
  
  /**
   * Loads a ticker and shows it. On failure the current chart stays: from the search box the browser shows
   * the message on the field (cleared on the next keystroke); on the first load the error replaces the chart.
   *
   * @param {string} ticker - The ticker symbol.
   * @param {HTMLInputElement|null} field - The search input, or null on the first load.
   */
  const getTicker = (ticker, field) => {
    const fail = (msg) => {
      if (!field) return setErr(msg);
      field.setCustomValidity(msg);
      field.reportValidity();
      field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
    };
    // get() resolves to the JSON body, or to an error object when the request fails; only an array is data.
    get(`/api/stock_lookup/ticker/${ticker}/`).then(res => {
      const dt = Array.isArray(res) ? res.filter(i => i.Close !== null).reverse() : [];
      if (!dt.length) return fail(`No price data for "${ticker}".`);
      // Convert date strings (DD/MM/YYYY) to date objects
      for (let i of dt) {
        const [ day, month, year ] = i.Date.split('/');
        i.Date = dayjs(`${month}/${day}/${year}`);
      }
      const min = Math.min(...dt.map(i => i.Close));
      const max = Math.max(...dt.map(i => i.Close));
      const range = (max - min) * 0.2;
      setErr(false);
      setData(cd({ min: min - range, max: max + range, dateList: dt.map(i => i.Date), data: dt, ticker }));
    }).catch(() => fail(`Couldn't load "${ticker}". Please try again later.`));
  };

  /**
   * Handles the click event.
   *
   * @param {Object} data - The data object containing search value and reference.
   * @returns {void}
   */

  // First load failed: say so instead of showing spinners forever.
  if (err && !data.ticker) return <Alert tone="secondary">{err}</Alert>;

  return (
    <div className="grid cols-1 gap-2">
      <Loading require={[data.ticker]}>
        <Form className="grid inline-form" onSubmit={(v, form) => getTicker(v.search, form.elements.search)}
          submitLabel="Search" submitIcon="magnifying-glass">
          <Input name="search" label="Ticker" placeholder={data.ticker} required />
        </Form>
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
      get('/api/stock_lookup/ticker-list/').then(res => {
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
              {/* One link-style button per ticker, lines between them (.divide). */}
              <ul className="grid cols-1 gap-0 divide" style={{ '--pad': '.5rem 0' }}>
                {country.list.map((item) => (
                  <li key={item.Symbol} className="pad">
                    <Button onClick={() => props.callBack(item.Symbol)}>{item.Name}</Button>
                  </li>
                ))}
              </ul>
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
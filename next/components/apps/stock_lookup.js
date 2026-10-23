'use client';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { get } from "@marccent/util";
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/field';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { GraphWTRC } from '@/components/visuals/canvas';

// Price steps on the chart's hover grid (rows); the price column labels every 10th.
const BASE = 100;

/**
 * StockLookup: a price chart for a ticker (SP500 first), a search box, and the available tickers by country.
 */
const StockLookup = () => {
  const [ err, setErr ] = useState(false);
  const [ data, setData ] = useState(null); // { min, max, data, ticker }

  /**
   * Loads a ticker and shows it. On failure the current chart stays: from the search box the browser shows
   * the message on the field (cleared on the next keystroke); on the first load the error replaces the chart.
   * @param {string} ticker @param {HTMLInputElement|null} [field] - The search input; null on the first load.
   */
  const getTicker = (ticker, field = null) => {
    const fail = (msg) => {
      if (!field) return setErr(msg);
      field.setCustomValidity(msg);
      field.reportValidity();
      field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
    };
    // get() resolves to the JSON body, or to { ok: false } when the request fails; only an array is data.
    get(`/api/stock_lookup/ticker/${ticker}/`).then(res => {
      const dt = Array.isArray(res) ? res.filter(i => i.Close !== null).reverse() : [];
      if (!dt.length) return fail(`No price data for "${ticker}".`);
      for (const i of dt) { // DD/MM/YYYY strings to dates
        const [ day, month, year ] = i.Date.split('/');
        i.Date = dayjs(`${month}/${day}/${year}`);
      }
      const closes = dt.map(i => i.Close);
      const min = Math.min(...closes);
      const max = Math.max(...closes);
      const margin = (max - min) * 0.2; // room above and below the line
      setErr(false);
      setData({ min: min - margin, max: max + margin, data: dt, ticker });
    });
  };

  useEffect(() => getTicker('SP500'), []);

  // First load failed: say so instead of showing spinners forever.
  if (err && !data) return <Alert tone="danger">{err}</Alert>;

  const pts = data && (data.max - data.min) / BASE; // price per hover-grid row
  return (
    <div className="grid cols-1 gap-sm">
      <Loading require={[data]}>
        <Form className="grid inline-form" onSubmit={(v, form) => getTicker(v.search, form.elements.search)}
          submitLabel="Search" submitIcon="magnifying-glass">
          <Input name="search" label="Ticker" placeholder={data?.ticker} required />
        </Form>
      </Loading>
      <div className="grid layout-2-1">
        <div>
          <Loading require={[data]}>
            <div className="graph-container round bg pad border">
              {/* order-first on the readout (canvas.js) puts it above the canvas. */}
              <div className="grid cols-1 gap-0">
                <GraphWTRC obj={data} pts={pts} base={BASE} />
              </div>
              {data && <PriceTable min={data.min} step={pts * 10} />}
              {data && <DateTable dates={data.data.map(i => i.Date)} />}
            </div>
          </Loading>
        </div>
        <div>
          <TickerList onSelect={getTicker} />
        </div>
      </div>
    </div>
  );
}

const TickerList = ({ onSelect }) => {
  const [ list, setList ] = useState(null); // false when it couldn't load
  useEffect(() => {
    get('/api/stock_lookup/ticker-list/').then(res => setList(Array.isArray(res) ? res : false));
  }, []);
  if (list === false) return <Alert tone="danger">Couldn&apos;t load the ticker list.</Alert>;
  return (
    <Loading require={[list]}>
      <Accordion>
        {list?.map((country) => (
          <AccordionItem key={country.name} header={`${country.name} (${country.list.length})`} className="bg">
            {/* One link-style button per ticker, lines between them (.divide). */}
            <ul className="grid cols-1 gap-0 divide" style={{ '--pad': '.5rem 0' }}>
              {country.list.map((item) => (
                <li key={item.Symbol} className="pad">
                  <Button onClick={() => onSelect(item.Symbol)}>{item.Name}</Button>
                </li>
              ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </Loading>
  );
}

// Price labels down the side, highest first: one per `step`, starting from min.
const PriceTable = ({ min, step }) => (
  /* Rows stretch to equal heights; the top offset is the height of the .chart-readout above the chart. */
  <div className="grid cols-1 gap-0" style={{ paddingTop: 'var(--chart-readout-height, 50px)' }}>
    {Array.from({ length: BASE / 10 }, (_, i) => min + (BASE / 10 - 1 - i) * step).map((price, i) => (
      <div className="grid cols-1 items-end justify-center" key={i}>{Math.trunc(price)}</div>
    ))}
  </div>
);

const DateTable = ({ dates }) => (
  <div className="cq center">
    {dates.map((date, i) => (
      <div className="chart-date text-center" key={i}>
        <div>{date.format('DD')} </div><div>{date.format('MM')}</div>
      </div>
    ))}
  </div>
);

export { StockLookup };
export default StockLookup;

import 'server-only';

// FRED (St. Louis Fed) stock market data. The API key never leaves the server: app/api/stock_lookup/* call these
// and return only the data the stock lookup app reads. Each throws an Error with .status when FRED fails.
const key = process.env.STOCK_LOOKUP_API_KEY;
const url = process.env.STOCK_LOOKUP_API_URL;
const CATEGORY = 32255; // FRED "Stock Market Indexes"

const fred = async (path, params) => {
  const query = new URLSearchParams({ ...params, api_key: key, file_type: 'json' });
  const res = await fetch(`${url}${path}?${query}`);
  if (!res.ok) throw Object.assign(new Error(`Stock lookup API returned ${res.status}`), { status: 502 });
  return res.json();
};

// The 25 most popular indexes, in the shape the accordion reads: groups of { Symbol, Name }.
export const popularTickers = async () => {
  const { seriess } = await fred('category/series', {
    category_id: CATEGORY, order_by: 'popularity', sort_order: 'desc', limit: 25,
  });
  return [{ name: 'Most popular', list: seriess.map(s => ({ Symbol: s.id, Name: s.title })) }];
};

// The last 100 closes of one index, newest first, Date as DD/MM/YYYY and Close as a number (the graph's shape).
// FRED marks missing days with '.'.
export const tickerHistory = async (ticker) => {
  const { observations } = await fred('series/observations', { series_id: ticker, sort_order: 'desc', limit: 100 });
  return observations.filter(o => o.value !== '.').map(o => {
    const [ y, m, d ] = o.date.split('-');
    return { Symbol: ticker, Date: `${d}/${m}/${y}`, Close: Number(o.value) };
  });
};

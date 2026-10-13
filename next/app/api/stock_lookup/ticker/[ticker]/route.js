import { NextResponse } from "next/server";

const key = process.env.STOCK_LOOKUP_API_KEY;
const url = process.env.STOCK_LOOKUP_API_URL;

// Refetch from FRED at most once an hour.
export const revalidate = 3600;

export async function GET(req, ctx) {
  const ticker = ctx.params.ticker.toUpperCase();
  const res = await fetch(`${url}series/observations?series_id=${encodeURIComponent(ticker)}&api_key=${key}&file_type=json&sort_order=desc&limit=100`);
  if (!res.ok) return NextResponse.json({ error: `Stock lookup API returned ${res.status}` }, { status: 502 });
  const { observations } = await res.json();
  // Same shape the graph already reads: newest first, Date as DD/MM/YYYY, Close as a number. FRED marks missing days with '.'.
  const historical = observations.filter(o => o.value !== '.').map(o => {
    const [ y, m, d ] = o.date.split('-');
    return { Symbol: ticker, Date: `${d}/${m}/${y}`, Close: Number(o.value) };
  });
  return NextResponse.json(historical);
}

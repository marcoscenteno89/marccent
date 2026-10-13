import { NextResponse } from "next/server";

const key = process.env.STOCK_LOOKUP_API_KEY;
const url = process.env.STOCK_LOOKUP_API_URL;
const category = 32255; // FRED "Stock Market Indexes"

// Refetch from FRED at most once a day; popularity rarely changes.
export const revalidate = 86400;

export async function GET(req, ctx) {
  const res = await fetch(`${url}category/series?category_id=${category}&api_key=${key}&file_type=json&order_by=popularity&sort_order=desc&limit=25`);
  if (!res.ok) return NextResponse.json({ error: `Stock lookup API returned ${res.status}` }, { status: 502 });
  const { seriess } = await res.json();
  // Same shape the accordion already reads: groups of { Symbol, Name }.
  return NextResponse.json([{
    name: 'Most popular',
    list: seriess.map(s => ({ Symbol: s.id, Name: s.title }))
  }]);
}

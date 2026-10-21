import { NextResponse } from "next/server";
import { tickerHistory } from "@/lib/server/fred";

// Refetch from FRED at most once an hour.
export const revalidate = 3600;

export async function GET(req, ctx) {
  try {
    return NextResponse.json(await tickerHistory(ctx.params.ticker.toUpperCase()));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status ?? 500 });
  }
}

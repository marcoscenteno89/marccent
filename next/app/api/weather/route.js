import { NextResponse } from "next/server";
import { forecast } from "@/lib/server/weather";

// GET /api/weather?q=<city>: the forecast for a city (OpenWeather's JSON and status), so the key stays on the server.
export async function GET(req) {
  const city = req.nextUrl.searchParams.get('q');
  if (!city) return NextResponse.json({ error: 'Missing ?q=<city>' }, { status: 400 });
  const { status, data } = await forecast(city);
  return NextResponse.json(data, { status });
}

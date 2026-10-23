import { NextResponse } from "next/server";
import { airQuality } from "@/lib/server/weather";

// GET /api/weather/air?lat=<lat>&lon=<lon>: air quality now and the hourly forecast (OpenWeather), key on the server.
export async function GET(req) {
  const lat = Number(req.nextUrl.searchParams.get('lat')), lon = Number(req.nextUrl.searchParams.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return NextResponse.json({ error: 'Missing ?lat=&lon=' }, { status: 400 });
  const { status, data } = await airQuality(lat, lon);
  return NextResponse.json(data, { status });
}

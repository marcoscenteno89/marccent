import 'server-only';

// OpenWeather forecast. The API key never leaves the server: app/api/weather calls this and returns the JSON as is.
const url = process.env.OPENWEATHER_URL;
const key = process.env.OPENWEATHER_API_KEY;

// 5 days in 3-hour steps for a city, imperial units. Returns OpenWeather's status (404 for an unknown city) and body.
export const forecast = async (city) => {
  const query = new URLSearchParams({ q: city, units: 'imperial', appid: key });
  const res = await fetch(`${url}data/2.5/forecast?${query}`);
  return { status: res.status, data: await res.json() };
};

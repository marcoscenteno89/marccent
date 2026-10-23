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

// Air quality now and for the next ~4 days, hourly, at a point: OpenWeather's index (1 good … 5 very poor) and the
// pollutants. Both at once; the status is the first one that failed, else 200.
export const airQuality = async (lat, lon) => {
  const query = new URLSearchParams({ lat, lon, appid: key });
  const [ now, next ] = await Promise.all([ 'air_pollution', 'air_pollution/forecast' ]
    .map(path => fetch(`${url}data/2.5/${path}?${query}`)));
  const failed = [ now, next ].find(res => !res.ok);
  if (failed) return { status: failed.status, data: await failed.json() };
  return { status: 200, data: { now: (await now.json()).list[0], forecast: (await next.json()).list } };
};

// The weather map layers OpenWeather draws as 256px map tiles (free with the same key).
export const TILE_LAYERS = [ 'clouds_new', 'precipitation_new', 'temp_new', 'wind_new', 'pressure_new' ];

// One map tile (a PNG) of a layer: the response as is, for the tile route to pass on.
export const tile = (layer, z, x, y) => fetch(`https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${key}`);

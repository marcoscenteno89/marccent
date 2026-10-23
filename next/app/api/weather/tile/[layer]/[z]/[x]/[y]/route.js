import { tile, TILE_LAYERS } from "@/lib/server/weather";

// GET /api/weather/tile/<layer>/<z>/<x>/<y>: one weather map tile (a PNG) for the weather app's map, so the key stays
// on the server. Only the known layers and whole-number tile coordinates; browsers keep a tile for 10 minutes.
export async function GET(req, { params }) {
  const { layer, z, x, y } = params;
  if (!TILE_LAYERS.includes(layer) || ![ z, x, y ].every(n => /^\d+$/.test(n))) return new Response('Not found', { status: 404 });
  const res = await tile(layer, z, x, y);
  return new Response(res.body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'image/png', 'Cache-Control': 'public, max-age=600' },
  });
}

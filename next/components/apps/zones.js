'use client';
import { useEffect, useRef, useState } from 'react';
import { Form } from 'marccent-theme/components/ui/form';
import { Input, Field } from 'marccent-theme/components/ui/field';
import { Button } from 'marccent-theme/components/ui/button';
import { StatCard } from 'marccent-theme/components/widgets/layout';
import { toastSI } from 'marccent-theme/lib/toasts';
import { cx } from 'marccent-theme/lib/cx';
import ThemedMap, { loadMapsLibrary } from './map';

/*
 * Zones: the Google Polygons WordPress plugin (fiber zones) as a front-end app, no login. Draw zones on the map (a
 * name, a color, an optional parent zone, a sign-up goal and a deadline); visitors check an address, their GPS
 * location or a pin they drop against the zones, and sign up in the one they're in. Each zone shows its sign-ups as
 * markers, its progress toward the goal and a countdown to its deadline.
 *
 * Everything is kept in this browser (localStorage); Export and Import move it as JSON. The map is the site's themed
 * map (./map); polygons and markers are drawn on it here and redrawn whenever the zones change.
 */

const KEY = 'marccent-zones';
const DAY = 86400000;

// A first look that isn't empty: a zone over central Idaho Falls with a smaller one inside it.
const demo = () => [
  {
    id: 'demo-city', name: 'Idaho Falls', color: '#1f64cf', parent: '', goal: 40,
    deadline: new Date(Date.now() + 45 * DAY).toISOString().slice(0, 10),
    path: [ { lat: 43.522, lng: -112.072 }, { lat: 43.522, lng: -111.99 }, { lat: 43.462, lng: -111.99 }, { lat: 43.462, lng: -112.072 } ],
    signups: [],
  },
  {
    id: 'demo-downtown', name: 'Downtown', color: '#e4572e', parent: 'demo-city', goal: 15,
    deadline: new Date(Date.now() + 20 * DAY).toISOString().slice(0, 10),
    path: [ { lat: 43.5, lng: -112.05 }, { lat: 43.502, lng: -112.025 }, { lat: 43.484, lng: -112.022 }, { lat: 43.482, lng: -112.047 } ],
    signups: [],
  },
];

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved)) return saved;
  } catch {}
  return demo();
};

// Is the point inside the polygon? Ray casting: count how many edges a line due east of the point crosses.
const inside = ({ lat, lng }, path) => {
  let hit = false;
  for (let i = 0, j = path.length - 1; i < path.length; j = i++) {
    const a = path[i], b = path[j];
    if ((a.lat > lat) !== (b.lat > lat) && lng < (b.lng - a.lng) * (lat - a.lat) / (b.lat - a.lat) + a.lng) hit = !hit;
  }
  return hit;
};

// How many parents a zone has above it: the deepest zone a point is in is the one it belongs to.
const depth = (zone, zones) => {
  let d = 0;
  for (let z = zone; z?.parent && d < zones.length; z = zones.find(x => x.id === z.parent)) d++;
  return d;
};
const zoneAt = (point, zones) => zones.filter(z => z.path.length > 2 && inside(point, z.path)).sort((a, b) => depth(b, zones) - depth(a, zones))[0] ?? null;

// Days, hours and minutes left until the end of the deadline day, or null once it has passed.
const timeLeft = (deadline, now) => {
  const ms = new Date(`${deadline}T23:59:59`).getTime() - now;
  if (!deadline || ms <= 0) return null;
  return { days: Math.floor(ms / DAY), hours: Math.floor(ms / 3600000) % 24, minutes: Math.floor(ms / 60000) % 60 };
};

const toLatLng = (ll) => ({ lat: ll.lat(), lng: ll.lng() });

// An address as { point, label }: Google's geocoder (the Geocoding API has to be enabled on the key), else
// OpenStreetMap's Nominatim (free, no key; light use only, one lookup a second).
const geocodeGoogle = async (address) => {
  const { Geocoder } = await loadMapsLibrary('geocoding');
  const { results } = await new Geocoder().geocode({ address });
  return results?.length ? { point: toLatLng(results[0].geometry.location), label: results[0].formatted_address } : null;
};
const geocodeOsm = async (address) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`);
  const [ hit ] = await res.json();
  return hit ? { point: { lat: Number(hit.lat), lng: Number(hit.lon) }, label: hit.display_name } : null;
};
const newId = () => `zone-${Date.now().toString(36)}`;

const Zones = () => {
  const [ zones, setZones ] = useState(null);
  const [ selected, setSelected ] = useState(null);   // the zone id shown in the panel
  const [ mode, setMode ] = useState('check');         // 'check' an address, or 'edit' the zones
  const [ draft, setDraft ] = useState(null);         // the points of a zone being drawn, while drawing
  const [ pinning, setPinning ] = useState(false);     // the next map click places the visitor's pin
  const [ result, setResult ] = useState(null);       // { point, zone, label } of the last check
  const [ now, setNow ] = useState(Date.now());
  const map = useRef(null);
  const [ mapReady, setMapReady ] = useState(false);
  const overlays = useRef([]);
  const onClick = useRef(() => {});

  useEffect(() => setZones(load()), []);
  useEffect(() => { if (zones) localStorage.setItem(KEY, JSON.stringify(zones)); }, [ zones ]);
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id); }, []);

  const zone = zones?.find(z => z.id === selected) ?? null;
  const update = (id, changes) => setZones(list => list.map(z => (z.id === id ? { ...z, ...changes } : z)));

  // The map's clicks: a point for the zone being drawn, or the visitor's pin.
  onClick.current = (point) => {
    if (draft) setDraft(d => [ ...d, point ]);
    else if (pinning) { setPinning(false); check(point, 'Dropped pin'); }
  };
  const onLoad = (m) => {
    map.current = m;
    m.addListener('click', (e) => onClick.current(toLatLng(e.latLng)));
    setMapReady(true);
  };

  // Draw the zones, their sign-ups, the shape being drawn and the last checked point.
  useEffect(() => {
    const m = map.current;
    const g = window.google?.maps;
    if (!m || !g || !zones) return;
    overlays.current.forEach(o => o.setMap(null));
    overlays.current = [];
    const add = (o) => overlays.current.push(o);
    zones.forEach(z => {
      const active = z.id === selected;
      const editable = active && mode === 'edit' && !draft;
      const polygon = new g.Polygon({
        map: m, paths: z.path, fillColor: z.color, fillOpacity: active ? 0.4 : 0.22,
        strokeColor: z.color, strokeWeight: active ? 3 : 1, editable, clickable: !draft && !pinning, zIndex: depth(z, zones),
      });
      polygon.addListener('click', (e) => (mode === 'edit' ? setSelected(z.id) : check(toLatLng(e.latLng), 'Map point')));
      if (editable) {
        const save = () => update(z.id, { path: polygon.getPath().getArray().map(toLatLng) });
        [ 'set_at', 'insert_at', 'remove_at' ].forEach(ev => polygon.getPath().addListener(ev, save));
      }
      add(polygon);
      z.signups.forEach(s => add(new g.Marker({
        map: m, position: s, title: s.name || 'Sign-up',
        icon: { path: g.SymbolPath.CIRCLE, scale: 5, fillColor: z.color, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 1.5 },
      })));
    });
    if (draft) {
      add(new g.Polyline({ map: m, path: draft, strokeColor: '#111', strokeWeight: 2 }));
      draft.forEach(p => add(new g.Marker({ map: m, position: p, icon: { path: g.SymbolPath.CIRCLE, scale: 4, fillColor: '#111', fillOpacity: 1, strokeWeight: 0 } })));
    }
    if (result) add(new g.Marker({ map: m, position: result.point, title: result.label }));
    m.setOptions({ draggableCursor: draft || pinning ? 'crosshair' : null });
  }, [ zones, selected, mode, draft, pinning, result, mapReady ]);

  // A zone chosen: fit the map to it.
  useEffect(() => {
    const g = window.google?.maps;
    if (!map.current || !g || !zone || draft) return;
    const bounds = new g.LatLngBounds();
    zone.path.forEach(p => bounds.extend(p));
    map.current.fitBounds(bounds, 40);
  }, [ selected, mapReady ]);

  // Checks: which zone a point is in, from an address (geocoded), the device's location or a dropped pin.
  function check(point, label) {
    const found = zoneAt(point, zones);
    setResult({ point, zone: found?.id ?? null, label });
    if (found) setSelected(found.id);
    map.current?.panTo(point);
    toastSI.add(found ? `${label} is in ${found.name}.` : `${label} is outside every zone.`, found ? 'success' : 'warning');
  }
  const checkAddress = async ({ address }) => {
    const found = await geocodeGoogle(address).catch(() => null) ?? await geocodeOsm(address).catch(() => null);
    if (found) check(found.point, found.label);
    else toastSI.add('That address could not be found. Try your location or drop a pin.', 'danger');
  };
  const checkGps = () => {
    if (!navigator.geolocation) return toastSI.add('This browser can\'t share its location.', 'danger');
    navigator.geolocation.getCurrentPosition(
      (pos) => check({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'Your location'),
      () => toastSI.add('Location was not shared.', 'danger'),
    );
  };
  const signUp = ({ name, email, phone }) => {
    const target = zones.find(z => z.id === result.zone);
    update(target.id, { signups: [ ...target.signups, { ...result.point, name, email, phone, address: result.label, date: new Date().toISOString() } ] });
    setResult(null);
    toastSI.add(`Signed up in ${target.name}.`, 'success');
  };

  // Editing: draw a new zone point by point, change its details, delete it, move everything in and out as JSON.
  const finishDraft = () => {
    if (draft.length < 3) return toastSI.add('A zone needs at least 3 points.', 'warning');
    const id = newId();
    setZones(list => [ ...list, { id, name: `Zone ${list.length + 1}`, color: '#2a9d8f', parent: '', goal: 20, deadline: '', path: draft, signups: [] } ]);
    setDraft(null);
    setSelected(id);
  };
  const remove = (id) => {
    setZones(list => list.filter(z => z.id !== id).map(z => (z.parent === id ? { ...z, parent: '' } : z)));
    setSelected(null);
  };
  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([ JSON.stringify(zones, null, 2) ], { type: 'application/json' }));
    Object.assign(document.createElement('a'), { href: url, download: 'zones.json' }).click();
    URL.revokeObjectURL(url);
  };
  const importJson = async (file) => {
    try {
      const list = JSON.parse(await file.text());
      if (!Array.isArray(list) || !list.every(z => z.id && Array.isArray(z.path))) throw new Error();
      setZones(list.map(z => ({ signups: [], ...z })));
      setSelected(null);
      toastSI.add(`Imported ${list.length} zones.`, 'success');
    } catch {
      toastSI.add('That file is not a zones export.', 'danger');
    }
  };

  if (!zones) return null;
  const checked = result && zones.find(z => z.id === result.zone);
  return (
    <div data-component="zones" className="grid" style={{ '--cols': 3, '--min': '18rem' }}>
      <Card name="map" className="span-2" style={{ gridTemplateRows: 'auto minmax(26rem, 1fr)' }}>
        <div className="grid gap-sm items-center" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
          <div className="row-wrap" role="group" aria-label="Mode" style={{ '--gap': 'var(--space-xs)' }}>
            <Button icon="location-crosshairs" aria-pressed={mode === 'check'} onClick={() => { setMode('check'); setDraft(null); }}>Check an address</Button>
            <Button icon="draw-polygon" aria-pressed={mode === 'edit'} onClick={() => { setMode('edit'); setPinning(false); }}>Edit zones</Button>
          </div>
          <span className="fs-sm opacity-75">{draft ? `Drawing: ${draft.length} points` : pinning ? 'Click the map to drop your pin' : `${zones.length} zones`}</span>
        </div>
        <ThemedMap zoom={12} onLoad={onLoad} className="w-100 h-100 round" style={{ minHeight: '26rem' }} />
      </Card>

      <Card name="panel">
        {mode === 'check' ? (
          <>
            <h2 className="h3">Is your address in a zone?</h2>
            <Form className="grid cols-1 gap-sm" onSubmit={checkAddress} submitLabel="Check address" submitIcon="magnifying-glass">
              <Input name="address" label="Street, city, state and zip" required />
            </Form>
            <div className="row-wrap" style={{ '--gap': 'var(--space-xs)' }}>
              <Button icon="location-arrow" onClick={checkGps}>Use my location</Button>
              <Button icon="map-pin" aria-pressed={pinning} onClick={() => setPinning(p => !p)}>Drop a pin</Button>
            </div>
            {result && (checked ? (
              <div className="grid cols-1 gap-sm">
                <p><strong>{result.label}</strong> is in <strong>{checked.name}</strong>. Sign up to count toward its goal.</p>
                <Form className="grid cols-1 gap-sm" onSubmit={signUp} submitLabel="Sign up" submitIcon="user-plus">
                  <Input name="name" required autoComplete="name" />
                  <Input name="email" type="email" autoComplete="email" />
                  <Input name="phone" type="tel" autoComplete="tel" />
                </Form>
              </div>
            ) : (
              <p><strong>{result.label}</strong> is outside every zone right now. Try your location or drop a pin on the house if the address was found in the wrong place.</p>
            ))}
          </>
        ) : draft ? (
          <>
            <h2 className="h3">Draw a zone</h2>
            <p>Click the map to place each corner. When the shape is closed in, finish it; you can drag its corners afterward.</p>
            <div className="row-wrap" style={{ '--gap': 'var(--space-xs)' }}>
              <Button icon="check" className="primary" onClick={finishDraft}>Finish ({draft.length})</Button>
              <Button icon="rotate-left" disabled={!draft.length} onClick={() => setDraft(d => d.slice(0, -1))}>Undo point</Button>
              <Button icon="xmark" onClick={() => setDraft(null)}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="h3">Zones</h2>
            <div className="grid cols-1 gap-sm">
              {zones.map(z => (
                <Button key={z.id} icon="draw-polygon" aria-pressed={z.id === selected} onClick={() => setSelected(z.id)} style={{ justifyContent: 'start' }}>
                  <span aria-hidden="true" style={{ color: z.color }}>●</span> {z.parent ? '↳ ' : ''}{z.name} · {z.signups.length}/{z.goal || '–'}
                </Button>
              ))}
            </div>
            <div className="row-wrap" style={{ '--gap': 'var(--space-xs)' }}>
              <Button icon="plus" className="primary" onClick={() => { setDraft([]); setSelected(null); }}>New zone</Button>
              <Button icon="download" onClick={exportJson}>Export</Button>
              <label className="btn" data-component="button">
                <i className="fa-solid fa-upload btn-icon" aria-hidden="true" /><span className="btn-text">Import</span>
                <input type="file" accept="application/json" hidden onChange={(e) => e.target.files[0] && importJson(e.target.files[0])} />
              </label>
            </div>
            {zone && (
              <Form key={zone.id} className="grid gap-sm pairs" submitLabel="Save zone" submitIcon="floppy-disk"
                onSubmit={(v) => { update(zone.id, { name: v.name, color: v.color, parent: v.parent, goal: Number(v.goal) || 0, deadline: v.deadline }); toastSI.add('Zone saved.', 'success'); }}>
                <Field name="name" defaultValue={zone.name} required />
                <Field name="color" type="color" defaultValue={zone.color} />
                <Field name="parent" label="inside" as="select" defaultValue={zone.parent}>
                  <option value="">No parent zone</option>
                  {zones.filter(z => z.id !== zone.id).map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </Field>
                <Field name="goal" label="sign-up goal" type="number" min="0" defaultValue={zone.goal} />
                <Field name="deadline" type="date" defaultValue={zone.deadline} />
              </Form>
            )}
            {zone && <Button icon="trash" className="danger" onClick={() => remove(zone.id)}>Delete {zone.name}</Button>}
          </>
        )}
      </Card>

      {zone && <ZoneStats zone={zone} now={now} />}
    </div>
  );
};

// The panel's cards: the site's panel look (bg border round shadow pad), content in one column.
const Card = ({ name, className, style, children }) => (
  <div data-component="zones-card" data-name={name} className={cx('bg border round shadow pad grid cols-1 gap-sm content-start', className)} style={style}>{children}</div>
);

// The chosen zone's progress: sign-ups toward the goal (a ring that fills), and the time left (the plugin's
// "offer expires" countdown).
const ZoneStats = ({ zone, now }) => {
  const left = timeLeft(zone.deadline, now);
  const pct = zone.goal ? Math.min(100, Math.round(zone.signups.length / zone.goal * 100)) : 0;
  return (
    <>
      <StatCard name="goal" className="bg border" accent icon="users" fill={pct} value={`${zone.signups.length} of ${zone.goal || '–'}`} label={`${zone.name}: ${pct}% of the goal`} />
      <StatCard name="countdown" className="bg border" icon="hourglass-half"
        value={left ? `${left.days}d ${left.hours}h ${left.minutes}m` : zone.deadline ? 'Closed' : 'No deadline'}
        label={zone.deadline ? `Sign-ups close ${new Date(`${zone.deadline}T12:00`).toLocaleDateString()}` : 'Set a deadline under Edit zones'} />
      <Card name="signups">
        <h2 className="h3">Sign-ups in {zone.name}</h2>
        {zone.signups.length ? (
          <ul className="grid cols-1 gap-sm fs-sm">
            {zone.signups.slice(-8).reverse().map(s => <li key={s.date}>{s.name}{s.address ? `, ${s.address}` : ''}</li>)}
          </ul>
        ) : <p className="fs-sm opacity-75">None yet. Check an address inside the zone to add the first.</p>}
      </Card>
    </>
  );
};

export default Zones;

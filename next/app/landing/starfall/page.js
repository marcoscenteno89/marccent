import '@fontsource-variable/josefin-sans';
import '@fontsource-variable/lora';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Button } from 'marccent-theme/components/ui/button';
import { Scenery } from 'marccent-theme/components/visuals/scenery';
import { SolarSystem } from 'marccent-theme/components/visuals/effects';
import { TabBar } from 'marccent-theme/components/widgets/nav';
import { Calendar } from '@/components/widgets/calendar';
import { ImageCard } from 'marccent-theme/components/widgets/layout';
import ThemedMap from '@/components/apps/map';
import { Page, Full, Box } from '../blocks';
import { SignupBar, ContactForm, CountUp } from '../parts';
import { img } from '@/lib/img';

/*
 * Landing page: Starfall Mesa, a (fictional) dark-sky lodge and observatory in the Utah desert. Quiet and wide open:
 * Josefin Sans headings in spaced capitals over Lora, campfire amber and twilight blue on the visitor's mode, three
 * full-screen landscapes (night, canyon at dusk, the dunes) with the sections between them, the sky tonight, stays in
 * tabs with a photo each, passes on deep-space cards (the widgets page's card 15), a dark-sky calendar and the turnoff on a map. Hover: hover-holographic
 * (the passes; buttons have it by default).
 */

export const metadata = { title: 'Starfall Mesa: a dark-sky lodge in the Utah desert' };

const PALETTE = { primary: '#f0a35e', secondary: '#6f7fe0', dark: '#0c0f1f', light: '#f7f0e6' }; // ember, twilight, night, sand

// Skies for the landscapes, mixed from the palette into the page color, so they follow the visitor's mode like the layers.
const SKY = {
  night: 'linear-gradient(color-mix(in srgb, var(--secondary) 26%, var(--body-bg)), var(--body-bg))',
  dusk: 'linear-gradient(color-mix(in srgb, var(--secondary) 18%, var(--body-bg)), color-mix(in srgb, var(--primary) 34%, var(--body-bg)))',
  noon: 'linear-gradient(var(--body-bg), color-mix(in srgb, var(--primary) 22%, var(--body-bg)))',
};
const CAPS = { letterSpacing: '.3em', textTransform: 'uppercase' };

// Section heading: a spaced-capitals kicker over a light title.
const Head = ({ kicker, title, text, center }) => (
  <header className={center ? 'grid cols-1 gap-sm text-center justify-center' : 'grid cols-1 gap-sm'} style={{ maxWidth: '42rem', justifySelf: center ? 'center' : undefined }}>
    <small className="fw-bold text-primary" style={CAPS}>{kicker}</small>
    <h2 className="display-sm" style={{ fontWeight: 300 }}>{title}</h2>
    {text && <p className="fs-lg opacity-75">{text}</p>}
  </header>
);

// A full-screen landscape, its own section; children centered over the sky.
const Landscape = ({ id, layers, sky, children }) => (
  <section id={id} className="wrap wrap-fluid pad-0">
    <Scenery layers={layers} height="100vh" min="40vh" parallax={false} style={{ background: sky }}>{children}</Scenery>
  </section>
);

// What's up tonight, by the hour (one row each: time, what, where to look).
const TONIGHT = [
  [ '7:40 PM', 'Saturn rises', 'east, low', 'circle-half-stroke' ],
  [ '9:15 PM', 'Andromeda galaxy', 'overhead', 'hurricane' ],
  [ '11:00 PM', 'Orion clears the mesa', 'southeast', 'person-hiking' ],
  [ '2:30 AM', 'Milky Way core', 'south', 'star' ],
];

// Stays, each a tab: what it is, what's in it, the price a night.
const STAYS = [
  { label: 'Glass domes', icon: 'circle', src: 'blue5', overlay: 'glass', price: 340, sleeps: 2, text: 'A geodesic dome with a clear roof over the bed: you fall asleep under the stars without stepping outside.',
    has: [ 'King bed under the clear roof', 'Wood stove and blackout blinds', 'Private deck with a fire pit' ] },
  { label: 'Canyon cabins', icon: 'house', src: 'orange5', overlay: 'fade', price: 260, sleeps: 4, text: 'Juniper-clad cabins on the rim, two rooms and a porch facing the canyon at sunrise.',
    has: [ 'Two queen beds', 'Kitchenette, coffee on the porch', 'Red-light reading lamps' ] },
  { label: 'Airstreams', icon: 'caravan', src: 'gray1', overlay: 'blur', price: 185, sleeps: 2, text: 'Restored 1970s trailers on the dunes, the quietest corner of the mesa.',
    has: [ 'Double bed, cedar outdoor shower', 'Telescope on the steps', 'A ten-minute walk to the lodge' ] },
];

// The dark-sky calendar: new moons (the darkest nights) and meteor-shower peaks.
const SKY_EVENTS = [
  { date: '2026-10-21', title: 'Orionids peak, up to 20 an hour', color: 'bg-primary' },
  { date: '2026-11-09', title: 'New moon: darkest night of the month', color: 'bg-secondary' },
  { date: '2026-11-17', title: 'Leonids peak, up to 15 an hour', color: 'bg-primary' },
  { date: '2026-12-09', title: 'New moon', color: 'bg-secondary' },
  { date: '2026-12-14', title: 'Geminids peak, up to 120 an hour', color: 'bg-primary' },
  { date: '2027-01-03', title: 'Quadrantids peak', color: 'bg-primary' },
  { date: '2027-01-07', title: 'New moon', color: 'bg-secondary' },
];

// Deep space for the pass cards (card 15 on the widgets page): dots of starlight over a twilight glow, from the palette.
const SPACE = [ [ 20, 30, 1 ], [ 70, 15, 1 ], [ 85, 60, 1.5 ], [ 35, 80, 1 ], [ 55, 50, 1 ], [ 10, 65, 1.5 ], [ 90, 88, 1 ] ]
  .map(([ x, y, r ]) => `radial-gradient(${r}px ${r}px at ${x}% ${y}%, var(--light), transparent)`)
  .concat('radial-gradient(circle at 30% 20%, var(--secondary-darker), var(--dark) 70%)').join(', ');

const PASSES = [
  { icon: 'moon', label: 'Night pass', price: 45, per: 'a person', has: [ 'Two hours at the 24" telescope', 'Guided sky tour', 'Hot cocoa by the fire' ] },
  { icon: 'camera-retro', label: 'Astrophotography', price: 180, per: 'a night', has: [ 'Your own tracking mount', 'Camera, lenses and filters', 'Processing class next morning' ] },
  { icon: 'meteor', label: 'Meteor vigil', price: 90, per: 'a person', has: [ 'Peak nights only', 'Loungers and blankets', 'Breakfast at sunrise' ] },
];

// A pass: a breathing icon, the name in spaced capitals, the price, what's in it. All in the card's light text: no
// colored content on the twilight.
const PassCard = ({ icon, label, price, per, has }) => (
  <article className="round shadow pad grid cols-1 gap-sm justify-center text-center h-100 hover-holographic" style={{ alignContent: 'center', color: 'var(--light)', background: SPACE }}>
    <Icon name={icon} className="display-sm loader-breathe" style={{ justifySelf: 'center', '--icon-size': '1.4em' }} />
    <small className="fw-bold" style={{ ...CAPS, opacity: .8 }}>{label}</small>
    <div><span className="display fw-bold">${price}</span> <small style={{ opacity: .7 }}>{per}</small></div>
    <ul className="grid cols-1 gap-sm pad-y-sm" style={{ opacity: .85 }}>{has.map(h => <li key={h}>{h}</li>)}</ul>
    <Button icon="ticket" href="#visit" className="light" style={{ justifySelf: 'center' }}>Choose</Button>
  </article>
);

export default function Starfall() {
  return (
    <Page palette={PALETTE} style={{ '--font-heading': '"Josefin Sans Variable", "Segoe UI", sans-serif', '--font-body': '"Lora Variable", Georgia, serif', fontFamily: 'var(--font-body)' }}>

      {/* NAV: a thin line over the night. */}
      <Full space="1rem" className="bg" inner="grid layout-ends items-center gap-sm">
        <a href="#top" className="grid auto-cols gap-sm items-center fw-bold" style={{ color: 'inherit', textDecoration: 'none', fontFamily: 'var(--font-heading)', ...CAPS }}>
          <span className="shape-moon bg-gradient" style={{ width: '1.6rem', aspectRatio: 1 }} />Starfall Mesa
        </a>
        <div className="grid auto-cols gap-lg">{[ 'Sky', 'Stays', 'Passes', 'Visit' ].map(n => <a key={n} href={`#${n.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none', opacity: .8 }}>{n}</a>)}</div>
        <Button icon="moon" href="#visit" className="col-last gradient icon-only-sm">Book a night</Button>
      </Full>

      {/* HERO: Monument Valley at night; the stars drift, the cacti hold. */}
      <Landscape layers={[ 'stars', 'moon', 'mesas', 'buttes', 'dunes', 'cactus' ]} sky={SKY.night}>
        <small className="fw-bold opacity-75" style={CAPS}>Bortle class 1 · elevation 1,650 m</small>
        <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 6.5rem)', fontWeight: 300, lineHeight: 1, maxWidth: '12ch' }}>The darkest sky you&apos;ll ever sleep under</h1>
        <p className="fs-lg opacity-75" style={{ maxWidth: '34rem' }}>A small lodge and observatory three hours from the nearest city light. Bring a jacket; we bring the telescopes.</p>
        <Button icon="arrow-down" href="#sky" className="light">See tonight&apos;s sky</Button>
      </Landscape>

      {/* SHORT: tonight's conditions, boxed. */}
      <Box inner="grid gap-sm items-center text-center" style={{ '--cols': 4, '--min': '9rem' }}>
        {[ [ 'cloud', '0%', 'cloud cover' ], [ 'eye', '4.6 / 5', 'seeing' ], [ 'moon', '3%', 'moon lit' ], [ 'temperature-low', '6 °C', 'at midnight' ] ].map(([ i, v, l ]) => (
          <div key={l} className="grid cols-1 gap-0">
            <span className="fs-lg"><Icon name={i} className="text-secondary" /> <strong>{v}</strong></span>
            <small className="opacity-75" style={CAPS}>{l}</small>
          </div>
        ))}
      </Box>

      {/* SKY: the solar system to play with and tonight's timetable. */}
      <Full id="sky" className="bg">
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="grid cols-1 gap-lg">
            <Head kicker="the sky tonight" title="What's up, hour by hour" text="Our astronomer posts the night's plan at sunset. Click a planet to meet it." />
            {/* .pairs: the times line up in one column, whatever their width. */}
            <ol className="grid pairs gap-0">
              {TONIGHT.map(([ t, what, where, icon ]) => (
                <li key={t} className="sub-x items-center pad-y-sm border-bottom">
                  <strong className="text-primary" style={{ fontVariantNumeric: 'tabular-nums', paddingInlineEnd: '1.25rem' }}>{t}</strong>
                  <span><Icon name={icon} className="text-secondary" /> {what} <small className="opacity-75">· {where}</small></span>
                </li>
              ))}
            </ol>
          </div>
          <SolarSystem />
        </div>
      </Full>

      {/* CANYON: the rim at dusk, the numbers over it. */}
      <Landscape id="rim" layers={[ 'sun', 'wisps', 'birds', 'mesas', 'canyon', 'canyon', 'rim' ]} sky={SKY.dusk}>
        <small className="fw-bold opacity-75" style={CAPS}>by day</small>
        <h2 className="display-lg" style={{ fontWeight: 300 }}>Sleep late. The canyon waits.</h2>
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '9rem', maxWidth: '40rem', width: '100%' }}>
          {[ [ 48, '', 'km of rim trails' ], [ 9, '', 'telescopes' ], [ 360, '', 'clear nights a year', ] ].map(([ v, s, l ]) => (
            <div key={l} className="grid cols-1 gap-0"><CountUp to={v} suffix={s} className="display-sm" /><small style={CAPS}>{l}</small></div>
          ))}
        </div>
      </Landscape>

      {/* STAYS: three kinds, one tab each. */}
      <Full id="stays" className="bg">
        <Head kicker="where you sleep" title="Twelve places to stay, none of them with a TV" />
        <TabBar tabs={STAYS.map(s => ({ label: s.label, icon: s.icon, content: (
          <div className="grid gap-lg items-center pad-y" style={{ '--cols': 2, '--min': '16rem' }}>
            <div className="grid cols-1 gap-sm">
              <p className="fs-lg">{s.text}</p>
              <ul className="grid cols-1 gap-sm">{s.has.map(h => <li key={h} className="grid auto-cols gap-sm items-center justify-start"><Icon name="check" className="text-primary" />{h}</li>)}</ul>
            </div>
            <ImageCard src={img(s.src)} overlay={s.overlay} ratio="4 / 3" badge={`from $${s.price} a night`} label={`Sleeps ${s.sleeps}`} title={s.label}>
              <Button icon="moon" href="#visit" className="light">Book it</Button>
            </ImageCard>
          </div>
        ) }))} />
      </Full>

      {/* PASSES: deep-space cards for the observatory. */}
      <Full id="passes" mode="dark">
        <Head center kicker="the observatory" title="Passes for the dome" text="Every stay includes a night pass. Day visitors are welcome too." />
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '15rem' }}>
          {PASSES.map(p => <PassCard key={p.label} {...p} />)}
        </div>
      </Full>

      {/* DUNES: a quote over the sand. */}
      <Landscape layers={[ 'sun', 'birds', 'mesas', 'dunes', 'dunes', 'cactus' ]} sky={SKY.noon}>
        <blockquote style={{ margin: 0, fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 'clamp(1.6rem, 4vw, 3rem)', lineHeight: 1.25, maxWidth: '24ch' }}>
          &ldquo;My kids counted 41 shooting stars and then fell asleep mid-sentence.&rdquo;
        </blockquote>
        <small className="fw-bold opacity-75" style={CAPS}>The Okafors, Geminids 2025</small>
      </Landscape>

      {/* VISIT: the calendar, a booking form and the turnoff. */}
      <Full id="visit" className="bg">
        <Head kicker="plan your nights" title="Come for a new moon" text="The darkest nights book first. Blue dots are new moons, amber ones meteor showers." />
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '17rem' }}>
          <Calendar events={SKY_EVENTS} />
          <div className="pad round border">
            <ContactForm topics={STAYS.map(s => s.label).concat('Just the observatory')} submitLabel="Request my nights" done="Request sent. We'll confirm your nights within a day." />
          </div>
          <div className="grid cols-1 gap-sm content-start">
            <strong><Icon name="location-dot" className="text-primary" /> The turnoff</strong>
            <ThemedMap center={{ lat: 38.3725, lng: -110.7146 }} zoom={11} className="round" style={{ minHeight: '18rem' }} />
            <small className="opacity-75">22 km of gravel south of Hanksville, Utah. Any car makes it; headlights off at the gate.</small>
          </div>
        </div>
      </Full>

      {/* SHORT: dark-sky promise, boxed. */}
      <Box className="bg-gradient-darker" style={{ color: 'var(--light)' }} inner="grid gap-sm items-center text-center">
        <div className="grid gap-sm" style={{ '--cols': 3, '--min': '11rem' }}>
          {[ [ 'lightbulb', 'Only red, shielded lights' ], [ 'solar-panel', 'Run on the sun' ], [ 'shield-heart', 'A certified dark-sky place' ] ].map(([ i, t ]) => (
            <span key={t} className="center gap-sm"><Icon name={i} />{t}</span>
          ))}
        </div>
      </Box>

      {/* NEWSLETTER + FOOTER */}
      <Full space="3rem" className="bg">
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <div><small className="fw-bold text-primary" style={CAPS}>the night report</small><h3 style={{ fontWeight: 300 }}>One email a month: what to look up at</h3></div>
          <SignupBar label="Subscribe" icon="envelope" placeholder="Your email" done="Subscribed. Clear skies!" />
        </div>
        <small>&copy; 2026 Starfall Mesa Lodge, a fictional company: a demo landing page for this theme.</small>
      </Full>
    </Page>
  );
}

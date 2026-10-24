import '@fontsource-variable/fraunces';
import '@fontsource-variable/caveat';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Button } from 'marccent-theme/components/ui/button';
import { Scenery } from 'marccent-theme/components/visuals/scenery';
import { Timeline, ImageCard } from 'marccent-theme/components/widgets/layout';
import { RingGauge } from '@/components/widgets/data';
import { Carousel } from 'marccent-theme/components/widgets/carousel';
import ThemedMap from '@/components/apps/map';
import { Page, Full, Box } from '../blocks';
import { SignupBar, ContactForm, CountUp, TripPicker } from '../parts';

/*
 * Landing page: Ridgeline Expeditions, a (fictional) small-group trekking company. Editorial and outdoorsy: Fraunces
 * headings, handwritten notes (Caveat), rust and moss on sand, full-bleed landscapes, postcard trip cards, a photo
 * collage from the trail, a topographic guide wall, an elevation profile and the meeting point on a map. Hover: hover-holographic (cards; buttons have it by default).
 */

export const metadata = { title: 'Ridgeline Expeditions: guided treks' };

const PALETTE = { primary: '#c2643a', secondary: '#2f5244', dark: '#1d1a16', light: '#f4ecdf' }; // rust, moss, ink, sand
const HAND = { fontFamily: '"Caveat Variable", "Segoe Print", cursive' };

// Section heading: a handwritten note above a serif title.
const Head = ({ note, title, text, light }) => (
  <header className="grid cols-1 gap-sm" style={{ maxWidth: '44rem' }}>
    <span className="fs-lg" style={{ ...HAND, fontSize: '1.6rem', color: light ? 'var(--primary-lighter)' : 'var(--primary)' }}>{note}</span>
    <h2 className="display-sm" style={{ fontWeight: 600 }}>{title}</h2>
    {text && <p className="fs-lg" style={{ opacity: .8 }}>{text}</p>}
  </header>
);

const TRIPS = [
  { name: 'Torres del Paine W', where: 'Patagonia, Chile', days: 9, price: '3,450', sky: 'linear-gradient(var(--primary-lighter), var(--light))', peak: 'var(--secondary-darker)', note: 'only 2 seats left!' },
  { name: 'Alta Via 1', where: 'Dolomites, Italy', days: 8, price: '2,890', sky: 'linear-gradient(var(--primary), var(--primary-lighter))', peak: 'var(--dark)', note: 'rifugio pasta, daily' },
  { name: 'Laugavegur Trail', where: 'Highlands, Iceland', days: 6, price: '2,350', sky: 'linear-gradient(var(--secondary), var(--primary-lighter))', peak: 'var(--secondary-darker)', note: 'northern lights season' },
  { name: 'Everest Base Camp', where: 'Khumbu, Nepal', days: 14, price: '4,190', sky: 'linear-gradient(var(--light), var(--secondary-lighter))', peak: 'var(--secondary)', note: '5,364 m, you did it' },
  { name: 'Tour du Mont Blanc', where: 'France · Italy · Switzerland', days: 11, price: '3,980', sky: 'linear-gradient(var(--secondary-lighter), var(--primary-lighter))', peak: 'var(--dark)', note: 'three countries, one loop' },
];

// A postcard: a printed picture (sky and peaks from shapes) with a white border, a stamp, a handwritten line.
const Postcard = ({ t, i }) => (
  <article className="shadow-lg grid cols-1 gap-sm h-100 hover-holographic" style={{ background: 'var(--light)', color: 'var(--dark)', padding: '.6rem .6rem 1rem', rotate: `${i % 2 ? 1.2 : -1.2}deg` }}>
    <div className="stack" style={{ aspectRatio: '4 / 3', background: t.sky }}>
      <div className="circle" style={{ width: '16%', aspectRatio: 1, placeSelf: 'start start', margin: '10%', background: 'var(--light)', opacity: .8 }} />
      <div className="shape-triangle" style={{ width: '85%', placeSelf: 'end start', translate: '-15% 0', background: t.peak, opacity: .7 }} />
      <div className="shape-triangle" style={{ width: '70%', placeSelf: 'end end', translate: '10% 0', background: t.peak }} />
      <div className="col-center fw-bold" style={{ placeSelf: 'start end', margin: '.5rem', width: '3.2rem', aspectRatio: '.8', background: 'var(--light)', border: '2px dashed var(--primary)', color: 'var(--primary)', fontSize: '.7rem', rotate: '6deg' }}>
        <Icon name="mountain" />${t.price.split(',')[0]}k
      </div>
    </div>
    <div className="grid cols-1 gap-0 pad-x-sm">
      <span style={{ ...HAND, fontSize: '1.35rem', color: 'var(--primary)' }}>{t.note}</span>
      <h3 className="h4" style={{ fontWeight: 600 }}>{t.name}</h3>
      <small style={{ opacity: .7 }}>{t.where} · {t.days} days · from ${t.price}</small>
    </div>
  </article>
);

// Elevation along the Paine W (m), day by day: one series, so the caption names it.
const ELEVATION = [ [ 'D1', 50 ], [ 'D2', 870 ], [ 'D3', 120 ], [ 'D4', 640 ], [ 'D5', 90 ], [ 'D6', 250 ], [ 'D7', 40 ] ];

export default function Ridgeline() {
  const max = Math.max(...ELEVATION.map(e => e[1]));
  return (
    <Page palette={PALETTE} style={{ '--font-heading': '"Fraunces Variable", Georgia, serif' }}>

      {/* NAV: a forest strip. */}
      <Full space="1rem" className="bg-secondary-darker" style={{ color: 'var(--light)' }} inner="grid layout-ends items-center gap-sm">
        <a href="#top" className="grid auto-cols gap-sm items-center fs-lg" style={{ color: 'inherit', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
          <span className="shape-triangle bg-gradient" style={{ width: '1.8rem' }} />Ridgeline
        </a>
        <div className="grid auto-cols gap-lg">{[ 'Trips', 'Guides', 'Book' ].map(n => <a key={n} href={`#${n.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none', opacity: .85 }}>{n}</a>)}</div>
        <Button icon="compass" href="#book" className="col-last light icon-only-sm">Plan a trip</Button>
      </Full>

      {/* HERO: a full-bleed landscape; the ridges drift at their depths. */}
      <section data-theme="light" className="wrap wrap-fluid pad-0">
        <Scenery layers={[ 'sun', 'birds', 'mountains', 'mountains', 'hills', 'forest' ]} parallax={false} height="min(42rem, 90vh)"
          style={{ background: 'linear-gradient(var(--light), var(--primary-lighter))', color: 'var(--dark)' }}>
          <span style={{ ...HAND, fontSize: '2rem', color: 'var(--primary)' }}>small groups · since 2009</span>
          <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)', fontWeight: 600, lineHeight: 1, maxWidth: '14ch' }}>Walk the world&apos;s great ridgelines</h1>
          <p className="fs-lg" style={{ maxWidth: '32rem' }}>Fully guided treks for 4 to 10 people. We carry the logistics; you carry a day pack.</p>
          <Button icon="compass" href="#trips" className="dark">Find your trek</Button>
        </Scenery>
      </section>

      {/* SHORT: the season's news, boxed over the site. */}
      <Box mode="light" inner="grid layout-ends items-center gap-sm">
        <span style={{ ...HAND, fontSize: '1.6rem', color: 'var(--primary)' }}>new!</span>
        <span><strong>2027 departures are open.</strong> Book before December 1 and the early-bird 10% is yours.</span>
        <Button icon="calendar-plus" href="#book" className="gradient col-last">See dates</Button>
      </Box>

      {/* INTRO: an editorial paragraph and field notes. */}
      <Full mode="light">
        <div className="grid gap-lg layout-2-1">
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', lineHeight: 1.45 }}>
            <strong style={{ color: 'var(--primary)' }}>We started with one</strong>{' '}
            trail and a borrowed van. Seventeen years later our guides still grow up on the mountains they lead, the groups are still
            small enough to share one table at dinner, and the van has been retired with honors.
          </p>
          <div className="grid cols-1 content-center" style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1.5rem' }}>
            {[ [ 14200, '+', 'trekkers guided' ], [ 32, '', 'countries' ], [ 4.9, ' / 5', 'from 3,100 reviews', 1 ] ].map(([ v, s, l, d ]) => (
              <div key={l}><CountUp to={v} suffix={s} decimals={d ?? 0} className="display-sm" /><br /><span style={{ ...HAND, fontSize: '1.3rem' }}>{l}</span></div>
            ))}
          </div>
        </div>
      </Full>

      {/* TRIPS: postcards in a carousel. */}
      <Full id="trips" className="bg-secondary-darker" style={{ color: 'var(--light)' }}>
        <Head light note="the 2027 season" title="Treks we lead" text="Every departure is capped at ten people and led by a certified local guide. Swipe through, or use the arrow keys." />
        <Carousel label="Treks" slideWidth="18rem">{TRIPS.map((t, i) => <Postcard key={t.name} t={t} i={i} />)}</Carousel>
      </Full>

      {/* PHOTOS: the trail in a dense collage, one big photo, snow on the Khumbu, the summit rate on a ring. */}
      <Full mode="light">
        <Head note="from last season's group chats" title="Photos our trekkers sent home" />
        <div className="grid" style={{ '--cols': 4, '--min': '13rem', gridAutoRows: 'minmax(13rem, auto)', gridAutoFlow: 'dense' }}>
          <ImageCard src="/img/teal3.webp" ratio={null} big className="span-2" style={{ gridRow: 'span 2' }} badge="Day 4"
            label="Torres del Paine · Chile" title="Glacier water, the color of a postcard" />
          <ImageCard src="/img/white2.webp" canvas="snow" colors="#fff" ratio={null} overlay="blur" badge="-9°C" label="Khumbu · Nepal" title="Snow on the way to Namche" />
          <ImageCard src="/img/blue4.webp" ratio={null} overlay="focus" align="center" label="Dolomites · Italy" title="Last light at the rifugio" />
          <article className="bg-secondary round shadow pad grid cols-1 gap-sm justify-center text-center hover-holographic" style={{ alignContent: 'center', color: 'var(--light)' }}>
            <div className="col-center"><RingGauge value={94} label="reached the top" size="7rem" /></div>
            <span style={{ ...HAND, fontSize: '1.35rem' }}>of trekkers made every pass in 2026</span>
          </article>
          <ImageCard src="/img/yellow3.webp" ratio={null} overlay="glass" label="Tour du Mont Blanc" title="Meadows between three countries" />
        </div>
      </Full>

      {/* ITINERARY: the day-by-day and an elevation profile. */}
      <Full className="bg">
        <div className="grid gap-lg" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="grid cols-1 gap-lg content-start">
            <Head note="sample itinerary" title="Torres del Paine W, day by day" text="Nine days from Puerto Natales: four on trail, two rest days, every transfer arranged." />
            <figure className="grid cols-1 gap-sm" style={{ margin: 0 }}>
              <figcaption className="fw-bold">Highest point each day (m)</figcaption>
              <div className="grid fixed items-end border-bottom" role="img" aria-label={ELEVATION.map(([ d, m ]) => `${d} ${m} m`).join(', ')}
                style={{ '--cols': ELEVATION.length, height: '10rem', columnGap: '2px' }}>
                {ELEVATION.map(([ d, m ]) => <div key={d} title={`${d}: ${m} m`} style={{ height: `${m / max * 100}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0' }} />)}
              </div>
              <div className="grid fixed text-center" style={{ '--cols': ELEVATION.length }}>{ELEVATION.map(([ d ]) => <small key={d} className="opacity-75">{d}</small>)}</div>
            </figure>
            <div className="grid gap-lg" style={{ '--cols': 2, '--min': '12rem' }}>
              <ul className="grid cols-1 gap-sm">{[ 'Guides and porters', 'Huts and hotels, 8 nights', 'Breakfasts and dinners', 'Park fees and transfers' ].map(t => <li key={t} className="grid auto-cols gap-sm items-center justify-start"><Icon name="check" className="text-primary" />{t}</li>)}</ul>
              <ul className="grid cols-1 gap-sm opacity-75">{[ 'Flights to Chile', 'Travel insurance', 'Lunches on rest days' ].map(t => <li key={t} className="grid auto-cols gap-sm items-center justify-start"><Icon name="xmark" />{t}</li>)}</ul>
            </div>
          </div>
          <Timeline events={[
            { date: 'Day 1', title: 'Puerto Natales', text: 'Meet the group, gear check, Patagonian lamb dinner.', icon: 'handshake' },
            { date: 'Day 2', title: 'Base of the Towers', text: '19 km and 900 m up to the granite towers at sunrise.', icon: 'sun' },
            { date: 'Day 3', title: 'Lake Nordenskjöld', text: 'A lakeside walk, condors overhead.', icon: 'water' },
            { date: 'Day 4', title: 'French Valley', text: 'Hanging glaciers and an amphitheater of peaks.', icon: 'snowflake' },
            { date: 'Day 5', title: 'Grey Glacier', text: 'Kayak among the icebergs, or rest at the refugio.', icon: 'ship' },
            { date: 'Day 9', title: 'Home', text: 'Transfer to Punta Arenas, a camera full of skies.', icon: 'plane-departure' },
          ]} />
        </div>
      </Full>

      {/* GUIDES: portraits on contour lines, like a topo map. */}
      <Full id="guides" mode="light">
        <Head note="the people out front" title="Guides who grew up on these trails" text="Our 40 guides average 11 years leading groups in their home mountains." />
        <div className="grid gap-lg" style={{ '--cols': 4, '--min': '11rem' }}>
          {[ [ 'Camila Reyes', 'Patagonia', 14, 'knows every condor by name' ], [ 'Matteo Valt', 'Dolomites', 9, 'makes the best trail espresso' ], [ 'Sigrún Ósk', 'Iceland', 12, 'has crossed 40 rivers on foot' ],
             [ 'Pasang Sherpa', 'Khumbu', 18, 'summited Everest twice' ] ].map(([ n, r, y, fact ], i) => (
            <article key={n} className="grid cols-1 gap-sm justify-center text-center">
              <div className="stack circle shadow" style={{ width: '9rem', aspectRatio: 1, justifySelf: 'center', overflow: 'hidden',
                background: `repeating-radial-gradient(circle at ${30 + i * 15}% ${40 + i * 5}%, var(--secondary-darker) 0 2px, var(--secondary) 2px 14px)` }}>
                <span className="col-center" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--light)' }}>{n.split(' ').map(w => w[0]).join('')}</span>
              </div>
              <h3 className="h4" style={{ fontWeight: 600 }}>{n}</h3>
              <small><Icon name="location-dot" style={{ color: 'var(--primary)' }} /> {r} · {y} years</small>
              <span style={{ ...HAND, fontSize: '1.3rem', color: 'var(--primary)' }}>{fact}</span>
            </article>
          ))}
        </div>
      </Full>

      {/* QUOTE: dunes, full bleed, one big line. */}
      <section data-theme="light" className="wrap wrap-fluid pad-0">
        <Scenery layers={[ 'sun', 'dunes', 'dunes', 'dunes' ]} parallax={false} height="28rem" style={{ background: 'linear-gradient(var(--primary-lighter), var(--light))', color: 'var(--dark)' }}>
          <blockquote style={{ margin: 0, fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: 'clamp(1.6rem, 4vw, 3rem)', lineHeight: 1.2, maxWidth: '24ch' }}>
              &ldquo;I booked solo and came home with nine friends.&rdquo;
            </blockquote>
          <p style={{ ...HAND, fontSize: '1.5rem', color: 'var(--primary)' }}>Ingrid, Iceland 2026</p>
        </Scenery>
      </section>

      {/* SHORT: what a trip leaves behind, boxed. */}
      <Box className="bg-secondary" style={{ color: 'var(--light)' }} inner="grid gap-sm items-center text-center" >
        <div className="grid gap-sm" style={{ '--cols': 3, '--min': '11rem' }}>
          {[ [ 'leaf', '100% carbon offset' ], [ 'hand-holding-heart', '$40 per trekker to trail crews' ], [ 'recycle', 'Zero single-use plastic' ] ].map(([ i, t ]) => (
            <span key={t} className="center gap-sm"><Icon name={i} className="text-primary-lighter" />{t}</span>
          ))}
        </div>
      </Box>

      {/* BOOK: dates, a form and where we meet. */}
      <Full id="book" className="bg-secondary-darker" style={{ color: 'var(--light)' }}>
        <Head light note="no deposit to hold" title="Pick your dates, we'll do the rest" text="Hold dates for 48 hours. A trip planner answers within a day." />
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '17rem' }}>
          <div className="pad round" style={{ background: 'var(--body-bg)', color: 'var(--body-color)' }}><TripPicker /></div>
          <div className="pad round" style={{ background: 'var(--body-bg)', color: 'var(--body-color)' }}>
            <ContactForm topics={TRIPS.map(t => t.name).concat('Not sure yet')} submitLabel="Hold my dates" done="Dates held for 48 hours. Your planner will email you soon." />
          </div>
          <div className="grid cols-1 gap-sm content-start">
            <strong><Icon name="location-dot" className="text-primary-lighter" /> Where Patagonia trips meet</strong>
            <ThemedMap center={{ lat: -51.7236, lng: -72.5064 }} zoom={13} className="round" style={{ minHeight: '18rem' }} />
            <small style={{ opacity: .8 }}>Our basecamp lodge on the waterfront, Puerto Natales, 6 PM on day one.</small>
          </div>
        </div>
      </Full>

      {/* NEWSLETTER + FOOTER */}
      <Full space="3rem" mode="light">
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <div><span style={{ ...HAND, fontSize: '1.6rem', color: 'var(--primary)' }}>trail notes, monthly</span><h3 style={{ fontWeight: 600 }}>New departures and one great photo</h3></div>
          <SignupBar label="Subscribe" icon="envelope" placeholder="Your email" done="Subscribed. See you on the trail!" />
        </div>
        <small style={{ opacity: .6 }}>&copy; 2026 Ridgeline Expeditions Ltd., a fictional company: a demo landing page for this theme.</small>
      </Full>
    </Page>
  );
}

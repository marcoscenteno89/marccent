import '@fontsource-variable/orbitron';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/caveat';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Button } from 'marccent-theme/components/ui/button';
import { Scenery } from 'marccent-theme/components/visuals/scenery';
import { HexWall } from 'marccent-theme/components/widgets/layout';
import { FlipClock, Atom } from '@/components/widgets/fun';
import ThemedMap from '@/components/apps/map';
import { Page, Full, Box } from '../blocks';
import { Backdrop, EventCountdown, SignupBar, CountUp } from '../parts';

/*
 * Landing page: Signal Summit 2027, a (fictional) developer conference. Neon violet and cyan on near-black, always dark:
 * Orbitron headings over Space Grotesk, one neon mix per track, a live network canvas behind the hero, an agenda board,
 * lanyard badges for passes, the venue on a map. Hover: hover-holographic (cards; buttons have it by default).
 */

export const metadata = { title: 'Signal Summit 2027: the developer conference' };

const PALETTE = { primary: '#bd93f9', secondary: '#8be9fd', dark: '#07040f', light: '#f2ecff' }; // violet, cyan, void, lilac
const VOID = 'var(--body-bg)', DEEP = 'var(--surface)';
// One neon per track, all mixed from the palette.
const NEON = { ai: 'var(--primary)', web: 'var(--secondary)', sys: 'var(--secondary-lighter)', sec: 'var(--primary-lighter)',
  a11y: 'color-mix(in srgb, var(--primary) 50%, var(--secondary))', lead: 'color-mix(in srgb, var(--primary) 55%, var(--light))' };
const glow = (c) => ({ border: `1px solid ${c}`, boxShadow: `0 0 .8rem color-mix(in srgb, ${c} 45%, transparent), inset 0 0 .8rem color-mix(in srgb, ${c} 15%, transparent)` });
const neonText = (c) => ({ color: 'var(--light)', textShadow: `0 0 .3rem ${c}, 0 0 1.2rem ${c}` });

// Section heading: a mono tag in brackets, an uppercase neon title.
const Head = ({ tag, title, text, c = NEON.web, center }) => (
  <header className={`grid cols-1 gap-sm ${center ? 'text-center justify-center' : ''}`}>
    <small style={{ fontFamily: 'ui-monospace, monospace', color: c }}>[ {tag} ]</small>
    <h2 className="text-uppercase" style={{ ...neonText(c), letterSpacing: '.06em' }}>{title}</h2>
    {text && <p className="fs-lg" style={{ opacity: .75, maxWidth: '40rem', justifySelf: center ? 'center' : 'start' }}>{text}</p>}
  </header>
);

const TRACKS = [
  [ 'ai', 'brain', 'AI engineering', 'Agents, evals and shipping models people trust.' ], [ 'web', 'globe', 'The web platform', 'CSS, view transitions and what browsers ship next.' ],
  [ 'sys', 'server', 'Systems', 'Databases, queues and the cost of a millisecond.' ], [ 'sec', 'shield-halved', 'Security', 'Supply chains, passkeys and red-team stories.' ],
  [ 'a11y', 'universal-access', 'Accessibility', 'Building for everyone, measured, not guessed.' ], [ 'lead', 'people-group', 'Leadership', 'Growing teams without breaking them.' ],
];

const AGENDA = [
  [ 'Day 1 · May 12', 'Workshops', [ [ '09:00', 'Doors, badges, coffee', null ], [ '10:00', 'Build an agent that ships', 'ai' ], [ '10:00', 'Modern CSS layout, no frameworks', 'web' ], [ '14:00', 'Threat modeling in an hour', 'sec' ], [ '19:00', 'Rooftop welcome party', 'lead' ] ] ],
  [ 'Day 2 · May 13', 'Talks', [ [ '09:30', 'Keynote: the next ten years of the web', 'web' ], [ '11:00', 'Evals are the new unit tests', 'ai' ], [ '13:30', 'Postgres at 1M writes a second', 'sys' ], [ '15:00', 'Screen readers, live on stage', 'a11y' ], [ '16:30', 'Twelve lightning talks', null ] ] ],
  [ 'Day 3 · May 14', 'Talks + hack', [ [ '09:30', 'Keynote: security is a feature', 'sec' ], [ '11:00', 'Managing managers, kindly', 'lead' ], [ '13:00', 'Edge compute without regret', 'sys' ], [ '14:00', '4-hour hackathon, €10k prizes', 'ai' ], [ '18:30', 'Closing and awards', null ] ] ],
];

// A lanyard badge: a strap, a punched hole in a colored band with the tier, then the pass itself.
const Badge = ({ tier, price, was, c, items, cta, tilt = 0 }) => (
  <div className="grid cols-1 gap-0 justify-center">
    <div style={{ width: '1.4rem', height: '3rem', justifySelf: 'center', background: `repeating-linear-gradient(180deg, ${c} 0 6px, ${DEEP} 6px 10px)` }} />
    <article className="round grid cols-1 gap-0 overflow-hidden hover-holographic" style={{ ...glow(c), background: VOID, width: '17rem', maxWidth: '100%', rotate: `${tilt}deg`, transformOrigin: 'top center' }}>
      <div className="col-center pad-sm gap-sm" style={{ background: c, color: VOID }}>
        <span className="circle" style={{ width: '1.1rem', aspectRatio: 1, background: DEEP }} />
        <strong className="text-uppercase" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '.15em' }}>{tier}</strong>
      </div>
      <div className="pad grid cols-1 gap-sm text-center">
        <small className="text-uppercase" style={{ opacity: .6, letterSpacing: '.2em' }}>Hello, my name is</small>
        <span style={{ fontFamily: '"Caveat Variable", cursive', fontSize: '1.6rem', opacity: .5, borderBottom: `1px dashed ${c}` }}>your name here</span>
        <span className="display-sm fw-bold" style={neonText(c)}>{price}</span>
        {was && <small style={{ opacity: .6 }}><s>{was}</s> early bird</small>}
        <ul className="grid cols-1 gap-sm text-start fs-sm">{items.map(t => <li key={t} className="grid auto-cols gap-sm items-center justify-start"><Icon name="bolt" style={{ color: c }} />{t}</li>)}</ul>
        <Button icon="ticket" href="#top" className="w-100" style={{ background: c, color: VOID, borderColor: c }}>{cta}</Button>
      </div>
    </article>
  </div>
);

export default function SignalSummit() {
  return (
    <Page palette={PALETTE} mode="dark" style={{ '--font-heading': '"Orbitron Variable", system-ui, sans-serif', '--font-body': '"Space Grotesk Variable", system-ui, sans-serif' }}>

      {/* NAV */}
      <Full space="1rem" style={{ background: VOID, borderBottom: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)' }} inner="grid layout-ends items-center gap-sm">
        <a href="#top" className="grid auto-cols gap-sm items-center fw-bold" style={{ color: 'inherit', textDecoration: 'none', fontFamily: 'var(--font-heading)' }}>
          <span className="shape-diamond col-center" style={{ width: '1.8rem', background: NEON.web, color: VOID }}><Icon name="tower-broadcast" style={{ fontSize: '.7em' }} /></span>SIGNAL
        </a>
        <div className="grid auto-cols gap-lg">{[ 'Tracks', 'Agenda', 'Speakers', 'Passes', 'Venue' ].map(n => <a key={n} href={`#${n.toLowerCase()}`} style={{ color: 'inherit', textDecoration: 'none', opacity: .8 }}>{n}</a>)}</div>
        <Button icon="ticket" href="#passes" className="col-last icon-only-sm" style={{ ...glow(NEON.web), color: NEON.web }}>Get passes</Button>
      </Full>

      {/* HERO: full bleed, the network canvas behind. */}
      <section className="wrap wrap-fluid pad-0">
        <div className="stack" style={{ minHeight: 'min(44rem, 92vh)', background: `radial-gradient(circle at 30% 20%, var(--primary-darker), ${VOID} 70%)` }}>
          <Backdrop kind="network" id="summit-hero" />
          <div className="wrap col-center text-center grid cols-1 gap-lg" style={{ position: 'relative', paddingBlock: '4rem' }}>
            <small style={{ fontFamily: 'ui-monospace, monospace', color: NEON.web }}>[ lisbon · may 12 – 14, 2027 · and online ]</small>
            <h1 className="text-uppercase" style={{ ...neonText(NEON.ai), fontSize: 'clamp(2.4rem, 9vw, 7rem)', lineHeight: 1, letterSpacing: '.04em' }}>Signal<br />Summit</h1>
            <p className="fs-lg" style={{ maxWidth: '36rem', opacity: .8 }}>Three days, 90 talks and 3,000 builders working on the web, AI and the systems underneath.</p>
            <EventCountdown to="2027-05-12T09:00:00Z" className="grid fixed cols-4 gap-sm" />
            <div className="grid gap-sm" style={{ '--cols': 2, '--min': '10rem', width: 'min(100%, 26rem)' }}>
              <Button icon="ticket" href="#passes" className="w-100" style={{ background: NEON.ai, color: VOID, borderColor: NEON.ai }}>Get passes</Button>
              <Button icon="microphone" href="#speakers" className="w-100" style={{ ...glow(NEON.web), color: NEON.web }}>Speakers</Button>
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERS: a neon readout row. */}
      <Full space="2.5rem" style={{ background: DEEP, borderBlock: '1px solid color-mix(in srgb, var(--secondary) 20%, transparent)' }}>
        <div className="grid gap-lg text-center" style={{ '--cols': 4, '--min': '8rem' }}>
          {[ [ 3000, '+', 'builders', NEON.web ], [ 90, '', 'talks', NEON.ai ], [ 24, '', 'workshops', NEON.sys ], [ 41, '', 'countries', NEON.lead ] ].map(([ v, s, l, c ]) => (
            <div key={l}><CountUp to={v} suffix={s} className="display fw-bold" /><br /><small className="text-uppercase" style={{ color: c, letterSpacing: '.2em' }}>{l}</small></div>
          ))}
        </div>
      </Full>

      {/* SHORT: the call for papers, boxed over the site. */}
      <Box className="" inner="grid layout-ends items-center gap-sm" style={{ ...glow(NEON.ai), background: DEEP }}>
        <Icon name="file-arrow-up" className="fs-lg text-primary" />
        <span><strong>Call for papers closes January 31.</strong> <span className="opacity-75">First-time speakers get a mentor and travel covered.</span></span>
        <Button icon="microphone" href="#top" className="col-last" style={{ background: NEON.ai, color: VOID, borderColor: NEON.ai }}>Submit a talk</Button>
      </Box>

      {/* TRACKS: one neon each; the AI card holds a spinning atom. */}
      <Full id="tracks" style={{ background: VOID }}>
        <Head tag="six tracks" title="Pick your signal" text="Every talk is recorded and streamed, so you can switch tracks without missing a thing." />
        <div className="grid" style={{ '--cols': 3, '--min': '15rem' }}>
          {TRACKS.map(([ k, i, t, d ]) => (
            <article key={k} className="round pad grid gap-sm hover-holographic" style={{ ...glow(NEON[k]), background: DEEP, gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
              <div className="grid cols-1 gap-sm content-start">
                <span className="shape-diamond col-center" style={{ width: '2.6rem', background: NEON[k], color: VOID }}><Icon name={i} style={{ fontSize: '.8em' }} /></span>
                <strong className="fs-lg" style={{ color: NEON[k] }}>{t}</strong>
                <small style={{ opacity: .75 }}>{d}</small>
              </div>
              {k === 'ai' && <Atom style={{ width: '5rem', color: NEON.ai }} />}
            </article>
          ))}
        </div>
      </Full>

      {/* AGENDA: three columns, each slot marked with its track's neon. */}
      <Full id="agenda" style={{ background: DEEP }}>
        <Head tag="agenda" title="Three days at a glance" c={NEON.sys} />
        <div className="grid" style={{ '--cols': 3, '--min': '16rem' }}>
          {AGENDA.map(([ day, kind, slots ]) => (
            <div key={day} className="grid cols-1 gap-sm content-start">
              <div className="header" style={{ padding: '0 0 .5rem', borderBottom: `2px solid ${NEON.sys}` }}>
                <strong style={{ fontFamily: 'var(--font-heading)' }}>{day}</strong><small style={{ opacity: .6 }}>{kind}</small>
              </div>
              {slots.map(([ time, title, track ]) => (
                <div key={time + title} className="round pad-sm grid gap-sm" style={{ gridTemplateColumns: '3.2rem minmax(0, 1fr)', background: VOID, borderLeft: `4px solid ${track ? NEON[track] : 'var(--border-color)'}` }}>
                  <small style={{ fontFamily: 'ui-monospace, monospace', opacity: .7 }}>{time}</small>
                  <span>{title}{track && <><br /><small style={{ color: NEON[track] }}>{TRACKS.find(t => t[0] === track)[2]}</small></>}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Full>

      {/* SPEAKERS */}
      <Full id="speakers" style={{ background: VOID }}>
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <HexWall perRow={4} className="w-100" style={{ maxWidth: '28rem', justifySelf: 'center' }} people={[
            { name: 'Ines Duarte', role: 'Browser engines', initials: 'ID' }, { name: 'Kwame Asante', role: 'AI evals', initials: 'KA' },
            { name: 'Yuki Tanaka', role: 'CSS WG', initials: 'YT' }, { name: 'Sofia Novak', role: 'Red team', initials: 'SN' },
            { name: 'Ravi Menon', role: 'Postgres', initials: 'RM' }, { name: 'Lea Fischer', role: 'A11y lead', initials: 'LF' },
            { name: 'Diego Paz', role: 'Edge compute', initials: 'DP' }, { name: 'Amara Obi', role: 'Eng manager', initials: 'AO' },
            { name: 'Noah Berg', role: 'Rust', initials: 'NB' }, { name: 'Zara Ali', role: 'Design systems', initials: 'ZA' },
          ]} />
          <div className="grid cols-1 gap-lg">
            <Head tag="speakers" title="90 people who build what you use" c={NEON.lead} text="Engine developers, spec editors, researchers and the engineers on call when it breaks. Hover a hexagon to see who's who." />
            <div className="round pad grid cols-1 gap-sm text-center" style={glow(NEON.lead)}>
              <small className="text-uppercase" style={{ color: NEON.lead, letterSpacing: '.2em' }}>Lisbon time right now</small>
              <div className="col-center" style={{ color: 'var(--light)' }}><FlipClock size="2.2rem" /></div>
            </div>
          </div>
        </div>
      </Full>

      {/* PASSES: lanyard badges. */}
      <Full id="passes" style={{ background: DEEP }}>
        <Head tag="passes" title="Early bird ends March 1" c={NEON.a11y} text="Group discounts from five people. Student and diversity scholarships available." center />
        <div className="grid items-start" style={{ '--cols': 3, '--min': '17rem' }}>
          <Badge tilt={-2} tier="Online" price="€99" c={NEON.web} cta="Watch online" items={[ 'Every talk, live and on demand', 'Virtual hallway and Q&A', 'Certificate of attendance' ]} />
          <Badge tier="Conference" price="€549" was="€749" c={NEON.ai} cta="Buy pass" items={[ 'Days 2 and 3, all tracks', 'Hackathon entry', 'Lunch, coffee and the party', 'Recordings for a year' ]} />
          <Badge tilt={2} tier="Pro · 12 left" price="€890" c={NEON.a11y} cta="Go Pro" items={[ 'All three days', 'Two workshops', 'Speaker dinner', 'Reserved keynote seat' ]} />
        </div>
      </Full>

      {/* SHORT: scholarships, boxed. */}
      <Box className="bg-gradient-darker" inner="grid gap-sm items-center text-center" style={{ '--cols': 3, '--min': '12rem' }}>
        {[ [ 'graduation-cap', '200 student passes' ], [ 'hand-holding-heart', '120 diversity scholarships' ], [ 'plane', 'Travel grants up to €800' ] ].map(([ i, t ]) => (
          <span key={t} className="center gap-sm fw-bold"><Icon name={i} className="text-secondary" />{t}</span>
        ))}
      </Box>

      {/* VENUE: the map, then a skyline strip, full bleed. */}
      <Full id="venue" style={{ background: VOID }}>
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="grid cols-1 gap-lg">
            <Head tag="venue" title="On the river, in the old docks" c={NEON.sys} text="A converted 1920s warehouse on the Tagus, ten minutes from the airport by metro. Hotel blocks at partner rates within walking distance." />
            <div className="grid fixed cols-3 gap-sm text-center">
              {[ [ 'train-subway', '10 min', 'metro' ], [ 'hotel', '8', 'hotels' ], [ 'sun', '24°', 'in May' ] ].map(([ i, v, l ]) => (
                <div key={l} className="round pad-sm" style={glow(NEON.sys)}><Icon name={i} style={{ color: NEON.sys }} /><br /><strong>{v}</strong><br /><small style={{ opacity: .7 }}>{l}</small></div>
              ))}
            </div>
          </div>
          <ThemedMap center={{ lat: 38.7036, lng: -9.1789 }} zoom={14} className="round" style={{ minHeight: '22rem', ...glow(NEON.sys) }} />
        </div>
      </Full>
      <section className="wrap wrap-fluid pad-0">
        <Scenery layers={[ 'stars', 'moon', 'city', 'waves', 'city' ]} parallax={false} height="14rem" style={{ background: `linear-gradient(${VOID}, var(--primary-darker))` }} />
      </section>

      {/* SPONSORS + NEWSLETTER + FOOTER */}
      <Full style={{ background: VOID }}>
        <div className="grid cols-1 gap-lg text-center">
          <small className="text-uppercase" style={{ letterSpacing: '.3em', opacity: .6 }}>Platinum</small>
          <div className="grid gap-lg" style={{ '--cols': 2, '--min': '12rem' }}>{[ [ 'cloud', 'Nimbus Cloud' ], [ 'microchip', 'Siliconia' ] ].map(([ i, n ]) => <strong key={n} className="display-sm"><Icon name={i} style={{ color: NEON.ai }} /> {n}</strong>)}</div>
          <small className="text-uppercase" style={{ letterSpacing: '.3em', opacity: .6 }}>Gold</small>
          <div className="grid gap-lg" style={{ '--cols': 4, '--min': '8rem' }}>{[ [ 'database', 'Tablewise' ], [ 'code-branch', 'Forkly' ], [ 'shield', 'Bastion' ], [ 'satellite-dish', 'Uplink' ] ].map(([ i, n ]) => <strong key={n} className="fs-lg" style={{ opacity: .8 }}><Icon name={i} /> {n}</strong>)}</div>
        </div>
        <div className="grid gap-lg items-center round pad" style={{ '--cols': 2, '--min': '18rem', ...glow(NEON.lead) }}>
          <div><h3 className="text-uppercase" style={neonText(NEON.lead)}>Speaker drops, first</h3><p style={{ opacity: .75 }}>One email when new speakers are announced. That&apos;s it.</p></div>
          <SignupBar label="Notify me" icon="bell" placeholder="Your email" done="You're on the list. First speaker drop lands next week." />
        </div>
        <small style={{ opacity: .5 }}>&copy; 2026 Signal Summit, a fictional event: a demo landing page for this theme. Code of conduct · Privacy · Press kit</small>
      </Full>
    </Page>
  );
}

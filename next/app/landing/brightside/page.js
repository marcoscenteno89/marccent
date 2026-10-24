import '@fontsource-variable/nunito';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Button } from 'marccent-theme/components/ui/button';
import { AnalogClock } from '@/components/widgets/fun';
import { Accordion, AccordionItem } from 'marccent-theme/components/ui/accordion';
import ThemedMap from '@/components/apps/map';
import { Alert } from 'marccent-theme/components/ui/alert';
import { ImageCard } from 'marccent-theme/components/widgets/layout';
import { Page, Full, Box } from '../blocks';
import { VisitScheduler, NewPatientForm, CountUp } from '../parts';
import 'marccent-theme/styles/components/loading.css';

/*
 * Landing page: Brightside Dental, a (fictional) family dental clinic. Soft and friendly: Nunito, aqua and sunshine on
 * cream, pastel sections (the -lighter shades, navy text) joined by wavy edges, white rounded tiles, a chat-style review thread,
 * domed membership cards, the waiting room in round photos, live booking and the clinic on a map. Hover: hover-holographic (the service tiles; buttons have it by default).
 */

export const metadata = { title: 'Brightside Dental: family dentistry' };

const PALETTE = { primary: '#3fb8af', secondary: '#ffc857', dark: '#23324a', light: '#fffaf5' }; // aqua, sunshine, navy, cream
const DARK = { color: 'var(--dark)' };
const TILE = { background: 'var(--light)', color: 'var(--dark)', borderRadius: '1.5rem' };
const HOURS = [ [ 'Mon – Thu', '7:30 AM – 6:00 PM' ], [ 'Friday', '7:30 AM – 3:00 PM' ], [ 'Saturday', '8:00 AM – 1:00 PM' ], [ 'Sunday', 'Emergencies only' ] ];

// A wavy edge under a section: the waves in its color, over the next one's (none: the site shows through).
const Wave = ({ from, to }) => (
  <div className={to} aria-hidden="true"><div className={`shape-wave ${from}`} style={{ aspectRatio: 'auto', height: '3.5rem' }} /></div>
);

// Section heading: an emoji-sized icon in a soft circle, a rounded bold title.
const Head = ({ icon, title, text, tone = 'bg-primary-lighter' }) => (
  <header className="grid cols-1 gap-sm text-center justify-center">
    <span className={`circle col-center ${tone}`} style={{ width: '3.5rem', aspectRatio: 1, justifySelf: 'center', color: 'var(--dark)' }}><Icon name={icon} className="fs-lg" /></span>
    <h2 className="display-sm" style={{ fontWeight: 800 }}>{title}</h2>
    {text && <p className="fs-lg" style={{ maxWidth: '36rem', justifySelf: 'center', opacity: .8 }}>{text}</p>}
  </header>
);

export default function Brightside() {
  return (
    <Page palette={PALETTE} style={{ '--font-heading': '"Nunito Variable", system-ui, sans-serif', '--font-body': '"Nunito Variable", system-ui, sans-serif' }}>

      {/* HERO: a pill nav, the promise and a tooth in a breathing blob. */}
      <Full className="bg-primary-lighter" style={DARK} space="1.25rem 2rem">
        <nav className="grid layout-ends items-center gap-sm shadow pad-sm" aria-label="Brightside" style={{ ...TILE, borderRadius: '99px', paddingInline: '1.25rem' }}>
          <a href="#top" className="grid auto-cols gap-sm items-center fw-bold fs-lg" style={{ color: 'inherit', textDecoration: 'none' }}>
            <span className="shape-squircle bg-gradient col-center" style={{ width: '2.2rem', color: 'var(--light)' }}><Icon name="tooth" style={{ fontSize: '.85em' }} /></span>Brightside
          </a>
          <div className="grid auto-cols gap-lg">{[ [ 'Services', '#services' ], [ 'Book', '#book' ], [ 'Team', '#team' ], [ 'Visit', '#visit' ] ].map(([ n, h ]) => <a key={n} href={h} style={{ color: 'inherit', textDecoration: 'none' }}>{n}</a>)}</div>
          <Button icon="calendar-check" href="#book" className="gradient col-last icon-only-sm" style={{ borderRadius: '99px' }}>Book a visit</Button>
        </nav>
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '19rem', paddingBlock: '2rem' }}>
          <div className="grid cols-1 gap-sm content-center">
            <span className="shape-pill bg-gradient-lighter fw-bold fs-sm center gap-sm" style={{ aspectRatio: 'auto', width: 'fit-content', padding: '.35rem 1rem', border: '2px solid var(--light)' }}>
              <Icon name="circle-check" /> Accepting new patients
            </span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.05 }}>Dentistry that feels like a good day.</h1>
            <p className="fs-lg">Gentle care for the whole family, same-week appointments and honest prices. Headphones and Netflix in every chair.</p>
            <div className="grid gap-sm" style={{ '--cols': 2, '--min': '11rem' }}>
              <Button icon="calendar-check" href="#book" className="gradient w-100" style={{ borderRadius: '99px' }}>Book online</Button>
              <Button icon="phone" href="tel:+15555550142" className="light w-100" style={{ borderRadius: '99px' }}>(555) 555-0142</Button>
            </div>
            <small className="grid auto-cols gap-sm items-center justify-start">
              <span className="text-secondary-darker">{[ 1, 2, 3, 4, 5 ].map(n => <Icon key={n} name="star" style={{ '--icon-size': '1em' }} />)}</span>
              <span><strong>4.9</strong> from 1,280 reviews</span>
            </small>
          </div>
          <div className="stack w-100" style={{ maxWidth: '26rem', aspectRatio: 1, justifySelf: 'center', placeItems: 'center' }}>
            <div className="shape-blob bg-gradient loader-breathe w-100 h-100" style={{ animationDuration: '6s' }} />
            <div className="shape-squircle col-center shadow" style={{ width: '50%', aspectRatio: 1, background: 'var(--light)' }}>
              <Icon name="tooth" className="text-gradient" style={{ fontSize: '6rem', '--icon-size': '1.1em' }} />
            </div>
            <div className="shape-heart bg-secondary" style={{ width: '12%', placeSelf: 'start end', margin: '8%', rotate: '12deg' }} />
            <div className="shape-star bg-primary loader-spin" style={{ width: '10%', placeSelf: 'end start', margin: '10%', animationDuration: '9s' }} />
            <div className="shadow pad-sm grid auto-cols gap-sm items-center" style={{ ...TILE, placeSelf: 'end end', margin: '2%' }}>
              <span className="circle bg-gradient-lighter col-center" style={{ width: '2.4rem', aspectRatio: 1 }}><Icon name="face-smile" /></span>
              <span><strong><CountUp to={9400} suffix="+" /></strong><br /><small>happy patients</small></span>
            </div>
          </div>
        </div>
      </Full>
      <Wave from="bg-primary-lighter" to="bg" />

      {/* WHY: four soft circles, no boxes. */}
      <Full className="bg" space="2rem 4rem">
        <div className="grid gap-lg text-center" style={{ '--cols': 4, '--min': '12rem' }}>
          {[ [ 'clock', 'Same-week visits', 'Usually within 3 days; emergencies today.', 'bg-primary-lighter' ], [ 'hand-holding-heart', 'Gentle by default', 'Numbing gel before every needle, sedation if you like.', 'bg-secondary-lighter' ],
             [ 'receipt', 'Prices up front', 'A written plan with costs before we start anything.', 'bg-gradient-lighter' ], [ 'child-reaching', 'Kids love it', 'A treasure chest, ceiling TVs and patient people.', 'bg-secondary-lighter' ] ].map(([ i, t, d, tone ]) => (
            <div key={t} className="grid cols-1 gap-sm justify-center">
              <span className={`circle col-center ${tone}`} style={{ width: '5rem', aspectRatio: 1, justifySelf: 'center', color: 'var(--dark)' }}><Icon name={i} className="fs-lg" /></span>
              <h3 className="h5" style={{ fontWeight: 800 }}>{t}</h3>
              <p className="opacity-75">{d}</p>
            </div>
          ))}
        </div>
      </Full>
      <Wave from="bg" />

      {/* SHORT: emergencies, boxed over the site. */}
      <Box className="bg-secondary" inner="grid layout-ends items-center gap-sm" style={{ color: 'var(--dark)' }}>
        <span className="circle col-center" style={{ width: '2.6rem', aspectRatio: 1, background: 'var(--light)' }}><Icon name="truck-medical" /></span>
        <span><strong>Toothache right now?</strong> Call before 10 AM and we&apos;ll see you today.</span>
        <Button icon="phone" href="tel:+15555550142" className="dark col-last" style={{ borderRadius: '99px' }}>Call now</Button>
      </Box>

      {/* CALM: the garden waiting room, two round photos overlapping, beside what makes it calm. */}
      <Full className="bg">
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="stack w-100" style={{ maxWidth: '26rem', justifySelf: 'center' }}>
            <ImageCard src="/img/pink4.webp" shape="circle" ratio="1 / 1" className="w-100" label="Our garden room" title="Breathe in" />
            <ImageCard src="/img/pink1.webp" shape="circle" ratio="1 / 1" overlay="none" style={{ width: '42%', placeSelf: 'end start', border: '6px solid var(--light)' }} />
          </div>
          <div className="grid cols-1 gap-sm content-center">
            <h2 className="display-sm" style={{ fontWeight: 800 }}>A waiting room that doesn&apos;t feel like one</h2>
            <p className="fs-lg opacity-75">Big windows onto the garden, quiet music, warm blankets and no drill sounds: the treatment rooms are soundproofed.</p>
            <ul className="grid cols-1 gap-sm">
              {[ 'Herbal tea and a kids\' reading nook', 'Weighted blankets in every chair', 'Average wait: 4 minutes' ].map(t => (
                <li key={t} className="grid auto-cols gap-sm items-center justify-start"><Icon name="seedling" className="text-primary" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Full>
      <Wave from="bg" to="bg-secondary-lighter" />

      {/* SERVICES: white rounded tiles with a price; they pop on hover. */}
      <Full id="services" className="bg-secondary-lighter" style={DARK}>
        <Head icon="tooth" tone="bg-primary-lighter" title="Everything under one roof" text="From a toddler's first check-up to a full smile makeover, no referral runaround." />
        <div className="grid" style={{ '--cols': 3, '--min': '15rem' }}>
          {[ [ 'tooth', 'Cleaning and check-up', 'Exam, X-rays and a polish.', '$0 with most insurance', 'bg-primary-lighter' ], [ 'teeth', 'Clear aligners', 'Straighter in as little as six months.', 'from $2,990', 'bg-gradient-lighter' ],
             [ 'wand-magic-sparkles', 'Whitening', 'Up to eight shades in one visit.', 'from $299', 'bg-secondary-lighter' ], [ 'crown', 'Same-day crowns', 'Designed and milled while you wait.', 'from $1,050', 'bg-secondary-lighter' ],
             [ 'child', 'Kids\' dentistry', 'Sealants, fluoride and a lot of patience.', 'from $0', 'bg-primary-lighter' ], [ 'truck-medical', 'Emergencies', 'Call before 10 AM, seen today.', 'from $89', 'bg-primary-lighter' ] ].map(([ i, t, d, p, tone ]) => (
            <article key={t} className="pad grid gap-sm items-center shadow-sm hover-holographic" style={{ ...TILE, gridTemplateColumns: 'auto minmax(0, 1fr)' }}>
              <span className={`shape-squircle col-center ${tone}`} style={{ width: '3.5rem' }}><Icon name={i} /></span>
              <div><strong className="fs-lg">{t}</strong><br /><small className="opacity-75">{d}</small><br /><small className="fw-bold text-primary-darker">{p}</small></div>
            </article>
          ))}
        </div>
      </Full>
      <Wave from="bg-secondary-lighter" to="bg" />

      {/* BOOK: three numbered steps, then live openings and the forms. */}
      <Full id="book" className="bg">
        <Head icon="calendar-check" tone="bg-gradient-lighter" title="Book in under a minute" text="Real openings, updated live. We text a reminder the day before." />
        <ol className="grid fixed cols-3 text-center">
          {[ 'Pick a time', 'Fill in your forms', 'Smile, you\'re booked' ].map((t, i) => (
            <li key={t} className="grid cols-1 gap-sm justify-center">
              <span className="circle bg-gradient col-center fw-bold fs-lg" style={{ width: '3rem', aspectRatio: 1, justifySelf: 'center', color: 'var(--light)' }}>{i + 1}</span>
              <small className="fw-bold">{t}</small>
            </li>
          ))}
        </ol>
        <div className="grid gap-lg" style={{ '--cols': 2, '--min': '19rem' }}>
          <div className="grid cols-1 gap-sm content-start"><h3 className="h4" style={{ fontWeight: 800 }}>1. Openings</h3><Alert tone="success"><Icon name="bolt" /> 3 openings left this week</Alert><VisitScheduler /></div>
          <div className="grid cols-1 gap-sm content-start"><h3 className="h4" style={{ fontWeight: 800 }}>2. New patient forms</h3><p className="opacity-75">Save 15 minutes in the waiting room.</p><NewPatientForm /></div>
        </div>
      </Full>
      <Wave from="bg" to="bg-gradient-lighter" />

      {/* TEAM: round portraits with a gradient halo and a fun fact. */}
      <Full id="team" className="bg-gradient-lighter" style={DARK}>
        <Head icon="user-doctor" tone="bg-secondary-lighter" title="Meet the smiles behind the masks" />
        <div className="grid gap-lg text-center" style={{ '--cols': 4, '--min': '11rem' }}>
          {[ [ 'Dr. Nia Brooks', 'Founder, DDS', 'Runs half-marathons, badly' ], [ 'Dr. Sam Okoye', 'Orthodontics', 'Has 3,000 aligner smiles' ], [ 'Linh Tran', 'Hygienist', 'Speaks Vietnamese and Spanish' ], [ 'Rosa Diaz', 'Patient care', 'Remembers every kid\'s name' ] ].map(([ n, r, f ]) => (
            <div key={n} className="grid cols-1 gap-sm justify-center">
              <div className="stack" style={{ width: '8.5rem', aspectRatio: 1, justifySelf: 'center', placeItems: 'center' }}>
                <div className="shape-ring bg-gradient w-100" style={{ '--ring-hole': '88%' }} />
                <span className="circle col-center fw-bold" style={{ width: '84%', aspectRatio: 1, background: 'var(--light)', fontSize: '2rem' }}>{n.replace('Dr. ', '').split(' ').map(w => w[0]).join('')}</span>
              </div>
              <strong className="fs-lg">{n}</strong>
              <small>{r}</small>
              <span className="shape-pill fs-sm" style={{ ...TILE, aspectRatio: 'auto', padding: '.25rem .8rem', justifySelf: 'center' }}>{f}</span>
            </div>
          ))}
        </div>
      </Full>
      <Wave from="bg-gradient-lighter" to="bg" />

      {/* REVIEWS: a message thread. */}
      <Full className="bg" wrap="wrap wrap-sm">
        <Head icon="comment-dots" tone="bg-secondary-lighter" title="Messages from patients" text="Real notes, shared with permission." />
        <div className="grid cols-1 gap-sm">
          {[ [ 'MW', 'Marcus', 'I hadn\'t been to a dentist in eight years. Nobody lectured me once. 🙏' ], [ 'AL', 'Ana Lucía', 'My five-year-old asks when she can go back. That\'s witchcraft.' ],
             [ 'JP', 'Jen', 'Cracked a molar on a Saturday, crown done by Monday lunch.' ], [ 'OH', 'Omar', 'Prices were in writing before anything started. No surprises!' ] ].map(([ ini, n, m ], i) => {
            const me = i % 2;
            return (
              <div key={n} className="grid gap-sm items-end" style={{ gridTemplateColumns: me ? 'minmax(0, 1fr) auto' : 'auto minmax(0, 1fr)' }}>
                <span className={`circle col-center fw-bold ${me ? 'bg-secondary-lighter order-last' : 'bg-primary-lighter'}`} style={{ width: '2.5rem', aspectRatio: 1, color: 'var(--dark)' }}>{ini}</span>
                <div className={`pad-sm ${me ? 'bg-secondary' : ''}`} style={{ justifySelf: me ? 'end' : 'start', maxWidth: '30rem', borderRadius: me ? '1.25rem 1.25rem .25rem 1.25rem' : '1.25rem 1.25rem 1.25rem .25rem', background: me ? undefined : 'var(--muted-bg)' }}>
                  <small className="fw-bold">{n} <span className="text-secondary">★★★★★</span></small><br />{m}
                </div>
              </div>
            );
          })}
          <div className="pad-sm" style={{ width: '4.5rem', marginLeft: '3rem', borderRadius: '1.25rem', background: 'var(--muted-bg)' }}>
            <div className="loader-dots text-primary" style={{ width: '100%' }} role="status" aria-label="Someone is typing" />
          </div>
        </div>
      </Full>
      <Wave from="bg" to="bg-primary-lighter" />

      {/* PLANS: white cards with a domed top. */}
      <Full className="bg-primary-lighter" style={DARK}>
        <Head icon="piggy-bank" tone="bg-gradient-lighter" title="No insurance? Join the club." text="One yearly price covers cleanings, exams and X-rays, plus 20% off everything else." />
        <div className="grid gap-lg items-end" style={{ '--cols': 3, '--min': '15rem' }}>
          {[ [ 'child', 'Kids', '$199', [ '2 cleanings and exams', 'Fluoride and sealants', 'Treasure chest prize' ], 'bg-gradient-lighter' ],
             [ 'heart', 'Adult', '$329', [ '2 cleanings and exams', 'All X-rays', '1 emergency visit', '20% off treatment' ], 'bg-gradient' ],
             [ 'people-roof', 'Family of 4', '$899', [ 'Everything in Adult, ×4', 'Free whitening kit', '25% off aligners' ], 'bg-secondary-lighter' ] ].map(([ i, n, p, items, tone ], k) => (
            <article key={n} className="grid cols-1 gap-0 shadow overflow-hidden" style={{ ...TILE, borderRadius: '12rem 12rem 1.5rem 1.5rem' }}>
              <div className={`col-center ${tone}`} style={{ paddingBlock: k === 1 ? '3rem 1.5rem' : '2rem 1rem', color: k === 1 ? 'var(--light)' : undefined }}>
                <Icon name={i} className="fs-lg" /><strong>{n}</strong>
                <span className="display-sm" style={{ fontWeight: 900 }}>{p}<small className="fs-sm"> / year</small></span>
              </div>
              <div className="pad grid cols-1 gap-sm">
                {items.map(t => <span key={t} className="grid auto-cols gap-sm items-center justify-start"><Icon name="circle-check" className="text-primary" />{t}</span>)}
                <Button icon="arrow-right" href="#book" className={k === 1 ? 'gradient w-100' : 'outline-primary w-100'} style={{ borderRadius: '99px' }}>Join</Button>
              </div>
            </article>
          ))}
        </div>
      </Full>
      <Wave from="bg-primary-lighter" to="bg" />

      {/* VISIT: the map, hours by a clock, and questions. */}
      <Full id="visit" className="bg">
        <div className="grid gap-lg" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="grid cols-1 gap-sm content-start">
            <ThemedMap center={{ lat: 39.7817, lng: -89.6501 }} zoom={14} className="round shadow" style={{ minHeight: '22rem', borderRadius: '1.5rem' }} />
            <p><strong>1420 Maple Avenue, Suite 200, Springfield</strong><br /><small className="opacity-75">Free parking behind the building · Bus 12 stops out front</small></p>
          </div>
          <div className="grid cols-1 gap-lg content-start">
            <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '13rem' }}>
              <AnalogClock className="w-100" style={{ maxWidth: '9rem', justifySelf: 'center' }} />
              <dl className="grid pairs gap-sm">
                {HOURS.map(([ d, h ]) => <div key={d} className="sub-x"><dt className="fw-bold" style={{ paddingRight: '1rem' }}>{d}</dt><dd style={{ margin: 0 }}>{h}</dd></div>)}
              </dl>
            </div>
            <Accordion>
              {[ [ 'Do you take my insurance?', 'We\'re in network with most PPO plans and file every claim for you. Text us a photo of your card and we\'ll check within an hour.' ],
                 [ 'What happens at the first visit?', 'A full exam, X-rays and a cleaning if there\'s time, about 75 minutes. You leave with a written plan and prices.' ],
                 [ 'Is sedation available?', 'Yes: laughing gas, oral sedation, or IV sedation with our anesthesiologist on Thursdays.' ] ].map(([ q, a ]) => (
                <AccordionItem key={q} header={<strong>{q}</strong>}><p>{a}</p></AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Full>
      <Wave from="bg" />

      {/* SHORT: insurance, boxed. */}
      <Box inner="grid gap-sm items-center text-center">
        <small className="fw-bold">In network with most PPO plans · we file every claim for you</small>
        <div className="grid gap-sm" style={{ '--cols': 5, '--min': '7rem' }}>
          {[ 'Delta Dental', 'Cigna', 'MetLife', 'Aetna', 'Guardian' ].map(n => <span key={n} className="shape-pill bg-primary-lighter fw-bold fs-sm col-center" style={{ aspectRatio: 'auto', padding: '.4rem', color: 'var(--dark)' }}>{n}</span>)}
        </div>
      </Box>

      {/* FOOTER */}
      <Full className="bg-primary-darker" space="2rem 3rem" style={{ color: 'var(--light)' }} inner="grid cols-1 gap-sm text-center">
        <strong className="fs-lg"><Icon name="tooth" /> Brightside Dental</strong>
        <small style={{ opacity: .75 }}>&copy; 2026 Brightside Dental Group, a fictional clinic: a demo landing page for this theme.</small>
      </Full>
    </Page>
  );
}

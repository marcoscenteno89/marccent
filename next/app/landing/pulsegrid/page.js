import '@fontsource-variable/inter-tight';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Button } from 'marccent-theme/components/ui/button';
import { RingGauge, Radar } from '@/components/widgets/data';
import { StepBar } from 'marccent-theme/components/widgets/nav';
import { Orbit } from 'marccent-theme/components/visuals/effects';
import { Alert } from 'marccent-theme/components/ui/alert';
import { ImageCard } from 'marccent-theme/components/widgets/layout';
import { Page, Full, Box } from '../blocks';
import { SignupBar, ContactForm, CountUp, LiveSpeedometer } from '../parts';

/*
 * Landing page: Pulsegrid, a (fictional) product analytics SaaS. Dark and technical: Inter Tight, indigo and
 * coral on ink, a code-editor band, bento tiles of live widgets, a quote wall with a photo case study and a pricing comparison table.
 * Hover: hover-holographic (tiles; buttons have it by default).
 */

export const metadata = { title: 'Pulsegrid: product analytics' };

const PALETTE = { primary: '#5b5bf7', secondary: '#ff7a59', dark: '#0b0f19', light: '#f7f8fc' }; // indigo, coral, ink, mist
const NAV = [ [ 'Product', '#product' ], [ 'Integrations', '#integrations' ], [ 'Customers', '#customers' ], [ 'Pricing', '#pricing' ] ];

// Section heading: a small mono label with a pulse dot, a tight headline, a muted line.
const Head = ({ label, title, text, center }) => (
  <header className={`grid cols-1 gap-sm ${center ? 'text-center justify-center' : ''}`}>
    <small className="grid auto-cols gap-sm items-center text-primary fw-bold" style={{ fontFamily: 'ui-monospace, monospace', justifySelf: center ? 'center' : 'start' }}>
      <span className="circle bg-gradient loader-breathe" style={{ width: '.5rem', aspectRatio: 1 }} />{label}
    </small>
    <h2 className="display-sm fw-bold" style={{ letterSpacing: '-.03em' }}>{title}</h2>
    {text && <p className="fs-lg opacity-75" style={{ maxWidth: '38rem', justifySelf: center ? 'center' : 'start' }}>{text}</p>}
  </header>
);

// Weekly active users (thousands), one series: bars on the baseline, 4px tops, 2px apart, a tooltip each.
const WAU = [ 18, 21, 20, 24, 27, 26, 31, 34, 33, 38, 42, 47 ];
const Bars = ({ values, height = '7rem' }) => {
  const max = Math.max(...values);
  return (
    <div className="grid fixed items-end border-bottom" role="img" aria-label={`Weekly active users: ${values.join(', ')} thousand`}
      style={{ '--cols': values.length, height, columnGap: '2px' }}>
      {values.map((v, i) => <div key={i} className="bg-gradient" title={`Week ${i + 1}: ${v}k`} style={{ height: `${v / max * 100}%`, borderRadius: '4px 4px 0 0' }} />)}
    </div>
  );
};

// A bento tile: a bordered surface that glows on hover; span and rows set its size.
const Tile = ({ title, text, span, rows, children }) => (
  <article className={`bg border round pad grid cols-1 gap-sm content-start hover-holographic ${span ? `span-${span}` : ''}`} style={rows ? { gridRow: `span ${rows}` } : undefined}>
    <strong className="fs-lg">{title}</strong>
    <small className="opacity-75">{text}</small>
    {children}
  </article>
);

export default function Pulsegrid() {
  return (
    <Page palette={PALETTE} style={{ '--font-heading': '"Inter Tight Variable", system-ui, sans-serif', '--font-body': '"Inter Tight Variable", system-ui, sans-serif' }}>

      {/* HERO: nav, a centered headline and the product window under it. */}
      <Full mode="dark" space="1.25rem" inner="grid cols-1 gap-lg">
        <nav className="grid layout-ends items-center gap-sm" aria-label="Pulsegrid">
          <a href="#top" className="grid auto-cols gap-sm items-center fw-bold fs-lg" style={{ color: 'inherit', textDecoration: 'none' }}>
            <span className="round bg-gradient col-center" style={{ width: '2rem', aspectRatio: 1 }}><Icon name="wave-square" style={{ fontSize: '.8em' }} /></span>Pulsegrid
          </a>
          <div className="grid auto-cols gap-lg">{NAV.map(([ n, h ]) => <a key={n} href={h} style={{ color: 'inherit', textDecoration: 'none', opacity: .85 }}>{n}</a>)}</div>
          <div className="grid auto-cols gap-sm col-last"><Button href="#contact">Sign in</Button><Button icon="rocket" href="#contact" className="gradient icon-only-sm">Start free</Button></div>
        </nav>
        <div className="grid cols-1 text-center justify-center" style={{ paddingBlock: '3rem 1rem' }}>
          <span className="shape-pill fw-bold fs-sm center gap-sm" style={{ aspectRatio: 'auto', justifySelf: 'center', padding: '.3rem 1rem', border: 'var(--border-width) solid var(--border-color)' }}>
            <span className="text-secondary">New</span> AI anomaly alerts are live <Icon name="arrow-right" />
          </span>
          <h1 className="fw-bold" style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', letterSpacing: '-.04em', lineHeight: 1 }}>Know <span className="text-gradient">why</span> users stay.</h1>
          <p className="fs-lg" style={{ maxWidth: '36rem', justifySelf: 'center', opacity: .75 }}>Every click, session and payment turned into answers your whole team can read. No SQL, no waiting on the data team.</p>
          <div className="w-100" style={{ maxWidth: '30rem', justifySelf: 'center' }}><SignupBar label="Start free" icon="rocket" done="Your 14-day trial link is on its way." /></div>
          <small style={{ opacity: .6 }}>14-day trial · no card · SOC 2 Type II</small>
        </div>
        {/* Product window */}
        <div data-theme="light" className="round shadow-lg border grid cols-1 gap-0" style={{ background: 'var(--body-bg)', color: 'var(--body-color)' }}>
          <div className="grid auto-cols gap-sm items-center pad-sm border-bottom">
            {[ 'secondary', 'primary-lighter', 'primary' ].map(c => <span key={c} className={`circle bg-${c}`} style={{ width: '.7rem', aspectRatio: 1 }} />)}
            <small className="opacity-50">app.pulsegrid.io / acme / overview</small>
          </div>
          <div className="grid gap-0" style={{ gridTemplateColumns: 'auto minmax(0, 1fr)' }}>
            <div className="grid cols-1 gap-sm pad-sm content-start border-bottom" style={{ borderRight: 'var(--border-width) solid var(--border-color)' }}>
              {[ 'house', 'chart-line', 'filter', 'users', 'bell', 'gear' ].map((i, n) => <span key={i} className={`round col-center ${n === 1 ? 'bg-primary' : 'opacity-50'}`} style={{ width: '2.2rem', aspectRatio: 1 }}><Icon name={i} /></span>)}
            </div>
            <div className="pad grid cols-1">
              <div className="grid gap-sm" style={{ '--cols': 4, '--min': '8rem' }}>
                {[ [ 'Active users', 47.2, 'k', 1, '+12%' ], [ 'Conversion', 6.8, '%', 1, '+0.9' ], [ 'MRR', 128, 'k', 0, '+8%' ], [ 'Churn', 1.9, '%', 1, '−0.4' ] ].map(([ l, v, s, d, delta ]) => (
                  <div key={l} className="border round pad-sm">
                    <small className="opacity-75">{l}</small><br />
                    <strong className="fs-lg">{l === 'MRR' && '$'}<CountUp to={v} decimals={d} suffix={s} /></strong> <small className="text-primary">{delta}</small>
                  </div>
                ))}
              </div>
              <div className="grid gap-lg items-end" style={{ '--cols': 2, '--min': '14rem' }}>
                <div className="grid cols-1 gap-sm"><small className="fw-bold">Weekly active users (k)</small><Bars values={WAU} /></div>
                <div className="grid cols-1 gap-sm">
                  <small className="fw-bold">Signup funnel</small>
                  {[ [ 'Visited', 100 ], [ 'Signed up', 46 ], [ 'Activated', 31 ], [ 'Paid', 12 ] ].map(([ l, v ]) => (
                    <div key={l} className="grid gap-sm items-center" style={{ gridTemplateColumns: '5rem 1fr 2.5rem' }}>
                      <small className="opacity-75">{l}</small>
                      <div className="round" style={{ height: '.5rem', background: 'var(--muted-bg)' }}><div className="bg-gradient h-100" style={{ width: `${v}%`, borderRadius: '4px' }} /></div>
                      <small className="text-end">{v}%</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Full>

      {/* LOGOS */}
      <Full className="bg border-bottom" space="2.5rem" inner="grid cols-1 gap-sm text-center">
        <small className="opacity-50 text-uppercase" style={{ letterSpacing: '.2em' }}>4,800 teams measure with Pulsegrid</small>
        <div className="grid opacity-50" style={{ '--cols': 6, '--min': '7rem' }}>
          {[ [ 'mountain-sun', 'Northpeak' ], [ 'feather', 'Quill' ], [ 'cube', 'Blockwise' ], [ 'leaf', 'Verdant' ], [ 'bolt', 'Voltline' ], [ 'anchor', 'Harborly' ] ].map(([ i, n ]) => (
            <span key={n} className="center gap-sm fw-bold fs-lg"><Icon name={i} />{n}</span>
          ))}
        </div>
      </Full>

      {/* BENTO: the product as tiles of live widgets. */}
      <Full id="product" className="bg">
        <Head label="product" title="Every product question, one screen" text="Funnels, retention, account health and alerts, live and shareable. Each tile below is the real widget." />
        <div className="grid" style={{ '--cols': 4, '--min': '13rem' }}>
          <Tile span={2} title="Funnels" text="See exactly which step loses people, split by plan, country or campaign.">
            <StepBar steps={[ 'Visit', 'Sign up', 'Invite', 'Pay' ]} start={2} />
          </Tile>
          <Tile rows={2} title="Account health" text="Usage, seats, tickets and billing in one score.">
            <Radar className="w-100" axes={[ { label: 'Usage', value: 86 }, { label: 'Seats', value: 70 }, { label: 'Support', value: 62 }, { label: 'Billing', value: 94 }, { label: 'NPS', value: 77 } ]} />
          </Tile>
          <Tile title="Activation" text="This week's new users who reached the aha moment.">
            <div className="col-center"><RingGauge value={73} label="Activated" size="7rem" /></div>
          </Tile>
          <Tile title="Ask in English" text="Type a question, get a chart.">
            <div className="grid cols-1 gap-sm fs-sm">
              <span className="bg-primary pad-sm" style={{ borderRadius: '1rem 1rem .25rem 1rem', justifySelf: 'end' }}>Which plan churns most?</span>
              <span className="pad-sm" style={{ background: 'var(--muted-bg)', borderRadius: '1rem 1rem 1rem .25rem' }}>Starter, 4.1% a month. <a href="#product">See chart</a></span>
            </div>
          </Tile>
          <Tile span={2} title="Anomaly alerts" text="Pulsegrid learns your normal and pings Slack when checkout drifts out of it.">
            <LiveSpeedometer value={62} spread={12} unit="ms p95" label="Checkout latency" style={{ maxWidth: '14rem' }} />
            <Alert tone="danger"><Icon name="bell" /> Checkout p95 up 38% in Brazil since 02:14</Alert>
          </Tile>
        </div>
      </Full>

      {/* INTEGRATIONS: a code-editor band. */}
      <Full id="integrations" mode="dark">
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="grid cols-1">
            <Head label="integrations" title="Plugs into the stack you already run" text="60+ sources and destinations from a menu, and one snippet for everything else. Click a logo in the orbit." />
            <div className="round grid cols-1 gap-0" style={{ background: 'var(--surface)', border: 'var(--border-width) solid var(--border-color)', fontFamily: 'ui-monospace, "JetBrains Mono", Consolas, monospace', fontSize: '.85rem' }}>
              <div className="grid auto-cols gap-lg pad-sm border-bottom">
                <small>index.js</small><small style={{ opacity: .4 }}>server.py</small><small style={{ opacity: .4 }}>ios.swift</small>
              </div>
              <pre className="pad" style={{ margin: 0, overflow: 'auto', lineHeight: 1.8 }}>
                <span style={{ opacity: .4 }}>1  </span><span className="text-secondary">import</span> pulse <span className="text-secondary">from</span> <span className="text-secondary-lighter">&apos;@pulsegrid/js&apos;</span>;{'\n'}
                <span style={{ opacity: .4 }}>2  </span>{'\n'}
                <span style={{ opacity: .4 }}>3  </span>pulse.<span className="text-primary-lighter">init</span>(<span className="text-secondary-lighter">&apos;pk_live_42&apos;</span>);{'\n'}
                <span style={{ opacity: .4 }}>4  </span>pulse.<span className="text-primary-lighter">track</span>(<span className="text-secondary-lighter">&apos;Checkout&apos;</span>, {'{'} plan: <span className="text-secondary-lighter">&apos;pro&apos;</span> {'}'});
              </pre>
            </div>
          </div>
          <div className="w-100" style={{ maxWidth: '26rem', justifySelf: 'center' }}>
            <Orbit autoPlay interval={2500} startAngle={-90} items={[
              { icon: <i className="fa-brands fa-slack" />, title: 'Slack', text: 'Alerts and digests in any channel.' },
              { icon: <i className="fa-brands fa-stripe" />, title: 'Stripe', text: 'Revenue joined to behavior.' },
              { icon: <i className="fa-brands fa-shopify" />, title: 'Shopify', text: 'Every order and cart, no code.' },
              { icon: <i className="fa-brands fa-hubspot" />, title: 'HubSpot', text: 'Health scores on each deal.' },
              { icon: <i className="fa-brands fa-aws" />, title: 'S3 export', text: 'Raw events to your bucket.' },
              { icon: <i className="fa-brands fa-js" />, title: 'JS SDK', text: 'One snippet, under 9 kB.' },
            ]} />
          </div>
        </div>
      </Full>

      {/* NUMBERS: big figures split by lines, on the gradient. */}
      <Full className="bg-gradient" space="3rem">
        <div className="grid gap-lg" style={{ '--cols': 4, '--min': '9rem' }}>
          {[ [ 2.4, 'B', 'events a day', 1 ], [ 99.99, '%', 'uptime', 2 ], [ 0.8, 's', 'median query', 1 ], [ 38, '%', 'more retention', 0 ] ].map(([ v, s, l, d ]) => (
            <div key={l}><CountUp to={v} decimals={d} suffix={s} className="display fw-bold" /><br /><small>{l}</small></div>
          ))}
        </div>
      </Full>

      {/* SHORT: a migration offer, boxed. */}
      <Box inner="grid layout-ends items-center gap-sm">
        <span className="circle bg-gradient col-center" style={{ width: '2.5rem', aspectRatio: 1, color: 'var(--light)' }}><Icon name="arrow-right-arrow-left" /></span>
        <span><strong>Moving from another analytics tool?</strong> <span className="opacity-75">We import your history for free, usually in a day.</span></span>
        <Button icon="arrow-right" href="#contact" className="outline-primary col-last">Book a migration</Button>
      </Box>

      {/* CUSTOMERS: a quote wall, the first one big, the last a case study on a photo. */}
      <Full id="customers" className="bg">
        <Head label="customers" title="Teams that switched don't go back" center />
        <div className="grid" style={{ '--cols': 3, '--min': '15rem' }}>
          {[
            { q: 'We found our activation moment in a week. It had been hiding in our data for two years. Onboarding now leads with it, and retention is up 38%.', n: 'Priya Raman', r: 'VP Product', c: 'Northpeak', i: 'mountain-sun', big: true },
            { q: 'The only analytics tool our designers open without being asked.', n: 'Tomás Ferreira', r: 'Head of Design', c: 'Quill', i: 'feather' },
            { q: 'An alert caught a broken checkout in Brazil at 3 AM. That one night paid for the year.', n: 'Hannah Okafor', r: 'CTO', c: 'Voltline', i: 'bolt' },
            { q: 'Set up before lunch, first dashboard shared before coffee.', n: 'Leo Brandt', r: 'Founder', c: 'Harborly', i: 'anchor' },
            { q: 'Our analysts got 11 hours a week back. They spend them on questions now, not queries.', n: 'Mina Sato', r: 'Data Lead', c: 'Blockwise', i: 'cube' },
          ].map(t => (
            <figure key={t.n} className={`border round pad grid cols-1 content-start ${t.big ? 'span-2 bg-primary' : ''}`} style={{ margin: 0, gridRow: t.big ? 'span 2' : undefined }}>
              <span className="fw-bold opacity-75"><Icon name={t.i} /> {t.c}</span>
              <blockquote style={{ margin: 0 }} className={t.big ? 'display-sm' : 'fs-lg'}>&ldquo;{t.q}&rdquo;</blockquote>
              <figcaption><strong>{t.n}</strong> <small className="opacity-75">· {t.r}</small></figcaption>
            </figure>
          ))}
          <ImageCard src="/img/blue4.webp" overlay="glass" ratio={null} className="h-100" style={{ minHeight: '16rem' }} badge="+38% retention"
            label="Case study · Northpeak" title="How a trail app found its aha moment">
            <Button icon="arrow-right" href="#customers" className="light">Read the story</Button>
          </ImageCard>
        </div>
      </Full>

      {/* SHORT: ratings, boxed on the gradient. */}
      <Box className="bg-gradient" inner="grid gap-sm items-center text-center" style={{ '--cols': 3, '--min': '12rem' }}>
        {[ [ 'star', '4.9 / 5', '1,200 reviews' ], [ 'trophy', 'Best analytics', 'Product Awards 2026' ], [ 'headset', '< 2 h', 'median support reply' ] ].map(([ i, v, l ]) => (
          <div key={l} className="center gap-sm"><Icon name={i} className="fs-lg" /><span><strong className="fs-lg">{v}</strong><br /><small>{l}</small></span></div>
        ))}
      </Box>

      {/* PRICING: a comparison table, plans as columns. */}
      <Full id="pricing" className="bg border-bottom" style={{ borderTop: 'var(--border-width) solid var(--border-color)' }}>
        <Head label="pricing" title="Pay for events, not seats" text="Every plan has unlimited seats. Switch or cancel any month." center />
        <div className="overflow-auto">
          <div className="grid gap-0 border round" role="table" aria-label="Plans" style={{ gridTemplateColumns: 'minmax(10rem, 1.4fr) repeat(3, minmax(8rem, 1fr))', minWidth: '36rem' }}>
            {[ [ '', 'Starter', 'Growth', 'Enterprise' ], [ 'Price', '$0', '$149 / mo', 'Custom' ], [ 'Events a month', '1M', '20M', 'Unlimited' ], [ 'History', '7 days', '2 years', 'Forever' ],
              [ 'Dashboards', '3', true, true ], [ 'Anomaly alerts', false, true, true ], [ 'SSO and SCIM', false, false, true ], [ 'Data residency', false, false, true ], [ 'Support', 'Community', 'Email, 1 day', 'Named manager' ] ].map((row, r) => row.map((cell, c) => (
              <div key={`${r}-${c}`} role={r === 0 ? 'columnheader' : 'cell'}
                className={`pad-sm ${c ? 'text-center' : ''} ${r === 0 ? 'fw-bold fs-lg' : ''} ${c === 2 ? 'bg-primary' : ''} ${r ? 'border-bottom' : ''}`}
                style={r === 1 ? { fontSize: '1.4rem', fontWeight: 700 } : undefined}>
                {cell === true ? <Icon name="check" className="text-primary" /> : cell === false ? <span className="opacity-25">—</span> : cell}
                {r === 0 && c === 2 && <><br /><small className="fw-normal">Most popular</small></>}
              </div>
            )))}
            <div className="pad-sm" />
            <div className="pad-sm col-center"><Button icon="rocket" href="#contact" className="outline-primary">Start free</Button></div>
            <div className="pad-sm col-center bg-primary"><Button icon="bolt" href="#contact" className="gradient">Start trial</Button></div>
            <div className="pad-sm col-center"><Button icon="handshake" href="#contact" className="outline-secondary">Talk to sales</Button></div>
          </div>
        </div>
      </Full>

      {/* FAQ: two columns of question and answer, no accordion. */}
      <Full className="bg">
        <Head label="faq" title="Questions, answered" />
        <dl className="grid gap-lg" style={{ '--cols': 2, '--min': '16rem' }}>
          {[ [ 'How long does setup take?', 'Most teams send their first events within five minutes, using the snippet or a one-click source.' ],
             [ 'Do you sample data?', 'Never. Every query runs on every event, so the numbers match your billing system.' ],
             [ 'Where is my data stored?', 'In the region you pick at signup: US (Oregon) or EU (Frankfurt). It never leaves.' ],
             [ 'Can I cancel anytime?', 'Yes. Monthly plans stop at the end of the month, and you can export everything first.' ] ].map(([ q, a ]) => (
            <div key={q} className="grid cols-1 gap-sm"><dt className="fw-bold fs-lg">{q}</dt><dd className="opacity-75" style={{ margin: 0 }}>{a}</dd></div>
          ))}
        </dl>
      </Full>

      {/* CONTACT */}
      <Full id="contact" className="bg-gradient-darker" style={{ color: 'var(--light)' }}>
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="grid cols-1 gap-sm">
            <h2 className="display fw-bold" style={{ letterSpacing: '-.03em' }}>See your product clearly.</h2>
            <p className="fs-lg" style={{ opacity: .8 }}>A 20-minute demo on your own data, or start the trial and explore on your own.</p>
          </div>
          <div className="round shadow pad" style={{ background: 'var(--body-bg)', color: 'var(--body-color)' }}>
            <ContactForm topics={[ 'Book a demo', 'Pricing question', 'Migration help', 'Security review' ]} submitLabel="Book my demo" done="Demo request received. We'll email you times today." />
          </div>
        </div>
      </Full>

      {/* FOOTER */}
      <Full mode="dark" space="3rem">
        <div className="grid gap-lg" style={{ '--cols': 4, '--min': '9rem' }}>
          {[ [ 'Product', [ 'Funnels', 'Retention', 'Alerts', 'Changelog' ] ], [ 'Company', [ 'About', 'Careers', 'Press' ] ], [ 'Resources', [ 'Docs', 'API', 'Status' ] ], [ 'Legal', [ 'Privacy', 'Terms', 'DPA' ] ] ].map(([ h, links ]) => (
            <nav key={h} className="grid cols-1 gap-sm content-start" aria-label={h}>
              <strong>{h}</strong>
              {links.map(l => <a key={l} href="#top" style={{ color: 'inherit', opacity: .7, textDecoration: 'none', justifySelf: 'start' }}>{l}</a>)}
            </nav>
          ))}
        </div>
        <small style={{ opacity: .5 }}>&copy; 2026 Pulsegrid Inc., a fictional company: a demo landing page for this theme.</small>
      </Full>
    </Page>
  );
}

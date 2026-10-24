import '@fontsource-variable/sora';
import '@fontsource-variable/manrope';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Button } from 'marccent-theme/components/ui/button';
import { StatCard, ImageCard } from 'marccent-theme/components/widgets/layout';
import { CardFan } from '@/components/widgets/fun';
import ThemedMap from '@/components/apps/map';
import { Page, Full, Box } from '../blocks';
import { AccountForm, CountUp, LiveSpeedometer, LiveRadar } from '../parts';

/*
 * Landing page: Fernbank, a (fictional) mobile bank. Premium and calm: Sora headings over Manrope, forest and mint,
 * night sections against light ones, numbered feature rows (the last on a tinted forest photo), card faces for the plans, a fee comparison, an app-store
 * rating summary and an ATM map. Hover: hover-holographic (card faces; buttons have it by default).
 */

export const metadata = { title: 'Fernbank: banking that grows with you' };

const PALETTE = { primary: '#1d8a57', secondary: '#7ce0b0', dark: '#0a1411', light: '#f6faf8' }; // forest, mint, night, frost

// A card face: chip, contactless mark, number, holder and brand circles, in any background.
const CardFace = ({ bg = 'linear-gradient(135deg, var(--primary-darker), var(--dark))', tier = 'Everyday', holder = 'ALEX MORGAN', className = '', style }) => (
  <div className={`round shadow-lg pad grid cols-1 gap-sm hover-holographic ${className}`} style={{ aspectRatio: 1.586, background: bg, color: 'var(--light)', alignContent: 'space-between', ...style }}>
    <div className="header">
      <strong style={{ fontFamily: 'var(--font-heading)' }}><Icon name="seedling" /> fernbank</strong>
      <small className="text-uppercase" style={{ letterSpacing: '.15em', opacity: .8 }}>{tier}</small>
    </div>
    <div className="grid auto-cols gap-sm items-center justify-start">
      <span className="round" style={{ width: '2.4rem', height: '1.8rem', background: 'linear-gradient(135deg, var(--secondary-lighter), var(--secondary-darker) 50%, var(--secondary-lighter))' }} />
      <Icon name="wifi" style={{ rotate: '90deg', opacity: .8 }} />
    </div>
    <span style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>5412 •••• •••• 0427</span>
    <div className="header">
      <strong className="fs-sm">{holder}</strong>
      <span className="stack" style={{ width: '2.6rem' }}>
        <span className="circle" style={{ width: '1.6rem', aspectRatio: 1, background: 'var(--secondary)', opacity: .9 }} />
        <span className="circle" style={{ width: '1.6rem', aspectRatio: 1, background: 'var(--primary)', opacity: .9, justifySelf: 'end' }} />
      </span>
    </div>
  </div>
);

// The app on a phone: balance, quick actions, recent payments.
const Phone = () => (
  <div data-theme="dark" className="shadow-lg pad-sm border" style={{ width: '16rem', maxWidth: '100%', borderRadius: '2.5rem', background: 'var(--body-bg)' }}>
    <div data-theme="light" className="grid cols-1 gap-sm pad" style={{ borderRadius: '2rem', background: 'var(--body-bg)', color: 'var(--body-color)' }}>
      <div className="header"><small className="fw-bold">9:41</small><small><Icon name="signal" /> <Icon name="battery-three-quarters" /></small></div>
      <small style={{ opacity: .6 }}>Good morning, Alex</small>
      <div><small style={{ opacity: .6 }}>Total balance</small><br /><span className="display-sm fw-bold">$<CountUp to={12480.52} decimals={2} /></span></div>
      <div className="grid fixed cols-4 gap-sm text-center">
        {[ [ 'paper-plane', 'Send' ], [ 'arrow-down', 'Request' ], [ 'piggy-bank', 'Save' ], [ 'ellipsis', 'More' ] ].map(([ i, l ]) => (
          <div key={l} className="grid cols-1 gap-0 justify-center"><span className="circle col-center" style={{ width: '2.3rem', aspectRatio: 1, background: 'var(--primary-darker)', color: 'var(--secondary)' }}><Icon name={i} /></span><small style={{ fontSize: '.7rem' }}>{l}</small></div>
        ))}
      </div>
      <div className="grid cols-1 gap-0">
        {[ [ 'mug-hot', 'Blue Door Café', '-$6.40' ], [ 'building-columns', 'Paycheck', '+$3,120.00' ], [ 'cart-shopping', 'Greenleaf Market', '-$84.17' ] ].map(([ i, n, a ]) => (
          <div key={n} className="grid gap-sm items-center pad-y-sm" style={{ gridTemplateColumns: 'auto 1fr auto', borderTop: 'var(--border-width) solid var(--border-color)' }}>
            <Icon name={i} className="text-primary" /><small className="text-truncate">{n}</small><small className="fw-bold" style={{ color: a[0] === '+' ? 'var(--primary)' : undefined }}>{a}</small>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// A numbered feature row: a big outlined number, the words, the widget.
const Row = ({ n, title, text, children, flip }) => (
  <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
    <div className={`grid cols-1 gap-sm ${flip ? 'order-last' : ''}`}>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 800, lineHeight: 1, color: 'transparent', WebkitTextStroke: '2px var(--secondary)' }}>{n}</span>
      <h2 style={{ fontWeight: 700 }}>{title}</h2>
      <p className="fs-lg" style={{ opacity: .75 }}>{text}</p>
    </div>
    {children}
  </div>
);

export default function Fernbank() {
  return (
    <Page palette={PALETTE} style={{ '--font-heading': '"Sora Variable", system-ui, sans-serif', '--font-body': '"Manrope Variable", system-ui, sans-serif' }}>

      {/* HERO */}
      <Full mode="dark" space="1.25rem 0" className="overflow-hidden">
        <nav className="grid layout-ends items-center gap-sm" aria-label="Fernbank">
          <a href="#top" className="grid auto-cols gap-sm items-center fs-lg fw-bold" style={{ color: 'inherit', textDecoration: 'none', fontFamily: 'var(--font-heading)' }}>
            <span className="shape-leaf col-center" style={{ width: '2rem', aspectRatio: 1, background: 'var(--secondary)', color: 'var(--dark)' }}><Icon name="seedling" style={{ fontSize: '.8em' }} /></span>fernbank
          </a>
          <div className="grid auto-cols gap-lg">{[ [ 'Features', '#features' ], [ 'Plans', '#plans' ], [ 'Fees', '#fees' ], [ 'ATMs', '#atms' ] ].map(([ n, h ]) => <a key={n} href={h} style={{ color: 'inherit', textDecoration: 'none', opacity: .8 }}>{n}</a>)}</div>
          <Button icon="user-plus" href="#open" className="light col-last icon-only-sm">Open account</Button>
        </nav>
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '19rem', paddingBlock: 'clamp(3rem, 8vw, 6rem)' }}>
          <div className="grid cols-1 content-center">
            <small className="fw-bold text-uppercase" style={{ color: 'var(--secondary)', letterSpacing: '.2em' }}>4.60% APY · no fees · FDIC insured</small>
            <h1 style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5rem)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-.03em' }}>Money that grows while you live.</h1>
            <p className="fs-lg" style={{ opacity: .75, maxWidth: '30rem' }}>No monthly fees, no minimums, paychecks up to two days early, and a savings rate ten times the national average.</p>
            <div className="grid auto-cols gap-sm justify-start">
              <Button icon="user-plus" href="#open" className="light">Open in 3 minutes</Button>
              <Button icon="fa-brands fa-apple" href="#open" style={{ borderColor: 'var(--border-color)' }}>Get the app</Button>
            </div>
          </div>
          {/* The card tilted behind the phone. */}
          <div className="stack" style={{ placeItems: 'center', minHeight: '30rem' }}>
            <div className="circle" style={{ width: '80%', aspectRatio: 1, background: 'radial-gradient(circle, color-mix(in srgb, var(--secondary) 35%, transparent), transparent 70%)' }} />
            <CardFace style={{ width: '17rem', rotate: '-14deg', translate: '-28% 30%' }} />
            <div style={{ translate: '22% 0', rotate: '4deg' }}><Phone /></div>
          </div>
        </div>
      </Full>

      {/* PRESS */}
      <Full className="bg border-bottom" space="1.75rem" inner="grid cols-1 opacity-50 text-center">
        <div className="grid gap-lg" style={{ '--cols': 5, '--min': '8rem' }}>
          {[ 'The Ledger', 'MarketWeek', 'Money Talks', 'Finance Daily', 'Morning Brief' ].map(n => <strong key={n} className="fs-lg" style={{ fontFamily: 'var(--font-heading)' }}>{n}</strong>)}
        </div>
      </Full>

      {/* SHORT: the sign-up bonus, boxed over the site. */}
      <Box className="bg-gradient" inner="grid layout-ends items-center gap-sm" style={{ color: 'var(--light)' }}>
        <strong className="display-sm" style={{ fontFamily: 'var(--font-heading)' }}>$50</strong>
        <span>when your first paycheck lands in Fernbank. No minimums, no catch.</span>
        <Button icon="arrow-right" href="#open" className="light col-last">Claim it</Button>
      </Box>

      {/* FEATURES: numbered rows, alternating sides and backgrounds. */}
      <Full id="features" className="bg">
        <Row n="01" title="Watch your score climb" text="Free weekly credit updates, and Credit Builder reports every on-time payment to all three bureaus. Members gain 42 points on average in a year.">
          <LiveSpeedometer value={742} spread={6} max={850} unit="FICO®" label="Very good" style={{ maxWidth: '18rem' }} />
        </Row>
      </Full>
      <Full className="bg-primary-lighter" style={{ color: 'var(--dark)' }}>
        <Row flip n="02" title="See where it goes" text="Every purchase sorted on its own. Set limits by category and get a nudge before you go over, not a fee after.">
          <LiveRadar style={{ width: 'min(80%, 20rem)', justifySelf: 'center' }} axes={[ { label: 'Food', value: 72 }, { label: 'Rent', value: 95 }, { label: 'Travel', value: 40 }, { label: 'Fun', value: 55 }, { label: 'Bills', value: 66 }, { label: 'Health', value: 30 } ]} />
        </Row>
      </Full>
      <Full mode="dark">
        <Row n="03" title="Save for what matters" text="Make a pot for anything. Round-ups and paycheck splits fill it while you get on with your life.">
          <div className="grid cols-1">
            {[ [ 'plane', 'Japan trip', 2560, 4000 ], [ 'shield-heart', 'Emergency fund', 8800, 10000 ], [ 'car', 'New car', 1150, 5000 ] ].map(([ i, n, have, goal ]) => (
              <div key={n} className="grid gap-sm items-center" style={{ gridTemplateColumns: 'auto minmax(0, 1fr)' }}>
                <span className="circle col-center" style={{ width: '2.8rem', aspectRatio: 1, background: 'var(--primary-darker)', color: 'var(--secondary)' }}><Icon name={i} /></span>
                <div className="grid cols-1 gap-sm">
                  <div className="header"><strong>{n}</strong><small style={{ opacity: .7 }}>${have.toLocaleString()} of ${goal.toLocaleString()}</small></div>
                  <div className="round" style={{ height: '.6rem', background: 'var(--muted-bg)' }}><div className="h-100" style={{ width: `${have / goal * 100}%`, background: 'var(--secondary)', borderRadius: '4px' }} /></div>
                </div>
              </div>
            ))}
          </div>
        </Row>
      </Full>

      <Full className="bg">
        <Row flip n="04" title="Your money plants forests" text="We never lend to fossil fuels, and we plant a tree for every account opened. 1.2 million so far, most of them in Oregon.">
          <ImageCard src="/img/green2.webp" canvas="leaves" overlay="tint" ratio="4 / 3" badge="1.2M trees" label="Fernbank Forest · Oregon" title="Planted by our members" />
        </Row>
      </Full>

      {/* PLANS: each one a card face. */}
      <Full id="plans" className="bg overflow-hidden">
        <header className="grid cols-1 gap-sm text-center justify-center">
          <h2 className="display-sm" style={{ fontWeight: 700 }}>Pick your card</h2>
          <p className="fs-lg opacity-75">Free forever, or a little more for a lot more.</p>
        </header>
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '16rem' }}>
          {[ [ 'Everyday', '$0', 'linear-gradient(135deg, var(--primary), var(--dark))', [ '4.60% APY', '1% cashback', '55,000 free ATMs' ] ],
             [ 'Plus', '$4', 'linear-gradient(135deg, var(--primary), var(--secondary))', [ '4.85% APY', '2% cashback', 'Credit Builder', 'Phone insurance' ] ],
             [ 'Metal', '$12', 'linear-gradient(135deg, var(--secondary-darker), var(--dark) 55%, var(--secondary-darker))', [ '5.10% APY', '3% back on travel', 'Airport lounges', 'Travel insurance' ] ] ].map(([ t, p, bg, items ]) => (
            <div key={t} className="grid cols-1 content-start">
              <CardFace tier={t} bg={bg} />
              <div className="header"><h3 style={{ fontWeight: 700 }}>{t}</h3><span><strong className="fs-lg">{p}</strong><small className="opacity-75"> / month</small></span></div>
              <ul className="grid cols-1 gap-sm">{items.map(x => <li key={x} className="grid auto-cols gap-sm items-center justify-start"><Icon name="check" className="text-primary" />{x}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="grid cols-1 gap-sm justify-center text-center">
          <CardFan cards={[
            { title: 'Everyday', icon: <Icon name="seedling" className="fs-lg" />, className: 'bg-secondary' },
            { title: 'Plus', icon: <Icon name="leaf" className="fs-lg" />, className: 'bg-gradient' },
            { title: 'Metal', icon: <Icon name="tree" className="fs-lg" />, className: 'bg-gradient-darker' },
          ]} />
          <small className="opacity-75">Upgrade or downgrade any month, right in the app.</small>
        </div>
      </Full>

      {/* FEES: us against a typical big bank. */}
      <Full id="fees" className="bg-primary-lighter" style={{ color: 'var(--dark)' }} wrap="wrap wrap-sm">
        <h2 className="text-center" style={{ fontWeight: 700 }}>What a typical bank charges you</h2>
        <div className="grid gap-0 round shadow overflow-hidden" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) 1fr 1fr', background: 'var(--light)' }}>
          {[ [ '', 'Typical bank', 'Fernbank' ], [ 'Monthly fee', '$12', '$0' ], [ 'Overdraft', '$35', '$0' ], [ 'Foreign card fee', '3%', '0%' ], [ 'Wire transfer', '$30', '$0' ], [ 'Savings rate', '0.46%', '4.60%' ] ].map((row, r) => row.map((c, k) => (
            <div key={`${r}-${k}`} className={`pad-sm ${k ? 'text-center' : ''} ${r === 0 ? 'fw-bold' : ''}`}
              style={{ borderTop: r ? 'var(--border-width) solid var(--secondary-lighter)' : undefined, background: k === 2 ? 'var(--secondary-lighter)' : undefined, opacity: r && k === 1 ? .6 : undefined, textDecoration: r && k === 1 ? 'line-through' : undefined, color: r && k === 2 ? 'var(--primary-darker)' : undefined, fontWeight: r && k === 2 ? 700 : undefined }}>{c}</div>
          )))}
        </div>
      </Full>

      {/* NUMBERS: StatCards with one gradient through them. */}
      <Full mode="dark">
        <div className="grid gap-sm bg-gradient-run" style={{ '--cols': 3, '--min': '13rem' }}>
          <StatCard icon="users" value={<CountUp to={2.1} decimals={1} suffix="M" />} label="Members" fill={70} />
          <StatCard icon="piggy-bank" value={<CountUp to={318} prefix="$" suffix="M" />} label="Interest paid to members" fill={82} />
          <StatCard icon="leaf" value="0" label="Dollars lent to fossil fuels" fill={100} />
        </div>
      </Full>

      {/* REVIEWS: an app-store summary. */}
      <Full className="bg">
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '15rem' }}>
          <div className="grid cols-1 gap-sm content-start">
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 800, lineHeight: 1 }}>4.8</span>
            <span className="text-secondary">{[ 1, 2, 3, 4, 5 ].map(n => <Icon key={n} name="star" />)}</span>
            <small className="opacity-75">210,000 ratings on the App Store</small>
            {[ [ 5, 86 ], [ 4, 9 ], [ 3, 3 ], [ 2, 1 ], [ 1, 1 ] ].map(([ s, pct ]) => (
              <div key={s} className="grid gap-sm items-center" style={{ gridTemplateColumns: '1rem minmax(0, 1fr) 2.5rem' }} title={`${s} stars: ${pct}%`}>
                <small>{s}</small>
                <div className="round" style={{ height: '.45rem', background: 'var(--muted-bg)' }}><div className="bg-secondary h-100" style={{ width: `${pct}%`, borderRadius: '4px' }} /></div>
                <small className="opacity-75 text-end">{pct}%</small>
              </div>
            ))}
          </div>
          {[ [ 'Finally a bank that doesn\'t punish me', 'Moved my paycheck and got it on a Wednesday. No fees in two years.', 'jordan.e', 'Mar 2026' ],
             [ 'Round-ups paid for Lisbon', 'I didn\'t notice the money leave and then suddenly I had a flight. Magic.', 'meichen', 'Jan 2026' ] ].map(([ t, b, u, d ]) => (
            <article key={u} className="border round pad grid cols-1 gap-sm content-start">
              <span className="text-secondary">{[ 1, 2, 3, 4, 5 ].map(n => <Icon key={n} name="star" style={{ '--icon-size': '1em' }} />)}</span>
              <strong className="fs-lg">{t}</strong>
              <p className="opacity-75">{b}</p>
              <small className="opacity-50">{u} · {d}</small>
            </article>
          ))}
        </div>
      </Full>

      {/* SHORT: referrals, boxed. */}
      <Box mode="dark" inner="grid layout-ends items-center gap-sm">
        <span className="shape-leaf col-center bg-secondary" style={{ width: '2.4rem', aspectRatio: 1, color: 'var(--dark)' }}><Icon name="user-group" /></span>
        <span><strong>Bring a friend.</strong> <span className="opacity-75">You both get $25 when they open an account.</span></span>
        <Button icon="share-nodes" href="#open" className="outline-secondary col-last">Invite</Button>
      </Box>

      {/* ATMS + OPEN */}
      <Full id="atms" className="bg-primary-lighter" style={{ color: 'var(--dark)' }}>
        <div className="grid gap-lg" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="grid cols-1 gap-sm content-start">
            <h2 style={{ fontWeight: 700 }}>55,000 free ATMs</h2>
            <p className="fs-lg" style={{ opacity: .75 }}>There&apos;s probably one on your block. Here&apos;s downtown San Francisco.</p>
            <ThemedMap center={{ lat: 37.7897, lng: -122.4014 }} zoom={15} className="round shadow" style={{ minHeight: '22rem' }} />
          </div>
          <div id="open" className="grid cols-1 gap-sm content-start">
            <h2 style={{ fontWeight: 700 }}>Open an account</h2>
            <p className="fs-lg" style={{ opacity: .75 }}>Three steps, about three minutes, no credit check.</p>
            <div className="round shadow pad" style={{ background: 'var(--body-bg)', color: 'var(--body-color)' }}><AccountForm /></div>
          </div>
        </div>
      </Full>

      {/* FOOTER */}
      <Full mode="dark" space="2.5rem" inner="grid cols-1 gap-sm">
        <strong style={{ fontFamily: 'var(--font-heading)' }}><Icon name="seedling" className="text-secondary" /> fernbank</strong>
        <small style={{ opacity: .6 }}>Fernbank is a fictional company: a demo landing page for this theme. Banking services would be provided by FDIC-member partner banks.</small>
      </Full>
    </Page>
  );
}

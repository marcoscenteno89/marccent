import { Icon } from 'marccent-theme/components/ui/icon';
import { Orbit, Countdown } from 'marccent-theme/components/visuals/effects';
import { Button } from 'marccent-theme/components/ui/button';
import { HexGrid, TicketCard, StatCard } from 'marccent-theme/components/widgets/layout';
import { CARD_BUTTON } from 'marccent-theme/components/widgets/card-button';
import { Carousel } from 'marccent-theme/components/widgets/carousel';
import { RingGauge } from '@/components/widgets/data';
import { Atom } from '@/components/widgets/fun';

/*
 * The cards carousel: twenty-one cards in a Carousel (swipe, the arrows or the keyboard), each a different mix of the
 * theme's classes: surfaces, gradients, shapes, rings, loaders and hovers. On the Widgets page and the home page.
 */
export const CardCarousel = ({ label = 'Cards' }) => (
    <Carousel label={label}>
      {/* 1. Profile: a gradient avatar, icon links that rise, stats split by .divide; holographic on hover. */}
      <div className="bg border round shadow pad grid cols-1 gap-sm justify-center text-center h-100 hover-holographic" style={{ alignContent: 'center' }}>
        <div className="circle bg-gradient col-center fw-bold" style={{ width: '5rem', aspectRatio: 1, fontSize: '1.75rem' }}>AL</div>
        <div><strong className="fs-lg">Ada Lovelace</strong><br /><small className="opacity-75">Analyst · First programmer</small></div>
        <div className="row-wrap gap-sm cols-center">
          {[ 'github', 'linkedin', 'codepen' ].map(n => <Button key={n} icon={`fa-brands fa-${n}`} aria-label={n} className="outline-primary" />)}
        </div>
        <div className="grid fixed cols-3 gap-0 divide border round w-100">
          {[ [ '128', 'Posts' ], [ '4.2k', 'Followers' ], [ '310', 'Following' ] ].map(([ v, l ]) => (
            <div key={l} className="pad-y-sm"><strong>{v}</strong><br /><small className="opacity-75">{l}</small></div>
          ))}
        </div>
      </div>

      {/* 2. Goal: a StatCard with the gradient as its accent and a progress ring. */}
      <StatCard className="bg border h-100" accent fill={71} icon="fire" value="5 / 7" label="Workouts this week" text="Two more to hit your weekly goal.">
        <Button icon="plus" className="gradient w-100">Log one</Button>
      </StatCard>

      {/* 3. Event pass: a TicketCard with a ribbon. */}
      <TicketCard className="h-100" label="Oct 30 · 9 PM" title="Synthwave" note="live" ribbon="Sold out"
        items={[ { icon: 'location-dot', text: 'The Warehouse' }, { icon: 'headphones', text: 'Three DJs, one night' }, { icon: 'champagne-glasses', text: '21+' } ]}
        action={<Button icon="ticket" className="outline-secondary w-100" disabled>Sold out</Button>} />

      {/* 4. Feature: a gradient hexagon that flips like a coin on hover. */}
      <div className="bg border round shadow pad grid cols-1 gap-sm justify-center text-center h-100" style={{ alignContent: 'center' }}>
        <div className="shape-hexagon bg-gradient col-center" style={{ width: '6rem' }}><Icon name="bolt" className="fs-lg" /></div>
        <strong className="fs-lg">Lightning fast</strong>
        <p className="opacity-75">Static pages, self-hosted fonts and nothing loaded that a page doesn&apos;t use.</p>
        <Button href="#layouts">Learn more</Button>
      </div>

      {/* 5. Testimonial: the quote in a speech bubble, the person under its tail. */}
      <div className="grid cols-1 gap-sm h-100" style={{ alignContent: 'start' }}>
        <div className="shape-bubble bg-secondary pad col-center text-center" style={{ aspectRatio: 'auto', paddingBottom: '3.5rem' }}>
          <Icon name="quote-left" className="opacity-50" />
          <p>&ldquo;The site feels like one product, from the menus to the tiniest loader.&rdquo;</p>
        </div>
        <div className="grid auto-cols gap-sm items-center" style={{ paddingLeft: '1rem' }}>
          <div className="circle bg-primary col-center fw-bold" style={{ width: '2.75rem', aspectRatio: 1 }}>GH</div>
          <div><strong>Grace Hopper</strong><br /><span className="text-secondary">{[ 1, 2, 3, 4, 5 ].map(n => <Icon key={n} name="star" style={{ '--icon-size': '1em' }} />)}</span></div>
        </div>
      </div>

      {/* 6. Status: a ring gauge over a small table of numbers. */}
      <div className="bg border round shadow pad grid cols-1 justify-center text-center h-100 hover-holographic" style={{ alignContent: 'center' }}>
        <RingGauge value={86} label="Uptime" size="8rem" />
        <div className="grid fixed cols-2 gap-sm w-100 text-start">
          {[ [ 'Requests', '1.4M' ], [ 'Errors', '0.02%' ], [ 'Latency', '84 ms' ], [ 'Regions', '6' ] ].map(([ k, v ]) => (
            <div key={k} className="bg-primary-lighter round pad-x-sm pad-y-sm" style={{ color: 'var(--dark)' }}><small>{k}</small><br /><strong>{v}</strong></div>
          ))}
        </div>
      </div>

      {/* 7. Music player: a spinning record, the indeterminate bar as the playhead, icon controls. */}
      <div className="bg-gradient-darker round shadow pad grid cols-1 gap-sm h-100" style={{ color: 'var(--light)' }}>
        <div className="stack square round" style={{ background: 'rgb(0 0 0 / .25)', placeItems: 'center' }}>
          <div className="circle loader-spin" style={{ width: '80%', aspectRatio: 1, animationDuration: '4s', background: 'repeating-radial-gradient(circle, #111 0 3px, #1d1d1d 3px 6px)' }} />
          <div className="circle bg-gradient" style={{ width: '28%', aspectRatio: 1 }} />
        </div>
        <div><strong className="fs-lg">Midnight Drive</strong><br /><small style={{ opacity: .8 }}>The Neon Grid</small></div>
        <div className="loader-bar" role="progressbar" aria-label="Playing" />
        <div className="grid fixed cols-3 gap-sm justify-center">
          <Button icon="backward" aria-label="Previous" style={{ color: 'inherit', borderColor: 'transparent' }} />
          <Button icon="pause" aria-label="Pause" className="light" />
          <Button icon="forward" aria-label="Next" style={{ color: 'inherit', borderColor: 'transparent' }} />
        </div>
      </div>

      {/* 8. Weather: a sky gradient, a big temperature, a row of days. */}
      <div className="round shadow pad grid cols-1 gap-sm text-center h-100" style={{ background: 'linear-gradient(170deg, var(--info-mode), var(--primary-mode))', color: 'var(--body-color)', alignContent: 'space-between' }}>
        <small className="text-uppercase fw-bold" style={{ opacity: .8 }}>Idaho Falls</small>
        <Icon name="cloud-sun" className="display-lg" style={{ '--icon-size': '1.3em', justifySelf: 'center' }} />
        <span className="display-lg fw-bold">21°</span>
        <small style={{ opacity: .8 }}>Partly cloudy · H 24° L 9°</small>
        <div className="grid fixed cols-4 gap-0 divide round" style={{ background: 'rgb(255 255 255 / .12)' }}>
          {[ [ 'Thu', 'sun', '24°' ], [ 'Fri', 'cloud', '19°' ], [ 'Sat', 'cloud-rain', '14°' ], [ 'Sun', 'snowflake', '6°' ] ].map(([ d, i, t ]) => (
            <div key={d} className="pad-y-sm"><small>{d}</small><br /><Icon name={i} style={{ '--icon-size': '1.5em' }} /><br /><small>{t}</small></div>
          ))}
        </div>
      </div>

      {/* 9. Terminal: a window with title-bar dots, a build log and a breathing cursor. */}
      <div className="round shadow grid cols-1 gap-0 h-100 hover-holographic" style={{ background: '#0d1117', color: '#e6edf3', alignContent: 'start', fontFamily: 'ui-monospace, "JetBrains Mono", Consolas, monospace' }}>
        <div className="grid auto-cols gap-sm items-center pad-x-sm pad-y-sm" style={{ borderBottom: '1px solid rgb(255 255 255 / .1)' }}>
          {[ 'danger', 'secondary', 'success' ].map(c => <span key={c} className={`circle bg-${c}`} style={{ width: '.75rem', aspectRatio: 1 }} />)}
          <small style={{ opacity: .6 }}>~/marccent</small>
        </div>
        <div className="pad grid cols-1 gap-0" style={{ fontSize: '.85rem', lineHeight: 1.7 }}>
          <span><span className="text-secondary">$</span> npm run build</span>
          <span className="text-success">✓ Compiled successfully</span>
          <span style={{ opacity: .6 }}>  18 pages · 88 kB shared</span>
          <span><span className="text-secondary">$</span> git push</span>
          <span className="text-success">✓ Deployed to production</span>
          <span><span className="text-secondary">$</span> <span className="loader-breathe" style={{ display: 'inline-block', width: '.55em', height: '1em', background: 'currentColor', verticalAlign: 'middle' }} /></span>
        </div>
      </div>

      {/* 10. Cover: layered shapes over the gradient (stack), a tag, a title and a button; grows on hover. */}
      <div className="stack round shadow h-100 hover-holographic" style={{ minHeight: '22rem', color: 'var(--light)' }}>
        <div className="bg-gradient" />
        <div className="shape-ring" style={{ width: '14rem', placeSelf: 'start end', translate: '30% -30%', '--ring-hole': '70%', background: 'rgb(255 255 255 / .18)' }} />
        <div className="shape-hexagon" style={{ width: '6rem', placeSelf: 'center start', translate: '-35% -40%', background: 'rgb(255 255 255 / .15)' }} />
        <div className="shape-star loader-spin" style={{ width: '2.5rem', placeSelf: 'start start', margin: '1.25rem', background: 'rgb(255 255 255 / .6)', animationDuration: '8s' }} />
        <div className="grid cols-1 gap-sm pad self-end">
          <span className="shape-tag bg-light fw-bold fs-sm" style={{ aspectRatio: 'auto', width: 'fit-content', padding: '.2rem 1.4rem .2rem .7rem', color: 'var(--dark)' }}>Featured</span>
          <strong className="display-sm">Shapes &amp; widgets</strong>
          <small style={{ opacity: .9 }}>Forty shapes and a box of widgets, all from one theme.</small>
          <Button icon="arrow-right" href="/shapes" className="light">Explore</Button>
        </div>
      </div>
      {/* 11. Boarding pass: a ticket with airport codes, flight details and a barcode drawn with a repeating gradient. */}
      <div className="shape-ticket grid cols-1 gap-0 h-100" style={{ aspectRatio: 'auto', '--notch': '.9rem', background: 'color-mix(in srgb, var(--primary) 14%, var(--surface))' }}>
        <div className="pad grid cols-1 gap-sm" style={{ borderBottom: '2px dashed var(--border-color)' }}>
          <div className="header"><small className="fw-bold text-uppercase text-primary">Marccent Air</small><small className="opacity-75">Boarding pass</small></div>
          <div className="grid gap-0 items-center text-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
            <div><span className="display-sm fw-bold">BOI</span><br /><small className="opacity-75">Boise</small></div>
            <Icon name="plane" className="text-secondary fs-lg" />
            <div><span className="display-sm fw-bold">SFO</span><br /><small className="opacity-75">San Francisco</small></div>
          </div>
          <div className="grid fixed cols-3 gap-sm">
            {[ [ 'Flight', 'MC 042' ], [ 'Gate', 'B7' ], [ 'Seat', '14A' ], [ 'Board', '07:35' ], [ 'Class', 'Comfort' ], [ 'Zone', '2' ] ].map(([ k, v ]) => (
              <div key={k}><small className="opacity-75">{k}</small><br /><strong>{v}</strong></div>
            ))}
          </div>
        </div>
        <div className="pad grid cols-1 gap-sm">
          <div style={{ height: '3.5rem', background: 'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 7px, transparent 7px 9px, currentColor 9px 10px, transparent 10px 14px)' }} aria-label="Barcode" role="img" />
          <small className="text-center opacity-75" style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '.3em' }}>0420 1435 7781</small>
        </div>
      </div>

      {/* 12. Bank card: a card face with a chip, contactless mark and brand circles; holographic on hover. */}
      <div className="bg border round shadow pad grid cols-1 h-100" style={{ alignContent: 'center' }}>
        <div className="bg-gradient-darker round shadow pad grid cols-1 gap-sm hover-holographic" style={{ aspectRatio: 1.586, color: 'var(--light)', alignContent: 'space-between' }}>
          <div className="header">
            <span className="round" style={{ width: '2.4rem', height: '1.8rem', background: 'linear-gradient(135deg, #f6e27a, #cb9b51 50%, #f6f2c0)' }} />
            <Icon name="wifi" style={{ rotate: '90deg', opacity: .8 }} />
          </div>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '.95rem', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>4242 •••• •••• 4242</span>
          <div className="header">
            <div><small style={{ opacity: .7 }}>Card holder</small><br /><strong className="fs-sm">ADA LOVELACE</strong></div>
            <span className="stack" style={{ width: '3rem' }}>
              <span className="circle bg-danger" style={{ width: '1.8rem', aspectRatio: 1, opacity: .9 }} />
              <span className="circle bg-secondary" style={{ width: '1.8rem', aspectRatio: 1, opacity: .9, justifySelf: 'end' }} />
            </span>
          </div>
        </div>
        <div><small className="opacity-75">Balance</small><br /><span className="display-sm fw-bold">$2,480<span className="opacity-50">.12</span></span></div>
        <div className="grid fixed cols-2 gap-sm">
          <Button icon="paper-plane" className="gradient">Send</Button>
          <Button icon="hand-holding-dollar" className="outline-primary">Ask</Button>
        </div>
      </div>

      {/* 13. Particle lab: the Atom widget in a card. */}
      <div className="bg border round shadow pad grid cols-1 gap-sm justify-center text-center h-100" style={{ alignContent: 'center' }}>
        <Atom className="w-100" style={{ maxWidth: '12rem', justifySelf: 'center' }} />
        <strong className="fs-lg">Particle lab</strong>
        <p className="opacity-75">Three electrons, three speeds, one nucleus. Hover to freeze time.</p>
      </div>

      {/* 14. Toolbox: a honeycomb flower of tool icons around a gradient center. */}
      <div className="bg border round shadow pad grid cols-1 gap-sm text-center h-100" style={{ alignContent: 'center' }}>
        <HexGrid at={[ [ 0, 1 ], [ 0, 3 ], [ 1, 0 ], [ 1, 2 ], [ 1, 4 ], [ 2, 1 ], [ 2, 3 ] ]} className="w-100">
          {[ 'fa-brands fa-html5', 'fa-brands fa-css3-alt', 'fa-brands fa-js', 'fa-solid fa-code', 'fa-brands fa-react', 'fa-brands fa-node-js', 'fa-brands fa-git-alt' ].map((ic, i) => (
            <div key={ic} className={`shape-hexagon col-center fs-lg ${i === 3 ? 'bg-gradient' : i % 2 ? 'bg-primary' : 'bg-secondary'}`}><i className={ic} aria-hidden="true" /></div>
          ))}
        </HexGrid>
        <strong className="fs-lg">Toolbox</strong>
        <small className="opacity-75">What this site is built with, in a honeycomb.</small>
      </div>

      {/* 15. Launch: a gooey countdown in deep space (dots of stars over a radial glow). */}
      <div className="round shadow pad grid cols-1 gap-sm justify-center text-center h-100" style={{ alignContent: 'center', color: '#f2ecff',
        background: 'radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 15%, #fff, transparent), radial-gradient(1.5px 1.5px at 85% 60%, #fff, transparent), radial-gradient(1px 1px at 35% 80%, #fff, transparent), radial-gradient(1px 1px at 55% 50%, #fff, transparent), radial-gradient(circle at 30% 20%, #3b1a72, #0b0218 70%)' }}>
        <Icon name="rocket" className="display-sm loader-breathe" style={{ justifySelf: 'center', '--icon-size': '1.4em' }} />
        <small className="text-uppercase fw-bold" style={{ letterSpacing: '.2em', opacity: .8 }}>Launch in</small>
        <div className="col-center"><Countdown from={9} style={{ '--countdown-size': '6rem', color: 'var(--secondary)' }} /></div>
        <small style={{ opacity: .7 }}>T-minus, all systems go.</small>
      </div>

      {/* 16. Polaroid: a tilted photo of a sunset built from shapes, a handwritten caption. */}
      <div className="grid cols-1 gap-sm h-100 col-center">
        <div className="shadow-lg hover-holographic" style={{ background: '#fafafa', color: '#222', padding: '.75rem .75rem 0', rotate: '-4deg', width: '92%' }}>
          <div className="stack square overflow-hidden" style={{ background: 'linear-gradient(#ff9a5a, #e8546b 55%, #6b3a8c)', placeItems: 'center' }}>
            <div className="circle" style={{ width: '38%', aspectRatio: 1, background: '#ffe49a', translate: '0 10%' }} />
            <div className="shape-triangle" style={{ width: '90%', placeSelf: 'end start', translate: '-20% 0', background: '#3a2150' }} />
            <div className="shape-triangle" style={{ width: '75%', placeSelf: 'end end', translate: '15% 0', background: '#2a1638' }} />
          </div>
          <p className="text-center" style={{ fontFamily: '"Caveat", "Segoe Print", "Comic Sans MS", cursive', fontSize: '1.4rem', padding: '.6rem 0 .8rem' }}>sunset at the lake ☀</p>
        </div>
      </div>

      {/* 17. Neon: a dark sign that glows in the secondary color. */}
      <div className="round grid cols-1 gap-sm justify-center text-center pad h-100 hover-holographic" style={{ alignContent: 'center', background: '#07040f',
        border: '2px solid var(--secondary)', boxShadow: '0 0 .6rem var(--secondary), inset 0 0 .8rem color-mix(in srgb, var(--secondary) 40%, transparent)' }}>
        <span className="display fw-bold text-uppercase" style={{ color: '#fff', letterSpacing: '.08em', textShadow: '0 0 .3rem var(--secondary), 0 0 1rem var(--secondary), 0 0 2rem var(--primary)' }}>Open</span>
        <span style={{ color: 'var(--secondary)', fontFamily: '"Caveat", "Segoe Print", cursive', fontSize: '1.6rem', textShadow: '0 0 .6rem var(--secondary)' }}>late nights, good code</span>
        <span className="loader-breathe" style={{ color: '#ff5fa2', textShadow: '0 0 .8rem #ff5fa2' }}><Icon name="heart" className="fs-lg" /></span>
      </div>

      {/* 18. Chat: two people, bubbles with tucked corners, and the other one typing. */}
      <div className="bg border round shadow grid cols-1 gap-0 h-100" style={{ gridTemplateRows: 'auto 1fr' }}>
        <div className="grid auto-cols gap-sm items-center pad-sm border-bottom">
          <span className="stack"><span className="circle bg-gradient col-center fw-bold" style={{ width: '2.4rem', aspectRatio: 1 }}>KJ</span>
            <span className="circle bg-success" style={{ width: '.7rem', aspectRatio: 1, placeSelf: 'end end', border: '2px solid var(--surface)' }} /></span>
          <div><strong>Katherine</strong><br /><small className="text-success">online</small></div>
        </div>
        <div className="pad-sm grid cols-1 gap-sm" style={{ alignContent: 'end' }}>
          {[ [ 0, 'Did the orbit math check out?' ], [ 1, 'Every number. Launch is a go 🚀' ], [ 0, 'Then light the candle.' ], [ 1, 'Counting down now.' ] ].map(([ me, t ], i) => (
            <div key={i} className={`pad-x-sm pad-y-sm fs-sm ${me ? 'bg-primary' : ''}`}
              style={{ maxWidth: '80%', justifySelf: me ? 'end' : 'start', borderRadius: me ? '1rem 1rem .25rem 1rem' : '1rem 1rem 1rem .25rem', background: me ? undefined : 'var(--muted-bg)' }}>{t}</div>
          ))}
          <div className="pad-x-sm pad-y-sm" style={{ width: '4rem', borderRadius: '1rem 1rem 1rem .25rem', background: 'var(--muted-bg)' }}>
            <div className="loader-dots text-secondary" style={{ width: '100%' }} aria-label="Typing" role="status" />
          </div>
        </div>
      </div>

      {/* 19. Skills orbit: an Orbit that turns by itself, five skills round the ring. */}
      <div className="bg border round shadow pad grid cols-1 gap-sm text-center h-100" style={{ alignContent: 'center' }}>
        <Orbit hub={false} autoPlay interval={1800} items={[ [ 'palette', 'Design' ], [ 'code', 'Code' ], [ 'gauge-high', 'Speed' ], [ 'universal-access', 'Access' ], [ 'wand-magic-sparkles', 'Motion' ] ]
          .map(([ icon, title ]) => ({ icon: <Icon name={icon} />, title }))} />
        <strong className="fs-lg">Skills in orbit</strong>
        <small className="opacity-75">The pointer turns to each one in turn; hover to pause.</small>
      </div>

      {/* 20. Spotlight: a border of light that spins round the card (a conic gradient turning behind it). */}
      <div className="stack round shadow h-100 hover-holographic" style={{ overflow: 'hidden', placeItems: 'center' }}>
        <div className="loader-spin" style={{ width: '200%', aspectRatio: 1, animationDuration: '4s',
          background: 'conic-gradient(transparent 0 60%, var(--secondary) 75%, var(--primary) 85%, transparent 100%)' }} />
        <div className="round pad grid cols-1 gap-sm text-center" style={{ margin: '3px', placeSelf: 'stretch', alignContent: 'center', background: 'var(--surface)', position: 'relative' }}>
          {/* A solid surface (not .bg, which a glass theme makes see-through), lifted above the turning layer (a
              transform paints over plain siblings): the light only shows round the edge. */}
          <small className="text-uppercase fw-bold text-secondary" style={{ letterSpacing: '.2em' }}>Spotlight</small>
          <span className="display fw-bold">$9</span>
          <small className="opacity-75">a month · everything included</small>
          <ul className="grid cols-1 gap-sm text-start">
            {[ 'Every theme', 'All the widgets', 'Shapes & hovers' ].map(f => <li key={f} className="grid auto-cols gap-sm items-center"><Icon name="check" className="text-secondary" />{f}</li>)}
          </ul>
          <Button icon="bolt" className="gradient w-100">Go pro</Button>
        </div>
      </div>
      {/* 21. Stat: the gradient StatCard, its content and buttons in the mode's text color. */}
      <StatCard className="bg-gradient h-100" fill={84} icon="rocket" value="42" label="Projects shipped" text="Sites and apps live, from small pages to full tools.">
        <Button icon="eye" className="w-100" style={CARD_BUTTON.filled}>View</Button>
        <Button icon="circle-info" className="w-100" style={CARD_BUTTON.outline}>Details</Button>
      </StatCard>
    </Carousel>
);

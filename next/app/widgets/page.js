import { Icon } from '@/components/ui/icon';
import { Orbit, OrbitClock, SolarSystem, Parallax } from '@/components/visuals/effects';
import { Button } from '@/components/ui/button';
import { HexWall, Timeline, TicketCard, StatCard } from '@/components/widgets/layout';
import { StepBar, TabBar } from '@/components/widgets/nav';
import { RingGauge } from '@/components/widgets/data';
import { Atom, AnalogClock, FlipClock, ShapeLoader, CardFan } from '@/components/widgets/fun';
import { RadialMenuDemo, RadarDemo, SpeedometerDemo, CalendarDemo, RangeCalendarDemo, SchedulerDemo } from './demos';
import { GalleryHeader, Section, Demo } from '@/components/gallery';

/*
 * Widgets gallery: the bigger pieces composed from the building blocks (visuals/effects.js and friends), in the
 * active theme. All hold still for visitors who ask for reduced motion.
 */

export const metadata = { title: 'Widgets' };

const SECTIONS = ['Orbits', 'Solar system', 'Layouts', 'Navigation', 'Data', 'Calendar', 'Showcase', 'Parallax'];

export default function WidgetsPage() {
  return (
    <div className="wrap grid cols-1 gap-lg">
      <GalleryHeader title="Widgets" sections={SECTIONS}>
        <p>Bigger pieces built from the theme&apos;s building blocks: orbits, a solar system, honeycombs, a timeline, menus, gauges, clocks and loaders.</p>
      </GalleryHeader>

      <Section name="Orbits" intro="Orbit and OrbitClock (visuals/effects.js): items round a ring, a pointer that turns to the picked one.">
        <Demo name="Orbit">Click an icon, or wait: autoPlay moves on every 3s (it waits while you hover it)</Demo>
        <div className="w-100" style={{ maxWidth: '40rem', justifySelf: 'center' }}>
        <Orbit items={[
          { icon: <Icon name="palette" />, title: 'Design', text: 'Colors, type and shape from one set of settings.' },
          { icon: <Icon name="code" />, title: 'Build', text: 'Components composed from grid and utility classes.' },
          { icon: <Icon name="flask" />, title: 'Test', text: 'Every change checked in the browser, in light and dark mode.' },
          { icon: <Icon name="rocket" />, title: 'Ship', text: 'Fast pages that work in light and dark mode.' },
          { icon: <Icon name="seedling" />, title: 'Grow', text: 'Small parts that swap easily as the site grows.' },
          { icon: <Icon name="heart" />, title: 'Care', text: 'Accessible names, focus rings and reduced motion.' },
        ]} />
        </div>
        <Demo name="Many items">16 items size themselves to fit the ring</Demo>
        <div className="w-100" style={{ maxWidth: '24rem', justifySelf: 'center' }}>
          <Orbit autoPlay interval={1500} items={['sun', 'moon', 'star', 'cloud', 'bolt', 'snowflake', 'leaf', 'fire',
            'water', 'wind', 'mountain', 'tree', 'seedling', 'feather', 'gem', 'heart'].map(n => ({ icon: <Icon name={n} />, title: n, text: `The ${n} icon.` }))} />
        </div>
        <Demo name="OrbitClock">Three synced Orbits, each pointer a hand: hours (numbered, ticks hourly), minutes and seconds (bare rings)</Demo>
        <div className="w-100" style={{ maxWidth: '24rem', justifySelf: 'center' }}><OrbitClock /></div>
      </Section>

      <Section name="Solar system">
        <Demo name="SolarSystem">The planets circle the Sun, Mercury once every 5s and the rest slower (not to scale)</Demo>
        <SolarSystem className="w-100" style={{ maxWidth: '40rem', justifySelf: 'center' }} />
      </Section>

      <Section name="Layouts" intro="components/widgets/layout.js: honeycombs, a timeline and pricing tickets.">
        <Demo name="HexWall">A team wall: hover or focus a hexagon to turn it over</Demo>
        <HexWall perRow={4} className="w-100" style={{ maxWidth: '30rem', justifySelf: 'center' }} people={[
          { name: 'Ada', role: 'Engineer', icon: 'code' }, { name: 'Grace', role: 'Admiral', icon: 'anchor' },
          { name: 'Alan', role: 'Mathematician', icon: 'square-root-variable' }, { name: 'Hedy', role: 'Inventor', icon: 'wifi' },
          { name: 'Linus', role: 'Kernel', icon: 'terminal' }, { name: 'Margaret', role: 'Apollo', icon: 'rocket' },
          { name: 'Tim', role: 'The web', icon: 'globe' }, { name: 'Katherine', role: 'Orbits', icon: 'satellite' },
          { name: 'Dennis', role: 'C and Unix', icon: 'microchip' }, { name: 'Barbara', role: 'Languages', icon: 'language' },
        ]} />
        <Demo name="Timeline">Hexagon markers on a gradient line, each card pointing at its marker</Demo>
        <Timeline className="w-100" style={{ maxWidth: '36rem', justifySelf: 'center' }} events={[
          { date: '2019', title: 'First site', text: 'A plain page with a contact form.', icon: 'seedling' },
          { date: '2021', title: 'Apps', text: 'Games, weather and a stock lookup joined in.', icon: 'gamepad' },
          { date: '2024', title: 'Themes', text: 'Colors, light and dark, and design themes.', icon: 'palette' },
          { date: '2026', title: 'Design system', text: 'Shapes, widgets and one set of building blocks.', icon: 'shapes' },
        ]} />
        <Demo name="Bento">Tiles of mixed sizes on one grid (span-2 and a two-row span), each holding a small widget</Demo>
        <div className="grid gap-sm" style={{ '--cols': 4, '--min': '10rem', gridAutoRows: 'minmax(8rem, auto)' }}>
          <div className="bg border round pad span-2 col-center" style={{ gridRow: 'span 2' }}><AnalogClock className="w-100" style={{ maxWidth: '14rem' }} /></div>
          <div className="bg-gradient round pad col-center text-center"><span className="display fw-bold">42</span><small>Projects</small></div>
          <div className="bg border round pad col-center"><RingGauge value={72} label="Done" size="7rem" /></div>
          <div className="bg border round pad col-center"><ShapeLoader kind="hive" size="4rem" /></div>
          <div className="bg-primary round pad col-center text-center"><Icon name="cloud-sun" className="display-sm" /><small>21° and sunny</small></div>
          <div className="bg border round pad span-2 col-center"><FlipClock size="2rem" /></div>
          <div className="bg border round pad col-center"><Atom className="w-100" style={{ maxWidth: '8rem' }} /></div>
          <div className="bg-secondary round pad col-center text-center"><ShapeLoader kind="morph" size="3rem" /><small>Loading…</small></div>
        </div>
        <Demo name="Cards">TicketCard: a label, a big title and an action above the tear line, a list below, an optional ribbon (a plan, a pass, a feature…)</Demo>
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '14rem' }}>
          <TicketCard label="Pro plan" title="$9" note="a month" ribbon="Popular" items={['Ten sites', 'Every theme', 'Shapes and widgets', 'Email help']}
            action={<Button icon="arrow-right" className="primary w-100">Go pro</Button>} />
          <TicketCard label="Oct 24 · 7 PM" title="Dev Night" note="Boise" ribbon="Few left"
            items={[ { icon: 'location-dot', text: 'The Forge, 2nd floor' }, { icon: 'ticket', text: 'General admission' }, { icon: 'pizza-slice', text: 'Food included' } ]}
            action={<Button icon="ticket" className="outline-primary w-100">Get a ticket</Button>} />
          <TicketCard label="New" title="Shapes" note="40 classes"
            items={[ { icon: 'shapes', text: 'One class each' }, { icon: 'hand-pointer', text: 'Hovers made for them' }, { icon: 'border-all', text: 'Honeycomb layouts' } ]}
            action={<Button icon="arrow-right" href="/shapes" className="outline-secondary w-100">See them</Button>} />
        </div>
        <Demo name="StatCard">Numbers in a .bg-gradient-run grid: one gradient running through all the cards</Demo>
        <div className="grid fixed cols-4 gap-lg bg-gradient-run">
          <StatCard icon="rocket" value="42" label="Projects shipped" /><StatCard icon="code-branch" value="1.2k" label="Commits" />
          <StatCard icon="star" value="4.9" label="Rating" /><StatCard icon="users" value="18" label="Clients" />
        </div>
      </Section>

      <Section name="Navigation" intro="components/widgets/nav.js: a radial menu, a step bar and tabs.">
        <Demo name="RadialMenu">A speed dial: the button fans its items out round itself (Esc closes it)</Demo>
        <div className="col-center"><RadialMenuDemo /></div>
        <Demo name="StepBar">Chevrons nested into one bar: done, current and to come; click a step</Demo>
        <StepBar steps={['Cart', 'Shipping', 'Payment', 'Review', 'Done']} start={2} />
        <Demo name="TabBar">The gradient bar slides under the picked tab; arrow keys move between tabs</Demo>
        <TabBar tabs={[
          { label: 'Overview', icon: 'eye', content: <p>One set of building blocks, every page in the same theme.</p> },
          { label: 'Shapes', icon: 'shapes', content: <p>Forty shapes, each one class, with hovers made for them.</p> },
          { label: 'Widgets', icon: 'puzzle-piece', content: <p>Bigger pieces composed from the small ones.</p> },
        ]} />
      </Section>

      <Section name="Data" intro="components/widgets/data.js: gauges and a radar chart, drawn with gradients and clip-paths.">
        <Demo name="RingGauge">Fills clockwise in the theme gradient and counts up</Demo>
        <div className="grid gap-sm justify-center" style={{ '--cols': 4, '--min': '8rem' }}>
          <RingGauge value={92} label="Design" /><RingGauge value={78} label="Code" /><RingGauge value={64} label="Tests" /><RingGauge value={45} label="Docs" />
        </div>
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '16rem' }}>
          <div className="grid cols-1 gap-sm">
            <Demo name="Radar">Values on six axes; shuffle and the shape morphs</Demo>
            <RadarDemo />
          </div>
          <div className="grid cols-1 gap-sm">
            <Demo name="Speedometer">A half dial with ticks; the needle swings to the value</Demo>
            <div className="col-center"><SpeedometerDemo /></div>
          </div>
        </div>
      </Section>

      <Section name="Calendar" intro="components/widgets/calendar.js: every date worked out by dayjs and its plugins (locale names, week numbers, ranges, limits, relative dates, day of the year, leap years).">
        <div className="row-wrap gap-lg items-start">
          <div className="grid cols-1 gap-sm content-start" style={{ width: '22rem', maxWidth: '100%' }}>
            <Demo name="Calendar">Pick a day: its details and events show below. Click the title for the year, then the decade; arrows, Page Up / Down, Home / End and Enter work too</Demo>
            <CalendarDemo />
          </div>
          <div className="grid cols-1 gap-sm content-start" style={{ width: '22rem', maxWidth: '100%' }}>
            <Demo name="Range">mode=&quot;range&quot;: a start and an end (hover previews), weeks from Monday with ISO week numbers, nothing before today</Demo>
            <RangeCalendarDemo />
          </div>
          <div className="grid cols-1 gap-sm content-start" style={{ width: '22rem', maxWidth: '100%' }}>
            <Demo name="Scheduler">Four openings a day from 8 to 5, lunch (12 to 1) blocked out; booked and past ones are disabled, and a day with none left can&apos;t be picked</Demo>
            <SchedulerDemo />
          </div>
        </div>
      </Section>

      <Section name="Showcase" intro="components/widgets/fun.js: an atom, two clocks, loaders and a fan of cards.">
        <div className="grid gap-lg items-center" style={{ '--cols': 3, '--min': '14rem' }}>
          <div className="grid cols-1 gap-sm">
            <Demo name="Atom">Three tilted orbits; hover to pause</Demo>
            <Atom className="w-100" style={{ maxWidth: '16rem', justifySelf: 'center' }} />
          </div>
          <div className="grid cols-1 gap-sm">
            <Demo name="AnalogClock">A squircle face; the hands tick to your time</Demo>
            <AnalogClock className="w-100" style={{ maxWidth: '16rem', justifySelf: 'center' }} />
          </div>
          <div className="grid cols-1 gap-sm">
            <Demo name="CardFan">Hover or focus to fan the cards out</Demo>
            <CardFan cards={[
              { title: 'Shapes', icon: <Icon name="shapes" className="fs-lg" />, className: 'bg-primary' },
              { title: 'Theme', icon: <Icon name="palette" className="fs-lg" />, className: 'bg-secondary' },
              { title: 'Widgets', icon: <Icon name="puzzle-piece" className="fs-lg" />, className: 'bg-gradient' },
              { title: 'Apps', icon: <Icon name="rocket" className="fs-lg" />, className: 'bg-gradient-darker' },
            ]} />
          </div>
        </div>
        <Demo name="FlipClock">Your time in gooey digits, each folding into the next</Demo>
        <FlipClock size="3.5rem" />
        <Demo name="ShapeLoader">Loading signs from shapes: spin, morph and hive</Demo>
        <div className="grid fixed cols-3 justify-center">
          <ShapeLoader kind="spin" /><ShapeLoader kind="morph" /><ShapeLoader kind="hive" />
        </div>
      </Section>

      <Section name="Parallax">
        <Demo name="Parallax">Scroll the page</Demo>
        <div className="stack round border" style={{ height: '10rem' }}>
          <div className="bg-gradient-lighter" />
          <Parallax speed={0.25} className="col-center"><span className="display-sm fw-bold">Parallax</span></Parallax>
        </div>
      </Section>
    </div>
  );
}

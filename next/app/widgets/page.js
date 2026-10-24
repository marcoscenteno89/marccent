import { Icon } from 'marccent-theme/components/ui/icon';
import { Orbit, OrbitClock, SolarSystem } from 'marccent-theme/components/visuals/effects';
import { HexWall, Timeline } from 'marccent-theme/components/widgets/layout';
import { StepBar, TabBar } from 'marccent-theme/components/widgets/nav';
import { RingGauge } from '@/components/widgets/data';
import { Atom, AnalogClock, FlipClock, ShapeLoader, CardFan } from '@/components/widgets/fun';
import { RadialMenuDemo, RadarDemo, SpeedometerDemo, CalendarDemo, RangeCalendarDemo, SchedulerDemo } from './demos';
import { GalleryHeader, Section, Collage, Tile } from '@/components/gallery';
import { CardCarousel } from '@/components/widgets/card-carousel';
import 'marccent-theme/styles/components/loading.css';

/*
 * Widgets gallery: the bigger pieces composed from the building blocks (visuals/effects.js and friends), in the
 * active theme. All hold still for visitors who ask for reduced motion.
 */

export const metadata = { title: 'Widgets' };

const SECTIONS = ['Orbits', 'Layouts', 'Navigation', 'Data', 'Calendar', 'Showcase'];

export default function WidgetsPage() {
  return (
    <div className="wrap grid cols-1 gap-lg">
      <GalleryHeader title="Widgets" sections={SECTIONS}>
        <p>Bigger pieces built from the theme&apos;s building blocks: orbits, honeycombs, a timeline, menus, gauges, clocks and loaders, each section a collage. The parallax scenes have their own page.</p>
      </GalleryHeader>

      <Section name="Orbits" intro="Everything that turns on a ring: Orbit, OrbitClock and SolarSystem (visuals/effects.js) and Atom (widgets/fun.js).">
        <Collage>
          <Tile name="Orbit" text="Click an icon, or wait: autoPlay moves on every 3s (it waits while you hover it)" size="big">
            <Orbit items={[
              { icon: <Icon name="palette" />, title: 'Design', text: 'Colors, type and shape from one set of settings.' },
              { icon: <Icon name="code" />, title: 'Build', text: 'Components composed from grid and utility classes.' },
              { icon: <Icon name="flask" />, title: 'Test', text: 'Every change checked in the browser, in light and dark mode.' },
              { icon: <Icon name="rocket" />, title: 'Ship', text: 'Fast pages that work in light and dark mode.' },
              { icon: <Icon name="seedling" />, title: 'Grow', text: 'Small parts that swap easily as the site grows.' },
              { icon: <Icon name="heart" />, title: 'Care', text: 'Accessible names, focus rings and reduced motion.' },
            ]} />
          </Tile>
          <Tile name="OrbitClock" text="Three synced Orbits, each pointer a hand: hours, minutes and seconds" size="big">
            <OrbitClock />
          </Tile>
          <Tile name="Many items" text="16 items size themselves to fit the ring" size="big">
            <Orbit autoPlay interval={1500} items={['sun', 'moon', 'star', 'cloud', 'bolt', 'snowflake', 'leaf', 'fire',
              'water', 'wind', 'mountain', 'tree', 'seedling', 'feather', 'gem', 'heart'].map(n => ({ icon: <Icon name={n} />, title: n, text: `The ${n} icon.` }))} />
          </Tile>
          <Tile name="SolarSystem" text="Mercury circles the Sun once every 5s, the rest slower (not to scale)" size="wide">
            <SolarSystem className="w-100" style={{ maxWidth: '16rem', justifySelf: 'center' }} />
          </Tile>
          <Tile name="Atom" text="Three tilted orbits; hover to pause" size="wide">
            <Atom className="w-100" style={{ maxWidth: '10rem', justifySelf: 'center' }} />
          </Tile>
        </Collage>
      </Section>

      <Section name="Layouts" intro="components/widgets/layout.js: honeycombs, a timeline and a carousel of cards.">
        <Collage>
          <Tile name="HexWall" text="A team wall: hover or focus a hexagon to turn it over" size="big">
            <HexWall perRow={4} className="w-100" style={{ maxWidth: '26rem', justifySelf: 'center' }} people={[
              { name: 'Ada', role: 'Engineer', icon: 'code' }, { name: 'Grace', role: 'Admiral', icon: 'anchor' },
              { name: 'Alan', role: 'Mathematician', icon: 'square-root-variable' }, { name: 'Hedy', role: 'Inventor', icon: 'wifi' },
              { name: 'Linus', role: 'Kernel', icon: 'terminal' }, { name: 'Margaret', role: 'Apollo', icon: 'rocket' },
              { name: 'Tim', role: 'The web', icon: 'globe' }, { name: 'Katherine', role: 'Orbits', icon: 'satellite' },
              { name: 'Dennis', role: 'C and Unix', icon: 'microchip' }, { name: 'Barbara', role: 'Languages', icon: 'language' },
            ]} />
          </Tile>
          <Tile name="Timeline" text="Hexagon markers on a gradient line, each card pointing at its marker" size="big">
            <Timeline events={[
              { date: '2019', title: 'First site', text: 'A plain page with a contact form.', icon: 'seedling' },
              { date: '2021', title: 'Apps', text: 'Games, weather and a stock lookup joined in.', icon: 'gamepad' },
              { date: '2024', title: 'Themes', text: 'Colors, light and dark, and design themes.', icon: 'palette' },
              { date: '2026', title: 'Design system', text: 'Shapes, widgets and one set of building blocks.', icon: 'shapes' },
            ]} />
          </Tile>
          <Tile name="Cards" text="Twenty-one cards in a Carousel (swipe, the arrows or the keyboard), each a different mix of the theme&apos;s classes" size="full">
            <CardCarousel />
          </Tile>
        </Collage>
      </Section>

      <Section name="Navigation" intro="components/widgets/nav.js: a radial menu, a step bar and tabs.">
        <Collage>
          <Tile name="RadialMenu" text="A speed dial: the button fans its items out round itself (Esc closes it)" size="tall">
            <div className="col-center"><RadialMenuDemo /></div>
          </Tile>
          <Tile name="StepBar" text="Chevrons nested into one bar: done, current and to come; click a step" size="wider">
            <StepBar steps={['Cart', 'Shipping', 'Payment', 'Review', 'Done']} start={2} />
          </Tile>
          <Tile name="TabBar" text="The gradient bar slides under the picked tab; arrow keys move between tabs" size="wider">
            <TabBar tabs={[
              { label: 'Overview', icon: 'eye', content: <p>One set of building blocks, every page in the same theme.</p> },
              { label: 'Shapes', icon: 'shapes', content: <p>Forty shapes, each one class, with hovers made for them.</p> },
              { label: 'Widgets', icon: 'puzzle-piece', content: <p>Bigger pieces composed from the small ones.</p> },
            ]} />
          </Tile>
        </Collage>
      </Section>

      <Section name="Data" intro="components/widgets/data.js: gauges and a radar chart, drawn with gradients and clip-paths.">
        <Collage>
          {[ [ 92, 'Design' ], [ 78, 'Code' ], [ 64, 'Tests' ], [ 45, 'Docs' ] ].map(([ value, label ]) => (
            <Tile key={label} name={`RingGauge · ${label}`} text="Fills clockwise in the theme gradient and counts up">
              <div className="col-center"><RingGauge value={value} label={label} /></div>
            </Tile>
          ))}
          <Tile name="Radar" text="Values on six axes; shuffle and the shape morphs" size="big">
            <RadarDemo />
          </Tile>
          <Tile name="Speedometer" text="A half dial with ticks; the needle swings to the value" size="big">
            <div className="col-center"><SpeedometerDemo /></div>
          </Tile>
        </Collage>
      </Section>

      <Section name="Calendar" intro="components/widgets/calendar.js: every date worked out by dayjs and its plugins (locale names, week numbers, ranges, limits, relative dates, day of the year, leap years).">
        <Collage cols={3} min="20rem">
          <Tile name="Calendar" text="Pick a day: its details and events show below. Click the title for the year, then the decade; arrows, Page Up / Down, Home / End and Enter work too">
            <CalendarDemo />
          </Tile>
          <Tile name="Range" text="mode=&quot;range&quot;: a start and an end (hover previews), weeks from Monday with ISO week numbers, nothing before today">
            <RangeCalendarDemo />
          </Tile>
          <Tile name="Scheduler" text="Four openings a day from 8 to 5, lunch (12 to 1) blocked out; booked and past ones are disabled, and a day with none left can&apos;t be picked">
            <SchedulerDemo />
          </Tile>
        </Collage>
      </Section>

      <Section name="Showcase" intro="components/widgets/fun.js: two clocks, loaders and a fan of cards.">
        <Collage>
          <Tile name="AnalogClock" text="A squircle face; the hands tick to your time" size="tall">
            <AnalogClock className="w-100" style={{ maxWidth: '12rem', justifySelf: 'center' }} />
          </Tile>
          <Tile name="CardFan" text="Hover or focus to fan the cards out" size="wide">
            <CardFan cards={[
              { title: 'Shapes', icon: <Icon name="shapes" className="fs-lg" />, className: 'bg-primary' },
              { title: 'Theme', icon: <Icon name="palette" className="fs-lg" />, className: 'bg-secondary' },
              { title: 'Widgets', icon: <Icon name="puzzle-piece" className="fs-lg" />, className: 'bg-gradient' },
              { title: 'Apps', icon: <Icon name="rocket" className="fs-lg" />, className: 'bg-gradient-darker' },
            ]} />
          </Tile>
          <Tile name="ShapeLoader" text="Loading signs from shapes: spin, morph and hive" size="tall">
            <div className="grid cols-1 gap-lg justify-center">
              <ShapeLoader kind="spin" size="3rem" /><ShapeLoader kind="morph" size="3rem" /><ShapeLoader kind="hive" size="3rem" />
            </div>
          </Tile>
          <Tile name="FlipClock" text="Your time in gooey digits, each folding into the next" size="wide">
            <FlipClock size="2.75rem" />
          </Tile>
        </Collage>
      </Section>
    </div>
  );
}

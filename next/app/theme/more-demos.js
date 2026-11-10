'use client';
import { Button } from 'marccent-theme/components/ui/button';
import { ExpandButton } from 'marccent-theme/components/ui/expand-button';
import { FileDrop } from 'marccent-theme/components/ui/file-drop';
import { TagInput } from 'marccent-theme/components/ui/tag-input';
import { Rating, Stars } from 'marccent-theme/components/ui/rating';
import { Tooltip, LinkPreview, Popover } from 'marccent-theme/components/ui/popover';
import { DataTable } from 'marccent-theme/components/ui/data-table';
import { Compare } from 'marccent-theme/components/ui/compare';
import { Menu } from 'marccent-theme/components/ui/menu';
import { useState } from 'react';
import { Blur } from 'marccent-theme/components/ui/blur';
import { CodeTabs } from 'marccent-theme/components/ui/code-tabs';
import { Drawer } from 'marccent-theme/components/ui/modal';
import { Dock } from 'marccent-theme/components/widgets/nav';
import { Section, Grid } from 'marccent-theme/components/widgets/section';
import { MapView } from 'marccent-theme/components/widgets/map';
import { Demo, Row } from '@/components/gallery';
import { img } from '@/lib/img';

/*
 * The theme components the Theme page didn't show yet, one group per section it joins: form fields (FileDrop,
 * TagInput, Rating), floating boxes (Tooltip, LinkPreview, Popover), ExpandButton, data (DataTable, Stars, Compare)
 * the Footer pattern, and the rest every component needs a demo of (PRODUCT-LINE.md 3.6: Blur, CodeTabs, Divider,
 * Dock, Drawer, Grid, Map). Client side: DataTable's columns hold functions.
 */

const CITIES = [ 'Boise', 'Reno', 'Austin', 'Denver' ];
const TEAM = [ 'Ana', 'Ben', 'Cy', 'Dee', 'Eli', 'Fay', 'Gus', 'Hal', 'Ivy', 'Jo', 'Kai', 'Lu' ].map((name, i) => ({
  id: name,
  name,
  role: [ 'Design', 'Build', 'Test' ][i % 3],
  city: CITIES[i % 4],
  score: 60 + ((i * 17) % 40),
}));

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'city', label: 'City' },
  { key: 'score', label: 'Score', align: 'end', render: (row) => <strong>{row.score}</strong> },
];

// Buttons: an icon that opens into a control, or a toggle with a panel when its row has no room.
const ButtonDemos = () => (
  <Row label="ExpandButton" note="An icon button that opens into its control on hover or focus; in a row with no room (or below 40rem) it becomes a toggle with a panel">
    <ExpandButton icon="swatchbook" label="Design style" className="primary">
      <select aria-label="Design style" defaultValue="modern">
        {[ 'modern', 'minimal', 'retro', 'terminal' ].map(s => <option key={s}>{s}</option>)}
      </select>
    </ExpandButton>
    <ExpandButton icon="sliders" label="Volume" className="outline-primary">
      <input type="range" aria-label="Volume" defaultValue={60} />
    </ExpandButton>
  </Row>
);

// Forms: fields that are more than an input. Each keeps a real input, so a plain form post sends its value.
const FormDemos = () => (
  <>
    <Demo name="FileDrop">Drag files onto it or click it; images get a preview, and files over 5 MB or not images are left out with the reason</Demo>
    <FileDrop name="photos" accept="image/*" multiple maxSize={5e6} hint="Images up to 5 MB" />
    <Demo name="TagInput">Enter or a comma adds a tag, Backspace removes the last; suggestions as you type, up to 6</Demo>
    <TagInput name="skills" defaultValue={[ 'CSS', 'React' ]} suggestions={[ 'Django', 'Python', 'Next.js', 'Canvas' ]} max={6} />
    <Demo name="Rating">Radio buttons under the stars: arrow keys work and a form post sends the score</Demo>
    <div className="grid cols-1 gap-sm">
      <Rating name="talk" label="Rate the talk" defaultValue={4} />
      <Rating name="love" label="How much" icon="heart" max={3} />
    </div>
  </>
);

// Overlays: native popovers placed beside their trigger, in the top layer so nothing clips them.
const OverlayDemos = () => (
  <>
    <Row label="Tooltip" note="On hover or keyboard focus; Esc hides it. It goes to the other side when there's no room">
      {[ 'top', 'right', 'bottom', 'left' ].map(side => (
        <Tooltip key={side} side={side} content={`On the ${side}`}>
          <Button icon="circle-info" className="outline-primary">{side}</Button>
        </Tooltip>
      ))}
    </Row>
    <Demo name="LinkPreview">A card about where a link goes, while it&apos;s hovered or focused</Demo>
    {/* A div, not a p: the card is a div, which a paragraph can't hold. */}
    <div>
      The theme ships as{' '}
      <LinkPreview title="marccent-theme" text="CSS, a plain-JS engine, a React kit and canvas animations." image={img('blue1')}>
        <a href="https://github.com/marcoscenteno89/marccent-theme" className="hover-underline">its own package</a>
      </LinkPreview>
      , so other sites can use it.
    </div>
    <Row label="Popover" note="A panel a button opens; a click outside, Esc or the button again closes it">
      <Popover label="Filters" content={
        <div className="grid cols-1 gap-sm">
          {[ 'Design', 'Build', 'Test' ].map(n => <label key={n}><input type="checkbox" defaultChecked /> {n}</label>)}
        </div>
      }>
        <Button icon="filter" className="primary">Filters</Button>
      </Popover>
      <Popover label="Share" side="right" content={<p>Copy the link or send it on.</p>}>
        <Button icon="share-nodes" className="outline-primary">Share</Button>
      </Popover>
    </Row>
  </>
);

// Data display: a table to sort, filter and page, a score to read, and a before / after slider.
const DataDemos = () => (
  <>
    <Demo name="DataTable">Click a header to sort (again to reverse, a third time to reset); type to filter</Demo>
    <DataTable label="Team" rows={TEAM} columns={COLUMNS} pageSize={5} />
    <Demo name="Stars">A score to read, fractions included: 3.5 out of 5</Demo>
    <Stars value={3.5} />
    <Demo name="Compare">Drag the handle, or focus it and use the arrow keys</Demo>
    <div style={{ aspectRatio: '16 / 7' }}>
      <Compare className="round h-100"
        before={<img src={img('blue1')} alt="The photo in black and white" style={{ filter: 'grayscale(1)' }} />}
        after={<img src={img('blue1')} alt="The photo in color" />} />
    </div>
  </>
);

// Layout: the Footer pattern (marccent-theme PATTERNS.md), built from Menu and the grid classes: no component, so a
// site arranges it its own way (its own id: the page already has the site's footer).
const columns = [
  { name: 'Design', children: [ { name: 'Theme', href: '#colors' }, { name: 'Shapes', href: '/shapes' }, { name: 'Widgets', href: '/widgets' } ] },
  { name: 'More', children: [ { name: 'About', href: '/about' }, { name: 'Docs', href: '/docs' } ] },
];
const LayoutDemos = () => (
  <>
    <Demo name="Footer pattern">Brand, link columns, a legal row and social icons, each part a Menu; one column on phones</Demo>
    <footer id="footer-demo" data-component="footer" className="wrap wrap-fluid pad-y-lg grid cols-1 gap-lg bg border round pad">
      <div className="wrap pad-0 grid layout-1-2 gap-lg">
        <div className="grid cols-1 gap-sm content-start">
          <strong className="text-gradient fs-lg">Marccent</strong>
          <p className="opacity-75">Themes, animations and tools, made in Idaho.</p>
        </div>
        <div className="grid gap-lg" style={{ '--min': '10rem', '--cols': columns.length }}>
          {columns.map((column) => (
            <div key={column.name} className="grid cols-1 gap-sm content-start">
              <h2 className="h6">{column.name}</h2>
              <Menu items={column.children} label={column.name} layout="cols-1" gap="gap-0" style={{ '--cols': 1 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="wrap pad-0 border-top pad-y grid layout-ends items-center gap-sm" style={{ '--start': 2 }}>
        <div className="fs-sm opacity-75"><small>© 2026 Marccent</small></div>
        <Menu items={[ { name: 'Privacy', href: '/privacy-policy' } ]} label="Footer legal" layout="auto-cols" className="fs-sm" />
        <Menu items={[ { name: 'GitHub', href: 'https://github.com/marcoscenteno89', icon: 'fa-brands fa-github' } ]} label="Footer social" iconOnly layout="auto-cols" className="col-last" />
      </div>
    </footer>
  </>
);


// The rest: every theme component shown here too (PRODUCT-LINE.md 3.6), each as a site would use it.
const MoreComponentDemos = () => {
  const [ code, setCode ] = useState({ html: '<p class="text-gradient">Hello</p>', css: 'p { font-size: 2rem; }', js: '' });
  const [ drawer, setDrawer ] = useState(false);
  return (
    <>
      <Demo name="Grid">The theme&apos;s .grid as a component: equal columns that wrap, or dense with a minimum row height (a collage)</Demo>
      <Grid cols={4} min="7rem" dense row="5rem">
        <div className="bg-gradient round pad span-2 row-span-2">Big</div>
        {[ 1, 2, 3, 4 ].map((n) => <div key={n} className="bg border round pad">{n}</div>)}
      </Grid>
      <Demo name="Divider">A shape on a section&apos;s edge, in the band&apos;s color (Section&apos;s dividerTop and dividerBottom)</Demo>
      {/* The shapes reach out of the band (into the sections around it on a page), so room for them here. */}
      <div style={{ paddingBlock: '4.5rem' }}>
        <Section surface="bg-primary" padY="pad-y" dividerTop={{ shape: 'wave', motion: 'roll' }} dividerBottom={{ shape: 'mountains', size: 'sm' }}>
          <p className="text-center">A band with a rolling wave on top and mountains below</p>
        </Section>
      </div>
      <Demo name="Dock">Icon links that swell as the pointer nears, their names as tooltips</Demo>
      <Dock label="Demo dock" items={[ { icon: 'house', label: 'Home', href: '/' }, { icon: 'palette', label: 'Theme', href: '/theme' }, { icon: 'shapes', label: 'Shapes', href: '/shapes' }, { icon: 'fa-brands fa-github', label: 'GitHub', href: 'https://github.com/marcoscenteno89', external: true } ]} />
      <Demo name="Drawer">A panel from the side of the screen; Esc, the close button or a click outside closes it</Demo>
      <Button icon="filter" className="secondary" onClick={() => setDrawer(true)}>Open the drawer</Button>
      <Drawer title="Filters" show={drawer} setShow={setDrawer} side="end"><p>Status, priority, owner…</p></Drawer>
      <Demo name="CodeTabs">One editor per language under tabs; their code is one value</Demo>
      <CodeTabs value={code} onChange={setCode} langs={[ 'html', 'css' ]} />
      <Demo name="Blur">An SVG goo filter: shapes that touch merge (filter: url(#…) on their box)</Demo>
      <div className="grid auto-cols gap-0" style={{ filter: 'url(#demo-goo)', justifyContent: 'center' }}>
        <Blur id="demo-goo" />
        {[ 0, 1, 2 ].map((i) => <div key={i} className="circle bg-gradient" style={{ width: '4rem', aspectRatio: 1, marginInline: '-.6rem' }} />)}
      </div>
      <Demo name="Map">Google&apos;s map in the theme&apos;s colors; without a key, Google&apos;s embed (here)</Demo>
      <div style={{ height: '16rem' }}><MapView center={{ lat: 43.4917, lng: -112.0339 }} zoom={11} title="Idaho Falls" embed="https://www.google.com/maps?q=Idaho+Falls,+ID&output=embed" /></div>
    </>
  );
};

export { ButtonDemos, FormDemos, OverlayDemos, DataDemos, LayoutDemos, MoreComponentDemos };

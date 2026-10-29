'use client';
import { Button } from 'marccent-theme/components/ui/button';
import { ExpandButton } from 'marccent-theme/components/ui/expand-button';
import { FileDrop } from 'marccent-theme/components/ui/file-drop';
import { TagInput } from 'marccent-theme/components/ui/tag-input';
import { Rating, Stars } from 'marccent-theme/components/ui/rating';
import { Tooltip, LinkPreview, Popover } from 'marccent-theme/components/ui/popover';
import { DataTable } from 'marccent-theme/components/ui/data-table';
import { Compare } from 'marccent-theme/components/ui/compare';
import { Footer } from 'marccent-theme/components/widgets/footer';
import { Demo, Row } from '@/components/gallery';
import { img } from '@/lib/img';

/*
 * The theme components the Theme page didn't show yet, one group per section it joins: form fields (FileDrop,
 * TagInput, Rating), floating boxes (Tooltip, LinkPreview, Popover), ExpandButton, data (DataTable, Stars, Compare)
 * and the Footer. Client side: DataTable's columns hold functions.
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

// Layout: a site footer from the same items as its menus (its own id: the page already has the site's footer).
const LayoutDemos = () => (
  <>
    <Demo name="Footer">Brand, link columns, a legal row and social icons, all from Menu items; one column on phones</Demo>
    <Footer id="footer-demo" className="bg border round pad"
      brand={<strong className="text-gradient fs-lg">Marccent</strong>}
      about="Themes, animations and tools, made in Idaho."
      columns={[
        { name: 'Design', children: [ { name: 'Theme', href: '#colors' }, { name: 'Shapes', href: '/shapes' }, { name: 'Widgets', href: '/widgets' } ] },
        { name: 'More', children: [ { name: 'About', href: '/about' }, { name: 'Docs', href: '/docs' } ] },
      ]}
      social={[ { name: 'GitHub', href: 'https://github.com/marcoscenteno89', icon: 'fa-brands fa-github' } ]}
      legal={<small>© 2026 Marccent</small>}
      legalLinks={[ { name: 'Privacy', href: '/privacy-policy' } ]} />
  </>
);

export { ButtonDemos, FormDemos, OverlayDemos, DataDemos, LayoutDemos };

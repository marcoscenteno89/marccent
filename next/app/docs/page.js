import { Button } from 'marccent-theme/components/ui/button';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Alert } from 'marccent-theme/components/ui/alert';
import { Accordion, AccordionItem } from 'marccent-theme/components/ui/accordion';
import { GalleryHeader, Section, Demo } from '@/components/gallery';
import { Code } from 'marccent-theme/components/ui/code';

/*
 * Docs: how to use marccent-theme. Install and set up, then the classes (layout, utilities, colors), the design styles,
 * the theme engine, the UI kit and the canvas animations, each with its code and, where it fits, a live example.
 */

export const metadata = { title: 'Docs' };

const SECTIONS = ['Install', 'Set up', 'Layout', 'Utilities', 'Colors', 'Design styles', 'Theme engine', 'UI kit', 'Animations', 'Variables'];

// One example: its name and what it shows, the live result, then the code (side by side when there is room).
const Example = ({ name, text, code, children }) => (
  <div data-component="docs-example" data-name={name} className="grid cols-1 gap-sm">
    <Demo name={name}>{text}</Demo>
    <div className="grid cols-2 gap-sm items-start" style={{ '--min': '18rem' }}>
      {children && <div className="border round pad-sm">{children}</div>}
      <Code>{code}</Code>
    </div>
  </div>
);

// A filled box for the layout examples.
const Box = ({ children, className = 'bg-primary' }) => <div className={`${className} round pad-sm text-center`}>{children}</div>;

// A list of names and what they do, lined up on .pairs.
const Terms = ({ items }) => (
  <dl className="grid pairs gap-sm">
    {items.map(([term, text]) => (
      <div key={term} className="sub-x gap-sm">
        <dt><code className="text-primary">{term}</code></dt>
        <dd style={{ margin: 0 }}>{text}</dd>
      </div>
    ))}
  </dl>
);

export default function DocsPage() {
  return (
    <>
    <GalleryHeader title="Docs" sections={SECTIONS}>
      <p>How to use <strong>marccent-theme</strong>: a CSS system built on grid, a live theme engine visitors can edit, a React UI kit and canvas animations. Every page on this site is built with it.</p>
    </GalleryHeader>
    <div data-component="docs-page" className="wrap grid cols-1 gap-lg pad-y-lg">

      <Section name="Install" intro="The package ships source (JSX and CSS imports), so Next compiles it. Needs next 14+, react and react-dom 18.">
        <Code lang="sh">{`
          npm install github:marcoscenteno89/marccent-theme
        `}</Code>
        <Code lang="js">{`
          // next.config.js
          module.exports = { transpilePackages: ['marccent-theme'] };
        `}</Code>
      </Section>

      <Section name="Set up" intro="Import the styles once and wrap the app in ThemeProvider with the page path. The starter colors come from lib/theme.defaults.json.">
        <Code>{`
          // app/theme-provider.js
          'use client';
          import Link from 'next/link';
          import { usePathname } from 'next/navigation';
          import { ThemeProvider } from 'marccent-theme/lib/context';

          export const SiteThemeProvider = ({ children }) => <ThemeProvider path={usePathname()} link={Link}>{children}</ThemeProvider>;
        `}</Code>
        <Code>{`
          // app/layout.js
          import 'marccent-theme/styles/index.css';
          import { Body, SiteTheme, ScopeThemes } from 'marccent-theme/components/theme/core';
          import { Toast } from 'marccent-theme/components/ui/toast';
          import { CanvasScanner } from 'marccent-theme/components/visuals/canvas-scanner';
          import { SiteThemeProvider } from './theme-provider';

          export default function RootLayout({ children }) {
            return (
              <html id="site" lang="en" data-design="modern" suppressHydrationWarning>
                <SiteThemeProvider>
                  <Body className="grid cols-1">
                    {children}
                    <Toast />
                    <SiteTheme />
                    <ScopeThemes />
                    <CanvasScanner />
                  </Body>
                </SiteThemeProvider>
              </html>
            );
          }
        `}</Code>
        <p>To slot your own styles in between the theme&apos;s (overrides after the defaults, custom styles after the layout), import the files listed in <code>styles/index.css</code> one by one, in the same order. Components load their own CSS when they render, in the <code>components</code> cascade layer.</p>
      </Section>

      <Section name="Layout" intro="Everything is a grid: no flex, no margins. Columns wrap on their own when a column would get narrower than --min; space between items comes from gap.">
        <Example name="grid cols-N" text="Up to N columns a row; they wrap when narrower than --min (14rem by default)."
          code={`
            <div className="grid cols-3 gap-sm">
              <div>1</div><div>2</div><div>3</div>
            </div>
          `}>
          <div className="grid cols-3 gap-sm"><Box>1</Box><Box>2</Box><Box>3</Box></div>
        </Example>
        <Example name="fixed" text="Exactly --cols a row at any width; the columns shrink instead of wrapping."
          code={`
            <div className="grid fixed cols-4 gap-sm">…</div>
          `}>
          <div className="grid fixed cols-4 gap-sm"><Box>1</Box><Box>2</Box><Box>3</Box><Box>4</Box></div>
        </Example>
        <Example name="auto-cols, row-wrap" text="auto-cols: one row, each column as wide as its content. row-wrap: content-sized items that wrap (buttons, tags)."
          code={`
            <div className="grid auto-cols gap-sm">…</div>
            <div className="row-wrap gap-sm">…</div>
          `}>
          <div className="grid cols-1 gap-sm">
            <div className="grid auto-cols gap-sm"><Box>Short</Box><Box>A longer one</Box><Box>Mid</Box></div>
            <div className="row-wrap gap-sm">{['Grid', 'Stack', 'Pairs', 'Subgrid', 'Spans', 'Wrap', 'Gap'].map(t => <Box key={t} className="bg-secondary">{t}</Box>)}</div>
          </div>
        </Example>
        <Example name="span-N, span-full" text="Span columns once the container is wide enough (container queries); span-full takes the whole row."
          code={`
            <div className="grid cols-4 gap-sm" style={{ '--min': '6rem' }}>
              <div className="span-2">span-2</div><div>…</div><div>…</div>
              <div className="span-full">span-full</div>
            </div>
          `}>
          <div className="grid cols-4 gap-sm" style={{ '--min': '6rem' }}>
            <Box className="bg-primary span-2">span-2</Box><Box>1</Box><Box>1</Box>
            <Box className="bg-secondary span-full">span-full</Box>
          </div>
        </Example>
        <Example name="layout-*" text="Uneven columns (2-1, 1-2, 3-1, 1-3, 1-2-1, 2-1-1, 1-1-2) once the container is 40rem wide; layout-ends puts items at both ends."
          code={`
            <div className="grid layout-2-1 gap-sm">
              <main>…</main><aside>…</aside>
            </div>
          `}>
          <div className="grid layout-2-1 gap-sm"><Box>2fr</Box><Box className="bg-secondary">1fr</Box></div>
        </Example>
        <Example name="stack" text="Every child in the same cell, later ones on top: overlays without position: absolute or z-index."
          code={`
            <div className="stack">
              <img src="…" />
              <div className="col-center">On top</div>
            </div>
          `}>
          <div className="stack round overflow-hidden" style={{ height: '6rem' }}>
            <div className="bg-gradient" />
            <div className="col-center fw-bold">On top</div>
          </div>
        </Example>
        <Example name="pairs" text="Rows of two parts, the first column as wide as the widest first part: form labels, terms, stats."
          code={`
            <dl className="grid pairs gap-sm">
              <div className="sub-x gap-sm"><dt>Name</dt><dd>Ada</dd></div>
              <div className="sub-x gap-sm"><dt>Occupation</dt><dd>Engineer</dd></div>
            </dl>
          `}>
          <dl className="grid pairs gap-sm">
            <div className="sub-x gap-sm"><dt className="fw-bold">Name</dt><dd style={{ margin: 0 }}>Ada</dd></div>
            <div className="sub-x gap-sm"><dt className="fw-bold">Occupation</dt><dd style={{ margin: 0 }}>Engineer</dd></div>
          </dl>
        </Example>
        <Demo name="The rest" />
        <Terms items={[
          ['wrap, wrap-sm, wrap-lg, wrap-fluid', 'A centered page column with side padding; a .wrap inside a .wrap doesn\'t pad again.'],
          ['gap-0, gap-sm, gap-lg, gap-y-*', 'Space between items; the base gap has no class.'],
          ['pad, pad-sm, pad-lg, pad-x-*, pad-y-*', 'Inner padding for boxes.'],
          ['sub rows-N, sub-x', 'Subgrids: children snap to the parent\'s rows (cards whose parts line up) or columns.'],
          ['center, col-center', 'Center children both ways, side by side or stacked.'],
          ['items-*, justify-*, self-*, content-start', 'Alignment of grid items.'],
          ['cols-center, col-last, order-*', 'Center the column tracks, last column, reorder.'],
          ['cq', 'A container for the container queries (.wrap already is one).'],
        ]} />
      </Section>

      <Section name="Utilities" intro="Single-purpose classes, loaded last so they beat a component's own rules.">
        <Example name="Shape and depth" text="round, circle, border, shadow-sm / shadow / shadow-lg / shadow-inset, square."
          code={`
            <div className="bg border round shadow pad-sm">round</div>
            <div className="bg-primary circle square">…</div>
          `}>
          <div className="grid fixed cols-3 gap-sm items-center">
            <div className="bg border round shadow pad-sm text-center">round</div>
            <div className="bg border shadow-lg pad-sm text-center">shadow-lg</div>
            <div className="bg-primary circle square" style={{ width: '3rem', justifySelf: 'center' }} />
          </div>
        </Example>
        <Example name="shape-*" text="Clip a box to one of 40+ shapes: hexagon, star, heart, ticket, blob, wave… (see the Shapes page)."
          code={`
            <div className="shape-hexagon bg-primary square" />
          `}>
          <div className="grid fixed cols-5 gap-sm items-center">
            {['hexagon', 'star', 'heart', 'diamond', 'blob'].map(s => <div key={s} className={`shape-${s} bg-gradient square`} title={s} />)}
          </div>
        </Example>
        <Demo name="The rest" />
        <Terms items={[
          ['fs-sm, fs-lg, fw-light / normal / bold', 'Font size and weight.'],
          ['text-start / center / end, text-uppercase, text-capitalize, text-truncate', 'Text alignment and case.'],
          ['opacity-25 / 50 / 75', 'Fade an element.'],
          ['w-100, w-50, h-100, vh-100', 'Sizes.'],
          ['position-relative / absolute / fixed, sticky-top, sticky-md-top', 'Positioning.'],
          ['overflow-auto, overflow-hidden, d-none, d-block, d-inline-block', 'Overflow and display.'],
        ]} />
      </Section>

      <Section name="Colors" intro="Five colors (primary, secondary, success, danger, info), each -lighter and -darker, plus the gradient. They follow the palette and light / dark mode the visitor picks.">
        <Example name="bg-*, text-*" text="Fills pick a readable text color on their own; bg is the page surface."
          code={`
            <div className="bg-primary">…</div>
            <span className="text-gradient">…</span>
          `}>
          <div className="grid cols-1 gap-sm">
            <div className="grid fixed cols-6 gap-sm" style={{ height: '3rem' }}>
              {['primary', 'secondary', 'success', 'danger', 'info', 'gradient'].map(c => <div key={c} className={`bg-${c} round`} title={`bg-${c}`} />)}
            </div>
            <span className="text-gradient fs-lg fw-bold">text-gradient</span>
          </div>
        </Example>
        <Example name="Buttons" text="A .btn takes a color class; outline-* for the outlined look."
          code={`
            <Button icon="check" className="bg-success">Save</Button>
            <Button icon="trash" className="outline-danger">Delete</Button>
          `}>
          <div className="row-wrap gap-sm">
            <Button icon="check" className="bg-success">Save</Button>
            <Button icon="trash" className="outline-danger">Delete</Button>
            <Button icon="circle-info" className="bg-info">Info</Button>
          </div>
        </Example>
        <Terms items={[
          ['glass', 'Frosted glass surface (when glass is on in the theme).'],
          ['divide', 'Lines between children (lists, accordions, button bars).'],
          ['bg-gradient-run', 'An animated gradient fill.'],
        ]} />
      </Section>

      <Section name="Design styles" intro="27 looks (modern, glassmorphism, brutalism, editorial, terminal, claymorphism…) that change type, shape, depth and effects over the site's own colors, without touching the markup.">
        <Code lang="html">{`
          <html data-design="brutalism"> <!-- "none" for the plain look -->
        `}</Code>
        <p>Visitors switch them with the theme editor. Each style is one file in <code>styles/themes/</code>; after adding or editing one, regenerate <code>styles/designs.css</code> and <code>lib/designs.gen.js</code>:</p>
        <Code lang="sh">{`
          npm run designs
        `}</Code>
      </Section>

      <Section name="Theme engine" intro="Palettes, light / dark mode, glass and design style, saved in the browser, for the whole site or for one element.">
        <Code>{`
          import { ThemeEditor } from 'marccent-theme/components/theme/editor';
          import { MiniThemeEditor } from 'marccent-theme/components/theme/mini-editor';

          <ThemeEditor scope="site" />              // the full editor, for the whole site
          <section id="pricing">
            <MiniThemeEditor scope="pricing" />     // one row of controls, for this section only
          </section>
        `}</Code>
        <Terms items={[
          ['scope', '"site", or the id of the element it themes. The element gets data-scope and its own palette, saved per page.'],
          ['ThemeProvider notify(msg, tone)', 'Where the theme\'s messages go; its toasts by default.'],
          ['ThemeProvider link', 'The router\'s link component (next/link) for the links Button, Menu and the Dock render; plain <a>s without it.'],
          ['ModeToggle, GlassToggle, RainbowToggle, ThemeReset', 'Single controls (components/theme/toggles.js).'],
          ['DesignSelect, DesignCards, PaletteCards, PaletteSwatches', 'Pickers for the design style and palette.'],
          ['withTheme, withThemeRead', 'Read the theme in a component (components/theme/hoc.js).'],
        ]} />
      </Section>

      <Section name="UI kit" intro="Each component imports its own CSS. Roots carry data-component, so devtools show where each one starts.">
        <Example name="Button, Icon" text="Icon on the left, label on the right; a link when given href. Icon-only buttons need an aria-label."
          code={`
            import { Button } from 'marccent-theme/components/ui/button';
            import { Icon } from 'marccent-theme/components/ui/icon';

            <Button icon="rocket" href="/apps">Apps</Button>
            <Button icon="xmark" aria-label="Close" />
            <Icon name="github" family="fa-brands" />
          `}>
          <div className="row-wrap gap-sm">
            <Button icon="rocket" href="/apps">Apps</Button>
            <Button icon="xmark" aria-label="Close" />
            <Icon name="github" family="fa-brands" className="fs-lg" />
          </div>
        </Example>
        <Example name="Alert" text="A message with role alert (danger) or status (the rest), so screen readers announce it."
          code={`
            <Alert tone="success">Saved.</Alert>
          `}>
          <Alert tone="success">Saved.</Alert>
        </Example>
        <Example name="Accordion" text="Built on details / summary; opening one closes the others unless multiple."
          code={`
            <Accordion defaultOpen={0}>
              <AccordionItem header="What is it?">A theme for Next.js.</AccordionItem>
              <AccordionItem header="Is it free?">Yes.</AccordionItem>
            </Accordion>
          `}>
          <Accordion defaultOpen={0}>
            <AccordionItem header="What is it?">A theme for Next.js.</AccordionItem>
            <AccordionItem header="Is it free?">Yes.</AccordionItem>
          </Accordion>
        </Example>
        <Example name="Toasts" text="Add one from anywhere; the Toast in the layout shows them."
          code={`
            import { toastSI } from 'marccent-theme/lib/toasts';

            toastSI.add('Saved', 'success');
          `} />
        <Example name="Form, Field" text="A native form: the browser validates. onSubmit gets { name: value }."
          code={`
            import { Form } from 'marccent-theme/components/ui/form';
            import { Field } from 'marccent-theme/components/ui/field';

            <Form onSubmit={(values) => send(values)} submitLabel="Send">
              <Field name="email" type="email" required />
              <Field name="message" as="textarea" />
            </Form>
          `} />
        <Example name="Modal" text="A native dialog: the browser draws the backdrop and keeps focus inside."
          code={`
            import { Modal } from 'marccent-theme/components/ui/modal';

            <Modal title="Hello" show={show} setShow={setShow}>…</Modal>
          `} />
        <Demo name="The rest" />
        <Terms items={[
          ['Menu', 'ui/menu.js: navigation from plain data; a child with children is a submenu, to any depth (flies out on wide screens, opens in place on narrow ones).'],
          ['NavBar', 'widgets/navbar.js: the header bar: brand, Menu, a toggle below 56rem, slots for end, last and a row on top; closes dropdowns after navigating, on an outside click and on Escape.'],
          ['Pagination', 'ui/pagination.js: total, pageSize, current, update.'],
          ['Loading', 'ui/loading.js: a loader (spinner, ring, dots, bars…) until every require value is truthy.'],
          ['ToggleButton', 'ui/toggle-button.js: two states, an icon for each; a disclosure with controls.'],
          ['StepForm, Step', 'ui/form.js: a form split into steps.'],
          ['Carousel, Collage', 'widgets/carousel.js, widgets/collage.js.'],
          ['HexGrid, HexWall, Timeline, TicketCard, StatCard, ImageCard', 'widgets/layout.js (see the Widgets page).'],
          ['RadialMenu, StepBar, TabBar', 'widgets/nav.js.'],
          ['Orbit, OrbitClock, SolarSystem', 'visuals/effects.js.'],
          ['PauseOffscreen, useInView', 'Run CSS animations and timers only while on screen.'],
          ['cx', 'lib/cx.js: join class names, skipping falsy ones.'],
        ]} />
      </Section>

      <Section name="Animations" intro="Canvas backgrounds on any element with data-component='animation'. They draw in the theme's colors, only run while on screen and hold still for reduced motion.">
        <Example name="animation" text="data-name: blob, network-loop, wave, snow… (see the Animations page). data-fps caps the frame rate."
          code={`
            <div data-component="animation" data-name="blob" data-fps="20" style={{ height: '10rem' }} />
          `}>
          <div data-component="animation" data-name="blob" data-fps="20" className="round overflow-hidden" style={{ height: '8rem' }} />
        </Example>
      </Section>

      <Section name="Variables" intro="Every setting is a CSS variable with a weightless default (tokens/defaults.css), so a site's own :root always wins.">
        <Code lang="css">{`
          :root {
            --primary: #1f64cf;
            --secondary: #1ecbe1;
            --font-body: 'Inter Variable', sans-serif;
            --radius: .75rem;
            --grid-gap: 1rem;
            --grid-min: 14rem;
            --wrap-max: 80rem;
          }
        `}</Code>
        <Terms items={[
          ['--primary … --info, --dark, --light', 'Colors; -lighter, -darker and the -mode / text pairs are worked out from them.'],
          ['--font-body, --font-heading, --font-size, --h1 … --h6', 'Type.'],
          ['--space, --space-sm, --space-lg, --pad', 'Spacing.'],
          ['--grid-cols, --grid-gap, --grid-min', 'Grid defaults (set --cols, --gap, --min on one grid).'],
          ['--wrap-max, --wrap-sm, --wrap-lg, --wrap-pad', 'Page column widths.'],
          ['--radius, --border-width, --shadow, --duration', 'Shape, depth and motion.'],
        ]} />
      </Section>
    </div>
    </>
  );
}

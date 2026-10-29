'use client';
import { useContext, useState, useEffect } from "react";
import { Button } from 'marccent-theme/components/ui/button';
import { ToggleButton } from 'marccent-theme/components/ui/toggle-button';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Loading } from 'marccent-theme/components/ui/loading';
import { Alert } from 'marccent-theme/components/ui/alert';
import { Field, Input } from 'marccent-theme/components/ui/field';
import { Form, StepForm, Step } from 'marccent-theme/components/ui/form';
import { Accordion, AccordionItem } from 'marccent-theme/components/ui/accordion';
import { Board } from 'marccent-theme/components/ui/board';
import { Modal } from 'marccent-theme/components/ui/modal';
import { Pagination } from 'marccent-theme/components/ui/pagination';
import { Clock } from 'marccent-theme/components/ui/clock';
import { Counter } from 'marccent-theme/components/ui/counter';
import { Menu } from '@/components/layout/menus';
import { GalleryHeader, Section, Demo, Row } from '@/components/gallery';
import { ButtonDemos, FormDemos, OverlayDemos, DataDemos, LayoutDemos } from './more-demos';
import { Countdown } from 'marccent-theme/components/visuals/effects';
import { StatCard } from 'marccent-theme/components/widgets/layout';
import { Grid } from 'marccent-theme/lib/grid_helper';
import { cssBackground } from 'marccent-theme/lib/css-color';
import { ThemeContext } from "marccent-theme/lib/context";
import { toastSI } from "marccent-theme/lib/toasts";

/*
 * Theme gallery: the site's building blocks (colors, type, buttons, forms, overlays, navigation, data, layout) in the
 * active theme, so a change of light / dark, glass, theme colors (footer) or design theme (styles/main.css) shows
 * everywhere at once. Shapes and Widgets (the other Design pages) have their own. Built only from the existing
 * components and classes; one-off values (sizes, sample colors) are inline.
 */

const SECTIONS = ['Colors', 'Typography', 'Buttons', 'Hover effects', 'Forms', 'Feedback', 'Overlays', 'Navigation', 'Data display', 'Layout'];
const PALETTE = ['primary', 'secondary', 'danger', 'success', 'info'];
const FILLS = [...PALETTE, 'light', 'dark', 'gradient'];
const OUTLINES = [...PALETTE.map(c => `outline-${c}`), 'outline-gradient'];
// A spread of icons for the demo buttons, picked by position (the same on the server and in the browser), so the
// rows show more of what the theme offers than one icon each.
const ICONS = ['star', 'heart', 'bolt', 'rocket', 'gem', 'leaf', 'fire', 'music', 'camera', 'cloud', 'moon', 'sun', 'flag',
  'gift', 'crown', 'compass', 'feather', 'anchor', 'puzzle-piece', 'paper-plane', 'seedling', 'mug-hot', 'bell', 'dice'];
const icon = (i, salt = 0) => ICONS[(i * 7 + salt * 5) % ICONS.length];
const FILLED = ['primary', 'secondary', 'gradient', 'dark', 'danger', 'success', 'info', 'light'];
const OUTLINED = ['outline-primary', 'outline-secondary', 'outline-gradient', 'outline-danger', 'outline-success', 'outline-info'];
// Rows step through these in order, so between them the effect rows show every filled and every outline look.
const look = (list, i) => list[i % list.length];


// Each class's background as the browser draws it (lib/css-color.js): { [cls]: { hex, image, stops } }.
// Re-read when deps change (mode, theme colors).
const useBackgrounds = (classes, deps) => {
  const [ found, setFound ] = useState({});
  useEffect(() => setFound(Object.fromEntries(classes.map(cls => [cls, cssBackground(cls)]))), deps);
  return found;
};

// A color card, like the footer theme cards: a square of the shades top to bottom (or fill, any background image),
// then a dot and hex per shade.
// shades: [{ label, hex }], lightest first; label shows at the end of its row (or only on hover when hideLabels).
// Built from layout / utility classes; only the colors are inline. content-start: a card stretched to a taller
// neighbour's height keeps its contents at the top.
const ColorCard = ({ name, shades, fill, hideLabels }) => (
  <div className="bg border round shadow grid cols-1 gap-0 content-start">
    <div className="square" style={{ backgroundImage: fill ?? `linear-gradient(to bottom, ${shades.map(s => s.hex).join(', ')})` }}
      role="img" aria-label={`${name} shades`} />
    <div className="pad-sm grid cols-1 gap-sm">
      <strong className="text-capitalize">{name}</strong>
      <ul className="grid cols-1 text-uppercase" style={{ '--gap': 'var(--space-xs)', fontSize: 'var(--text-xs)' }}>
        {shades.map(sh => (
          <li key={sh.label} className="grid items-center gap-sm" title={sh.label}
            style={{ gridTemplateColumns: 'auto auto minmax(0, 1fr)' }}>
            <span className="circle" style={{ width: '1em', aspectRatio: 1, backgroundColor: sh.hex }} />
            {sh.hex}
            {!hideLabels && <span className="text-end opacity-75">{sh.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Cards in a wrapping grid, each at least 8rem wide.
const Cards = ({ children }) => <div className="grid gap-sm" style={{ '--cols': 6, '--min': '8rem' }}>{children}</div>;

export default function ThemePage() {
  const { theme } = useContext(ThemeContext) ?? {};
  const [ modal, setModal ] = useState(false);
  const [ ticket, setTicket ] = useState(false);
  const [ page, setPage ] = useState(1);
  const [ timing, setTiming ] = useState(false);
  const [ countdown, setCountdown ] = useState(0); // a new key restarts the countdown
  const GRADIENTS = ['bg-gradient-lighter', 'bg-gradient', 'bg-gradient-darker'];
  const swatches = [...PALETTE.flatMap(c => [`bg-${c}-lighter`, `bg-${c}`, `bg-${c}-darker`]), ...GRADIENTS];
  const bg = useBackgrounds(swatches, [theme?.isDark, theme?.palette]);
  if (!theme) return <Loading require={[]} />;
  const say = (msg, type) => toastSI.add(msg, type);
  // The form demos: say what was sent instead of sending it anywhere.
  const submitted = (values) => say(`Submitted: ${Object.entries(values).map(([ k, v ]) => `${k} = ${v || '(empty)'}`).join(', ')}`, 'success');
  const board = new Grid(6, 6, (row, col) => ({ row, col }));

  return (
    <>
    <GalleryHeader title="Theme" sections={SECTIONS}>
      <p>
        Every building block this site is made of, in the active theme. Switch light / dark or glass in the header,
        pick theme colors in the footer, or choose a design theme in <code>styles/main.css</code>, and everything
        below changes with it.
      </p>
    </GalleryHeader>
    <div className="wrap grid cols-1 gap-lg pad-y-lg">

      <Section name="Colors" intro="Palette classes: the plain one follows the mode (lighter in light mode, darker in dark mode); -lighter and -darker are fixed.">
        <Cards>
          {PALETTE.map(c => (
            <ColorCard key={c} name={c} shades={[['lighter', '-lighter'], ['mode', ''], ['darker', '-darker']]
              .map(([label, v]) => ({ label, hex: bg[`bg-${c}${v}`]?.hex ?? '' }))} />
          ))}
        </Cards>
        <Demo name="Gradients">Primary to secondary</Demo>
        <Cards>
          {GRADIENTS.map(cls => (
            <ColorCard key={cls} name={cls.replace('bg-', '')} fill={bg[cls]?.image}
              shades={(bg[cls]?.stops ?? []).map((hex, i, all) => ({ label: i === 0 ? 'start' : i === all.length - 1 ? 'end' : `stop ${i}`, hex }))} />
          ))}
        </Cards>
        <Demo name="bg-gradient-run">One gradient running through a group: each card is a window onto it (a grid fixed cols-4, two rows, gaps included)</Demo>
        <div className="grid fixed cols-4 gap-lg bg-gradient-run">
          {[ [ 'rocket', '42', 'Projects shipped' ], [ 'code-branch', '1.2k', 'Commits' ], [ 'star', '4.9', 'Rating' ], [ 'users', '18', 'Clients' ],
            [ 'mug-hot', '730', 'Coffees' ], [ 'bug', '0', 'Open bugs' ], [ 'clock', '24/7', 'Uptime' ], [ 'heart', '100%', 'Fun' ] ].map(([ icon, value, label ]) => (
            <StatCard key={label} icon={icon} value={value} label={label} />
          ))}
        </div>
        <Row label="Text colors">
          {PALETTE.map(c => <span key={c} className={`text-${c} fw-bold`}>text-{c}</span>)}
          <span className="text-gradient fw-bold">text-gradient</span>
        </Row>
        <Demo name="Theme shades">Set by the theme changer; the canvas animations use the same</Demo>
        <Cards>
          {[['primary', theme.primary()], ['secondary', theme.secondary()], ['dark', theme.dark], ['light', theme.light]]
            .filter(([, color]) => color?.lighter)
            .map(([name, color]) => (
              <ColorCard key={name} name={name} hideLabels
                shades={[...color.lighter].reverse().concat(color, color.darker).map((c, i) => ({ label: `${name} ${i}`, hex: c.hex }))} />
            ))}
        </Cards>
      </Section>

      <Section name="Typography">
        <div className="grid cols-1 gap-sm">
          <h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6>
          <p className="display-sm">display-sm</p>
          <p>Body text with a <a href="#typography">link</a>, <strong>bold</strong>, <em>italic</em>, <code>code</code> and <small>small</small> text.</p>
          <p className="fs-lg">fs-lg: larger text</p>
          <p className="fs-sm opacity-75">fs-sm opacity-75: smaller, muted text</p>
          <p className="fw-light text-uppercase">fw-light text-uppercase</p>
        </div>
      </Section>

      <Section name="Buttons" intro="Button gives the layout (icon left, label right); a color class on it gives the look.">
        <Row label="Kinds and states">
          <Button icon="star">Icon + label</Button>
          <Button icon="star" aria-label="Icon only" />
          <Button icon="arrow-right" href="#buttons">As a link</Button>
          <Button onClick={() => say('Text button')}>Text button</Button>
          <Button icon="toggle-on" aria-pressed="true">Pressed</Button>
          <Button icon="ban" disabled>Disabled</Button>
          <Button icon="link-slash" href="/" disabled>Disabled link</Button>
          <button data-component="button" data-name="close" type="button" className="btn-close col-center" aria-label="Close"><Icon name="xmark" /></button>
        </Row>
        <Row label="Filled" note=".btn + a color">
          {FILLS.map((c, i) => <Button key={c} icon={icon(i)} className={c}>{c}</Button>)}
        </Row>
        <Row label="Filled, icon only">
          {FILLS.map((c, i) => <Button key={c} icon={icon(i, 1)} className={c} aria-label={c} />)}
        </Row>
        <Row label="Outline" note=".btn + outline-color">
          {OUTLINES.map((c, i) => <Button key={c} icon={icon(i, 2)} className={c}>{c}</Button>)}
        </Row>
        <Demo name="Width">Content-sized by default, w-100 to fill</Demo>
        <div className="grid cols-1 gap-sm border round pad">
          <Button icon="compress" className="secondary">Content width</Button>
          <Button icon="expand" className="outline-gradient w-100">w-100: full width</Button>
        </div>
        <Demo name="icon-only-sm">Labels drop below 40rem of their container (this box is a .cq, 22rem wide)</Demo>
        <div className="cq border round pad icon-only-sm" style={{ maxWidth: '22rem' }}>
          <div className="grid auto-cols gap-sm">
            <Button icon="sun" className="light">Light</Button>
            <Button icon="moon" className="dark">Dark</Button>
            <Button icon="brush" className="outline-gradient">Theme</Button>
          </div>
        </div>
        <Demo name="Animated">data-component="button animation" on a button: a canvas animation (data-name) behind its icon and label (on dark, so the label reads over the theme colors)</Demo>
        <Row>
          {[['blob', 'droplet'], ['fire', 'fire'], ['wave', 'water'], ['network-loop', 'diagram-project'],
            ['particle-flowfield', 'wind'], ['orbit', 'circle-notch'], ['snow', 'snowflake'],
            ['fireflies', 'star'], ['leaves', 'leaf'], ['rain', 'cloud-rain'], ['bubbles', 'water']].map(([anim, ic]) => (
            <Button key={anim} icon={ic} className="dark" data-component="button animation" data-name={anim}>{anim}</Button>
          ))}
        </Row>
        <ButtonDemos />
      </Section>

      <Section name="Hover effects" intro="Hover classes (styles/hovers.css) work on any element and draw in the theme's colors (--hover-from / --hover-to override them). A pressed toggle shows the same effect.">
        <Demo name="hover-holographic">Cards in the theme&apos;s surfaces and colors, then buttons; the last of each overrides its colors</Demo>
        <div className="row-wrap gap-sm pad-y-sm">
          {[['bg border', 'Surface'], ['bg-primary', 'Primary'], ['bg-secondary', 'Secondary'], ['bg-gradient', 'Gradient'], ['bg-gradient-darker', 'Darker']].map(([cls, name]) => (
            <div key={name} className={`${cls} round shadow pad col-center hover-holographic`} style={{ width: '9rem', aspectRatio: '3 / 2' }}>
              <strong>{name}</strong>
            </div>
          ))}
          <div className="bg border round shadow pad col-center text-center hover-holographic"
            style={{ width: '9rem', aspectRatio: '3 / 2', '--hover-from': 'var(--danger)', '--hover-to': 'var(--info)' }}>
            <strong>danger → info</strong>
          </div>
        </div>
        <Row>
          {['primary', 'secondary', 'gradient', 'outline-primary', 'outline-gradient'].map((c, i) => (
            <Button key={c} icon={icon(i, 3)} className={`${c} hover-holographic`}>{c}</Button>
          ))}
          <Button icon="wand-magic-sparkles" className="outline-primary hover-holographic" style={{ '--hover-from': 'var(--danger)', '--hover-to': 'var(--info)' }}>danger → info</Button>
        </Row>
        <Demo name="hover-underline">For text</Demo>
        <div className="row-wrap gap-lg pad-y-sm">
          <a href="#hover-effects" className="hover-underline">A text link</a>
          <span className="hover-underline fs-lg fw-bold">A heading</span>
          <a href="#hover-effects" className="hover-underline" style={{ '--hover-from': 'var(--success)', '--hover-to': 'var(--info)' }}>success → info</a>
        </div>
        <Demo name="hover-rise">For icons; the shape is the element&apos;s own classes</Demo>
        <div className="row-wrap gap-sm pad-y-sm">
          {[['message', 'Message'], ['star', 'Favorite'], ['bell', 'Notify'], ['gear', 'Settings']].map(([icon, label]) => (
            <a key={icon} href="#hover-effects" aria-label={label} className="circle border col-center fs-lg hover-rise"
              style={{ width: '4rem', aspectRatio: 1 }}><Icon name={icon} /></a>
          ))}
          {/* Brand colors per icon, like social links: */}
          {[['codepen', '#47cf73'], ['linkedin', '#0a66c2'], ['github', '#6e5494']].map(([icon, brand]) => (
            <a key={icon} href="#hover-effects" aria-label={icon} className="circle border col-center fs-lg hover-rise"
              style={{ width: '4rem', aspectRatio: 1, '--hover-from': brand, '--hover-to': brand }}><Icon name={icon} family="fa-brands" /></a>
          ))}
        </div>
        <div><Button icon="paper-plane" className="outline-primary hover-rise">On a button</Button></div>
        <Demo name="hover-expand">Icon buttons that show their label on hover</Demo>
        <div className="row-wrap gap-sm pad-y-sm">
          <Button icon="message" className="hover-expand">Message</Button>
          <Button icon="fa-brands fa-codepen" className="hover-expand">Codepen</Button>
          <Button icon="fa-brands fa-linkedin" className="hover-expand" style={{ '--hover-from': '#0a66c2', '--hover-to': '#0a66c2' }}>LinkedIn</Button>
          <Button icon="fa-brands fa-github" className="hover-expand">Github</Button>
        </div>
        <Demo name="Button effects">hover-spread, hover-press, hover-shine, hover-halo</Demo>
        <Row>
          {['spread', 'press', 'shine', 'halo'].map((fx, i) => <Button key={fx} icon={icon(i, 4)} className={`${look(FILLED, i)} hover-${fx}`}>{fx}</Button>)}
        </Row>
        <Row>
          {['spread', 'press', 'shine', 'halo'].map((fx, i) => <Button key={fx} icon={icon(i, 5)} className={`${look(OUTLINED, i)} hover-${fx}`}>{fx}</Button>)}
        </Row>
        <Demo name="Outline effects">hover-trace, hover-dash (Button trace adds the SVG outline)</Demo>
        <Row>
          <Button icon="route" trace className="hover-trace">trace</Button>
          <Button icon="pen-nib" trace className="secondary hover-trace">trace</Button>
          <Button icon="scissors" trace className="hover-dash">dash</Button>
          <Button icon="ruler" trace className="danger hover-dash">dash</Button>
        </Row>
        <Demo name="Past the edge">hover-goo (filled elements), hover-pop, hover-glow</Demo>
        <Row gap="lg" className="pad-y">
          <Button icon="droplet" className="secondary hover-goo">goo</Button>
          <Button icon="flask" className="gradient hover-goo">goo</Button>
          <Button icon="arrow-up" className="light hover-pop">pop</Button>
          <Button icon="rocket" className="danger hover-pop">pop</Button>
          <Button icon="lightbulb" className="outline-info hover-glow">glow</Button>
          <Button icon="star" className="dark hover-glow">glow</Button>
        </Row>
        <Demo name="Rings">Box-shadow outlines, on filled buttons</Demo>
        <Row gap="lg" className="pad">
          {['rings', 'inset-ring', 'offset', 'frame', 'tabs', 'double', 'corners', 'pill'].map((fx, i) => (
            <Button key={fx} icon={icon(i, 6)} className={`${look(FILLED, i)} hover-${fx}`}>{fx}</Button>
          ))}
        </Row>
        <Demo name="Fills">On outlined buttons (not outline-gradient: its gradient text would sit on the fill)</Demo>
        <Row>
          {['fill', 'stripes', 'bloom', 'wipe', 'split', 'slide'].map((fx, i) => (
            <Button key={fx} icon={icon(i, 7)} className={`${look(OUTLINED.filter(c => c !== 'outline-gradient'), i)} hover-${fx}`}>{fx}</Button>
          ))}
        </Row>
        <Demo name="Shapes">For .shape-* elements (a shape cuts away anything drawn outside it): grow, spin, flip, morph, float (on a wrapper), and shine</Demo>
        <div className="grid gap-lg items-center justify-center text-center" style={{ '--cols': 6, '--min': '7rem' }}>
          {[
            ['hover-grow', <div key="g" className="shape-pentagon bg-gradient hover-grow" style={{ width: '5.5rem' }} />],
            ['hover-spin', <div key="s" className="shape-star bg-gradient hover-spin" style={{ width: '6rem' }} />],
            ['hover-flip', <div key="f" className="shape-hexagon bg-primary col-center hover-flip" style={{ width: '5.5rem' }}><Icon name="coins" className="fs-lg" /></div>],
            ['hover-morph', <div key="m" className="shape-star bg-gradient hover-morph" style={{ width: '6rem', '--hover-shape':
              'polygon(50% 0, 79.4% 9.5%, 97.6% 34.5%, 97.6% 65.5%, 79.4% 90.5%, 50% 100%, 20.6% 90.5%, 2.4% 65.5%, 2.4% 34.5%, 20.6% 9.5%)' }} />],
            ['hover-float', <div key="w" className="hover-float"><div className="shape-heart bg-danger" style={{ width: '6rem' }} /></div>],
            ['hover-shine', <div key="b" className="shape-bubble bg-secondary col-center hover-shine" style={{ width: '7rem', paddingBottom: '25%' }}>Hi!</div>],
          ].map(([label, shape]) => (
            <div key={label} className="grid cols-1 gap-sm justify-center">{shape}<small className="opacity-75">{label}</small></div>
          ))}
        </div>
      </Section>

      <Section name="Forms" intro="Native forms: the browser validates (required, type…) before onSubmit runs.">
        <Demo name="Form with fields" />
        <Form onSubmit={submitted}>
          <Field name="first_name" required />
          <Field name="email" type="email" required />
          <Field name="password" type="password" />
          <Field name="date" type="date" />
          <Field name="amount" type="number" />
          <Field name="volume" type="range" />
          <Field name="color" type="color" defaultValue="#1f64cf" />
          <Field name="plan" as="select">
            <option>Free</option><option>Pro</option><option>Team</option>
          </Field>
          <Field name="message" as="textarea" rows={3} />
        </Form>
        <Demo name="Inline form" />
        <Form className="grid inline-form" onSubmit={submitted} submitLabel="Search" submitIcon="magnifying-glass">
          <Input name="city" required />
          <Input name="state" />
          <Input name="zip" inputMode="numeric" />
        </Form>
        <Demo name="Step form" />
        <StepForm onSubmit={submitted}>
          <Step name="Contact">
            <Field name="name" required />
            <Field name="email" type="email" required />
          </Step>
          <Step name="Address">
            <Field name="street" />
            <Field name="city" required />
          </Step>
          <Step name="Message">
            <Field name="message" as="textarea" rows={4} required />
          </Step>
        </StepForm>
        <FormDemos />
      </Section>

      <Section name="Feedback">
        <Demo name="Alerts" />
        <div className="grid cols-1 gap-sm">
          {PALETTE.map(tone => (
            <Alert key={tone} tone={tone}>A <strong>{tone}</strong> alert with <a href="#feedback" className="fw-bold">a link</a>.</Alert>
          ))}
          <Alert className="bg-gradient-lighter">An alert on the gradient (className=&quot;bg-gradient-lighter&quot;).</Alert>
        </div>
        <Row label="Toasts" note="Bottom right">
          <Button icon="bell" onClick={() => say('A plain toast')}>Plain</Button>
          {PALETTE.map(t => <Button key={t} icon="bell" className={`outline-${t}`} onClick={() => say(`A ${t} toast`, t)}>{t}</Button>)}
        </Row>
        <Demo name="Loading">kind=&quot;…&quot; picks the look (the .loader-* classes); text-primary colors the ones drawn in the text color</Demo>
        <Row>
          {['spinner', 'ring', 'dots', 'bars', 'pulse', 'orbit', 'flip'].map(kind => (
            <div key={kind} className="grid cols-1 gap-sm justify-center text-center" style={{ width: '5rem' }}>
              <div className="col-center" style={{ height: '3.5rem' }}><div style={{ width: kind === 'dots' ? '3.5rem' : '3rem' }}><Loading require={[false]} kind={kind} className="text-primary" /></div></div>
              <small className="opacity-75">{kind}</small>
            </div>
          ))}
        </Row>
        <div className="grid cols-1 gap-sm"><Loading require={[false]} kind="bar" className="text-primary" /><small className="opacity-75">bar: indeterminate progress</small></div>
        <Demo name="loader-spin, loader-breathe">Motion only, so any shape becomes a loader</Demo>
        <Row>
          <div className="shape-star bg-gradient loader-spin" style={{ width: '3rem' }} role="status" aria-label="Loading" />
          <div className="shape-hexagon bg-gradient loader-breathe" style={{ width: '3rem' }} role="status" aria-label="Loading" />
          <div className="shape-heart bg-danger loader-breathe" style={{ width: '3rem' }} role="status" aria-label="Loading" />
          <div className="shape-diamond bg-secondary loader-spin" style={{ width: '3rem' }} role="status" aria-label="Loading" />
        </Row>
        <Demo name="Progress" />
        <div className="grid cols-1 gap-sm">
          {PALETTE.map((c, i) => (
            <progress key={c} className="w-100" value={(i + 2) * 15} max={100} aria-label={`${c} ${(i + 2) * 15}%`}
              style={{ accentColor: `var(--${c})` }} />
          ))}
        </div>
      </Section>

      <Section name="Overlays" intro="One Modal component, two looks with the same behavior (native dialog: Esc, backdrop click, focus kept inside): the default, and variant=&quot;ticket&quot;.">
        <Row>
          <Button icon="window-restore" className="primary" onClick={() => setModal(true)}>Open modal</Button>
          <Button icon="ticket" className="primary" onClick={() => setTicket(true)}>Open ticket modal</Button>
        </Row>
        <Modal title="A modal" show={modal} setShow={setModal}
          footer={<Button icon="check" className="primary" onClick={() => setModal(false)}>Got it</Button>}>
          <p>A native &lt;dialog&gt;: Esc, the Close button or a click on the backdrop closes it, and focus stays inside while it&apos;s open.</p>
        </Modal>
        <Modal variant="ticket" title="A ticket modal" show={ticket} setShow={setTicket}
          footer={<Button icon="check" className="primary" onClick={() => setTicket(false)}>Got it</Button>}>
          <p>The same dialog, the ticket look: Esc, Close or a click on the backdrop closes it.</p>
        </Modal>
        <OverlayDemos />
      </Section>

      <Section name="Navigation">
        <Demo name="Menu">The header uses the same component</Demo>
        <Menu label="Example" gap="gap-0" className="divide border round" items={[
          { name: 'Home', href: '#example-home' },
          { name: 'Products', href: '#example-products', children: [
            { name: 'All products', href: '#example-products' },
            { name: 'Starter', href: '#example-starter', icon: 'fa-solid fa-seedling' },
            { name: 'Pro', href: '#example-pro', icon: 'fa-solid fa-rocket' },
          ] },
          { name: 'About', href: '#example-about' },
          { name: 'Contact', href: '#example-contact' },
        ]} />
        <Demo name="Pagination">Page {page}</Demo>
        <Pagination total={50} pageSize={10} current={page} update={setPage} className="divide border round" />
        <Demo name="Accordion" />
        <Accordion>
          {['First', 'Second', 'Third'].map(n => (
            <AccordionItem key={n} header={`${n} item`}>
              The {n.toLowerCase()} item&apos;s body. Opening one closes the others; pass <code>multiple</code> to keep several open.
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section name="Data display">
        <div className="grid gap-sm cols-2">
          <div className="bg border round shadow grid cols-1 gap-0">
            <div className="bg-primary pad text-center"><Icon name="layer-group" className="fs-lg" /></div>
            <div className="pad grid cols-1 gap-sm">
              <h5>Card</h5>
              <p>A card is just classes: bg border round shadow, a colored header and a padded body.</p>
              <Button icon="arrow-right" className="outline-primary">Action</Button>
            </div>
          </div>
          <ul className="grid cols-1 gap-0 divide border round">
            {['Divided list', 'Each item', 'Gets a line', 'Except the last'].map(t => <li key={t} className="pad-sm">{t}</li>)}
          </ul>
        </div>
        <div className="grid gap-sm" style={{ '--cols': 3 }}>
          <div className="sub rows-3 bg border round shadow pad justify-center text-center">
            <h5>Clock</h5>
            <Clock className="display-sm self-center" />
            <Clock className="opacity-75 self-center" format="dddd, MMMM D" />
          </div>
          <div className="sub rows-3 bg border round shadow pad justify-center text-center">
            <h5>Stopwatch</h5>
            <Counter className="display-sm self-center" active={timing} getTime={(t) => say(`Stopped at ${t.minute}:${t.second}.${t.tos}`, 'info')} />
            <ToggleButton data-name="stopwatch" icon="play" activeIcon="stop" activeLabel="Stop" className={timing ? 'danger' : 'success'}
              open={timing} onToggle={setTiming}>
              Start
            </ToggleButton>
          </div>
          <div className="sub rows-3 bg border round shadow pad justify-center text-center">
            <h5>Countdown</h5>
            <Countdown key={countdown} from={9} onDone={() => say('Countdown done', 'success')} className="text-primary self-center" style={{ '--countdown-size': '5rem' }} />
            <Button icon="rotate-right" onClick={() => setCountdown(countdown + 1)}>Restart</Button>
          </div>
        </div>
        <Demo name="Board">Game grids are built on it</Demo>
        <div style={{ maxWidth: '16rem' }}>
          <Board grid={board} gap="2px">
            {(cell, i) => <div key={i} className={`square ${(cell.row + cell.col) % 2 ? 'bg-primary' : 'bg-secondary-lighter'}`} />}
          </Board>
        </div>
        <DataDemos />
      </Section>

      <Section name="Layout" intro="layout.css: grids that wrap by width, fixed column counts, ratio layouts and layering.">
        <Demo name="grid">Wraps when narrow</Demo>
        <div className="grid">{[1, 2, 3].map(n => <div key={n} className="bg-primary-lighter pad round text-center">{n}</div>)}</div>
        <Demo name="grid fixed cols-4">Never wraps</Demo>
        <div className="grid fixed cols-4 gap-sm">{[1, 2, 3, 4].map(n => <div key={n} className="bg-secondary-lighter pad round text-center">{n}</div>)}</div>
        <Demo name="layout-2-1">One column until 40rem</Demo>
        <div className="grid layout-2-1">
          <div className="bg-primary-lighter pad round">2fr</div>
          <div className="bg-secondary-lighter pad round">1fr</div>
        </div>
        <Demo name="stack">Children layered in one cell, later on top; still in the flow, unlike position: absolute</Demo>
        <div className="grid gap-sm" style={{ '--cols': 3, '--min': '12rem' }}>
          <div className="sub rows-2">
            <div className="stack round" style={{ height: '9rem' }}>
              <div className="bg-gradient" />
              <div className="col-center fw-bold">Text on a background</div>
            </div>
            <small className="opacity-75">A fill layer, then the text</small>
          </div>
          <div className="sub rows-2">
            <div className="stack round border" style={{ height: '9rem' }}>
              <div className="bg-primary-lighter" />
              <div className="shape-ring bg-gradient self-center" style={{ width: '7rem', justifySelf: 'center', '--ring-hole': '75%' }} />
              <div className="col-center"><Icon name="layer-group" className="fs-lg" /></div>
            </div>
            <small className="opacity-75">Three layers: fill, ring, icon (OrbitClock stacks its rings this way)</small>
          </div>
          <div className="sub rows-2">
            <div className="stack round border bg pad" style={{ height: '9rem' }}>
              <div className="self-center"><strong>Card</strong><p className="opacity-75">A badge pinned to its corner.</p></div>
              <span className="bg-danger round pad-x-sm self-start fs-sm" style={{ justifySelf: 'end' }}>New</span>
            </div>
            <small className="opacity-75">A badge: a layer aligned to the top right, no absolute positioning</small>
          </div>
        </div>
        <LayoutDemos />
      </Section>

    </div>
    </>
  );
}

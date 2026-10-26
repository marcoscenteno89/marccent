// Shared: no 'use client' (no state or effects), so the gallery pages can render on the server or in the browser.
import { Menu } from '@/components/layout/menus';
import { cx } from 'marccent-theme/lib/cx';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Collage as ThemeCollage } from 'marccent-theme/components/widgets/collage';

/*
 * The design gallery's building blocks, shared by its pages (Theme, Shapes, Widgets: the Design menu): a page header
 * with a menu of its sections, the sections, and the headings over each demo. Only layout and utility classes.
 */

const slug = (name) => name.toLowerCase().replace(/ /g, '-');

// Each Design page's hero: the canvas behind it and its icon (the Design menu's), so every page has its own look.
const HERO = {
  Theme: { canvas: 'blob', icon: 'palette' },
  Shapes: { canvas: 'orbit', icon: 'shapes' },
  Widgets: { canvas: 'network-loop', icon: 'puzzle-piece' },
  Parallax: { canvas: 'fireflies', icon: 'mountain-sun' },
  Images: { canvas: 'bubbles', icon: 'images' },
  Animations: { canvas: 'particle-flowfield', icon: 'wand-magic-sparkles' },
  Docs: { canvas: 'wave', icon: 'book' },
};

// The page's hero, full width (outside the page's .wrap): a live canvas behind a card with the title, intro and a menu of its sections (links to their ids). Built on
// .stack (the canvas and the content in one cell); canvas and icon default to HERO[title]. Only the height, the
// title's size, the card's and intro's widths and the content's column are inline (minmax(0, 1fr), as in CanvasBand, so it shrinks on a phone).
const GalleryHeader = ({ title, sections, canvas = HERO[title]?.canvas ?? 'blob', icon = HERO[title]?.icon ?? 'palette', children }) => (
  <header data-component="gallery-header" data-name={slug(title)} className="wrap wrap-fluid pad-0 stack overflow-hidden" style={{ minHeight: '26rem' }}>
    <div data-component="animation" data-name={canvas} className="bg w-100 h-100" aria-hidden="true" />
    <div className="col-center pad-lg text-center" style={{ position: 'relative', gridTemplateColumns: 'minmax(0, 1fr)' }}>
      <div className="bg border round shadow pad-lg grid cols-1 justify-center w-100" style={{ maxWidth: '62rem' }}>
        <small className="fw-bold text-uppercase text-primary" style={{ letterSpacing: '.25em' }}>
          <Icon name={icon} /> Design
        </small>
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2.4rem, 7vw, 4.5rem)', lineHeight: 1.05 }}>{title}</h1>
        <div className="fs-lg" style={{ maxWidth: '42rem', textWrap: 'balance' }}>{children}</div>
        <Menu items={sections.map(name => ({ name, href: `#${slug(name)}` }))} label="Sections"
          layout="auto-cols" gap="gap-0" className="divide border round" />
      </div>
    </div>
  </header>
);

// A titled block; id makes it a target for the section menu.
const Section = ({ name, intro, children }) => (
  <section id={slug(name)} className="bg border round pad grid cols-1 gap-sm">
    <h2>{name}</h2>
    {intro && <p className="opacity-75">{intro}</p>}
    {children}
  </section>
);

// A demo's heading: a small hexagon in the secondary, the name in the primary (solid colors: the gradient is kept for
// the demos themselves) and, under it, what it shows.
// pad-y-sm: room between the demo above and this one.
const Demo = ({ name, children }) => (
  <div className="grid cols-1 gap-0 pad-y-sm">
    <h5 className="grid auto-cols gap-sm items-center">
      <span className="shape-hexagon bg-secondary" style={{ width: '.75rem' }} aria-hidden="true" />
      <span className="text-primary">{name}</span>
    </h5>
    {children && <small className="opacity-75">{children}</small>}
  </div>
);

// A labelled row of examples (.row-wrap): packed from the left, each as wide as its content, wrapping when narrow.
// gap: 'sm' (default) or 'lg', for effects that draw past the edge; className: padding round them (default
// pad-y-sm: a little room above and below, so rows don't crowd the next heading).
const Row = ({ label, note, gap = 'sm', className = 'pad-y-sm', children }) => (
  <div className="grid cols-1 gap-sm">
    {label && <Demo name={label}>{note}</Demo>}
    <div className={cx('row-wrap', `gap-${gap}`, className)}>{children}</div>
  </div>
);

// A section's demos as a collage (the Widgets and Shapes pages): the theme's Collage with these pages' cell sizes and
// a tighter gap; its Tiles below as children.
const Collage = (props) => <ThemeCollage cols={4} min="13rem" row="12rem" className="gap-sm" {...props} />;

// Tile sizes: wide = two columns, wider = three, tall = two rows, big = two of each, full = the whole row (the column
// spans wait for a wide enough grid).
const SIZE = {
  wide: { className: 'span-2' },
  wider: { className: 'span-3' },
  tall: { style: { gridRow: 'span 2' } },
  big: { className: 'span-2', style: { gridRow: 'span 2' } },
  full: { className: 'span-full' },
};

// One tile: the demo's name and what it shows, then the widget centered in the space left.
const Tile = ({ name, text, size, children }) => {
  const { className, style } = SIZE[size] ?? {};
  return (
    <article className={cx('bg border round pad grid cols-1 gap-sm', className)} style={{ gridTemplateRows: 'auto 1fr', ...style }}>
      <Demo name={name}>{text}</Demo>
      <div className="grid cols-1 items-center">{children}</div>
    </article>
  );
};

export { GalleryHeader, Section, Demo, Row, Collage, Tile };

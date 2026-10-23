// Shared: no 'use client' (no state or effects), so the gallery pages can render on the server or in the browser.
import { Menu } from '@/components/layout/menus';
import { cx } from 'marccent-theme/lib/cx';

/*
 * The design gallery's building blocks, shared by its pages (Theme, Shapes, Widgets: the Design menu): a page header
 * with a menu of its sections, the sections, and the headings over each demo. Only layout and utility classes.
 */

const slug = (name) => name.toLowerCase().replace(/ /g, '-');

// The page's title, intro and a menu of its sections (links to their ids).
const GalleryHeader = ({ title, sections, children }) => (
  <header className="bg border round pad grid cols-1 gap-sm">
    <h1>{title}</h1>
    {children}
    <Menu items={sections.map(name => ({ name, href: `#${slug(name)}` }))} label="Sections"
      layout="auto-cols" className="divide border round" />
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

export { GalleryHeader, Section, Demo, Row };

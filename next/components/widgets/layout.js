'use client';
import { useState, Children } from 'react';
import { cx } from '@/lib/cx';
import { Icon } from '@/components/ui/icon';

/*
 * Layout widgets: honeycombs (HexGrid, HexWall), a timeline and cards (TicketCard, StatCard). No CSS of their own: grid, stack,
 * shape and color classes, and inline styles for what only the component knows (positions, sizes, turns).
 */

// A light wash of the primary over the surface: cards that sit on a .bg panel still stand out from it.
const TINT = 'color-mix(in srgb, var(--primary) 14%, var(--surface))';

/**
 * HexGrid: its children as interlocking hexagons, on a grid. Every row track is a quarter of a hexagon; each hexagon
 * spans four, and each row starts three tracks below the last, so the rows interlock (no negative margins). Each child
 * is placed in a cell that's two columns wide; give it .shape-hexagon (or anything with the hexagon's proportions).
 * @param {number} [perRow=5] - Hexagons a row; every other row starts half a hexagon in.
 * @param {number[][]} [at] - Instead of rows: [row, column] for each child, column in half hexagons from the left
 *   (e.g. a flower: [[0,1],[0,3],[1,0],[1,2],[1,4],[2,1],[2,3]]).
 * @param {number} [gap=.94] - Each hexagon's scale in its cell: the gap between them.
 */
const HexGrid = ({ perRow = 5, at, gap = .94, className, style, children }) => {
  const items = Children.toArray(children);
  const place = (i) => at ? at[i] : [ Math.floor(i / perRow), (i % perRow) * 2 + Math.floor(i / perRow) % 2 ];
  const cols = at ? Math.max(...at.map(([ , c ]) => c)) + 2 : perRow * 2 + 1;
  return (
    <div className={cx('grid fixed gap-0', className)} style={{ '--cols': cols, gridAutoRows: '1fr', ...style }}>
      {items.map((child, i) => {
        const [ row, col ] = place(i);
        return (
          <div key={child.key ?? i} className="grid" style={{ gridRow: `${row * 3 + 1} / span 4`, gridColumn: `${col + 1} / span 2`, scale: gap }}>
            {child}
          </div>
        );
      })}
    </div>
  );
}

/**
 * HexFlip: a hexagon that turns over on hover or focus, front to back (a card flip in 3D).
 * @param {React.ReactNode} front @param {React.ReactNode} back
 * @param {string} [frontClass='bg-gradient'] @param {string} [backClass='bg-primary-darker'] - Their colors.
 */
const HexFlip = ({ front, back, frontClass = 'bg-gradient', backClass = 'bg-primary-darker', label }) => {
  const [ flipped, setFlipped ] = useState(false);
  const face = { backfaceVisibility: 'hidden', gridArea: '1 / 1' };
  return (
    <div className="grid" tabIndex={0} aria-label={label} onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)}
      style={{ transformStyle: 'preserve-3d', transform: `perspective(40rem) rotateY(${flipped ? 180 : 0}deg)`,
        transition: 'transform var(--duration-slow) ease-in-out', cursor: 'pointer' }}>
      <div className={cx('shape-hexagon col-center text-center', frontClass)} style={face}>{front}</div>
      <div className={cx('shape-hexagon col-center text-center pad-x-sm', backClass)} style={{ ...face, transform: 'rotateY(180deg)' }}>{back}</div>
    </div>
  );
}

/**
 * HexWall: a team or skills wall: a honeycomb of HexFlips, each showing an icon (or initials) and turning over to
 * the name and role.
 * @param {{ name: string, role?: string, icon?: string, initials?: string }[]} people
 * @param {number} [perRow=4]
 */
const HexWall = ({ people, perRow = 4, className, style }) => (
  <HexGrid perRow={perRow} className={className} style={style}>
    {people.map((p, i) => (
      <HexFlip key={p.name} label={`${p.name}${p.role ? `, ${p.role}` : ''}`}
        frontClass={[ 'bg-gradient', 'bg-primary', 'bg-secondary', 'bg-gradient-darker' ][i % 4]}
        front={p.icon ? <Icon name={p.icon} className="fs-lg" /> : <strong className="fs-lg">{p.initials}</strong>}
        back={<><strong>{p.name}</strong>{p.role && <small className="opacity-75">{p.role}</small>}</>} />
    ))}
  </HexGrid>
);

/**
 * Timeline: events down a gradient line, each marked by a hexagon with its icon and told in a card that points at it.
 * @param {{ date: string, title: string, text?: React.ReactNode, icon?: string }[]} events
 */
const Timeline = ({ events, className, style }) => (
  <ol className={cx('grid cols-1 gap-0', className)} style={{ margin: 0, padding: 0, listStyle: 'none', ...style }}>
    {events.map((e, i) => (
      <li key={i} className="grid gap-0" style={{ gridTemplateColumns: '2.5rem auto minmax(0, 1fr)' }}>
        {/* The line (the full height of the row, so the rows join up) with the marker over it. */}
        <div className="stack">
          <div className="bg-gradient h-100" style={{ width: '2px', justifySelf: 'center',
            ...(i === 0 && { marginTop: '1.25rem' }), ...(i === events.length - 1 && { height: '1.25rem' }) }} />
          <div className="shape-hexagon bg-gradient col-center self-start" style={{ width: '2.5rem' }}>
            <Icon name={e.icon ?? 'circle'} style={{ fontSize: '.8em' }} />
          </div>
        </div>
        <div className="shape-triangle-left self-start" style={{ width: '.75rem', marginTop: '.85rem', marginLeft: '.5rem', background: TINT }} />
        <div className="round pad grid cols-1 gap-0" style={{ marginBottom: 'var(--space)', background: TINT }}>
          <small className="text-primary fw-bold">{e.date}</small>
          <strong>{e.title}</strong>
          {e.text && <p className="opacity-75">{e.text}</p>}
        </div>
      </li>
    ))}
  </ol>
);

/**
 * TicketCard: a card shaped as a ticket (.shape-ticket, notches at mid-height), split by a dashed tear line: the top
 * half has a small label, a big title, a note and the action; the bottom half a list. A pricing plan, an event pass,
 * a feature, a coupon… ribbon adds a corner ribbon with any text.
 * @param {Object} props
 * @param {string} [props.label] - Small, uppercase, above the title (a plan name, a date, a category).
 * @param {React.ReactNode} props.title - The big line (a price, an event name, a number).
 * @param {React.ReactNode} [props.note] - Small, after the title ("a month", a place).
 * @param {(string|{ icon: string, text: string })[]} [props.items] - The list under the tear line; a string gets a
 *   check icon.
 * @param {React.ReactNode} [props.action] - e.g. a <Button>.
 * @param {string} [props.ribbon] - Corner ribbon text ("Popular", "Sold out", "New").
 */
const TicketCard = ({ label, title, note, items = [], action, ribbon, className }) => (
  <div className={cx('stack hover-float', className)}>
    <div className="shape-ticket grid cols-1 gap-0" style={{ aspectRatio: 'auto', '--notch': '1rem', gridTemplateRows: '1fr 1fr', background: TINT }}>
      {/* Two equal rows, so the tear line between them runs between the notches. */}
      <div className="grid cols-1 gap-sm pad text-center" style={{ alignContent: 'center', borderBottom: '2px dashed var(--border-color)' }}>
        {label && <strong className="text-uppercase opacity-75">{label}</strong>}
        <div><span className="display text-primary fw-bold">{title}</span>{note && <small className="opacity-75"> {note}</small>}</div>
        {action}
      </div>
      <ul className="grid cols-1 gap-sm pad" style={{ alignContent: 'center' }}>
        {items.map(item => {
          const { icon, text } = typeof item === 'string' ? { icon: 'check', text: item } : item;
          return <li key={text} className="grid auto-cols gap-sm items-center"><Icon name={icon} className="text-secondary" />{text}</li>;
        })}
      </ul>
    </div>
    {ribbon && (
      <span className="shape-ribbon bg-gradient col-center fw-bold fs-sm self-start"
        style={{ justifySelf: 'end', aspectRatio: 'auto', padding: '.3rem 1.5rem', marginTop: '1rem' }}>{ribbon}</span>
    )}
  </div>
);

/**
 * StatCard: a number that matters, with an icon and a label. No background of its own: put a group of them in a
 * .bg-gradient-run grid (colors.css) and one gradient runs through them all, or give each a bg-* class.
 * @param {Object} props
 * @param {string} props.icon @param {React.ReactNode} props.value @param {string} props.label
 * @param {string} [props.className]
 */
const StatCard = ({ icon, value, label, className }) => (
  <div className={cx('round shadow pad grid cols-1 gap-0 hover-grow', className)} style={{ minHeight: '7rem', color: 'var(--light)' }}>
    <Icon name={icon} className="fs-lg" />
    <strong className="display-sm">{value}</strong>
    <small className="text-truncate" style={{ opacity: .85 }}>{label}</small>
  </div>
);

export { HexGrid, HexFlip, HexWall, Timeline, TicketCard, StatCard };

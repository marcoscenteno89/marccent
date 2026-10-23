'use client';
// Design styles in the browser: a button that widens into a select for small spaces, and the footer's showcase of
// every style as a card that previews it (its own data-design: the style's type, corners and depth) with a button to
// use it. The styles are all loaded (styles/designs.css); the one in use is data-design on <html> (core.js), or on a
// section with a style of its own (section scope, the mini editor).
import { withT } from './hoc';
import { Icon } from '@/components/ui/icon';
import { cx } from '@/lib/cx';
import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/widgets/carousel';
import { DESIGNS, DEFAULT_DESIGN, designTitle } from '@/lib/design';

const OPTIONS = [ ...DESIGNS, { name: 'none', title: 'Plain', description: 'No design style: the theme on its own.' } ];

/**
 * DesignExpand: the design style as an icon button that widens into a select on hover (hover-expand, the select as
 * its label; :focus-within keeps it open while the select is in use). For tight rows (the mini editor). A div, not a
 * <button>: a select can't sit inside a button. The select's own box is cleared so it reads as the button's label.
 * @param {string} [className]
 */
const DesignExpand = ({ theme, update, className }) => {
  const current = theme.value('design') ?? DEFAULT_DESIGN;
  return (
    <div className={cx('btn hover-expand', className)} title={`Design style: ${designTitle(current)}`}>
      <Icon name="swatchbook" className="btn-icon" />
      <select className="btn-text" aria-label="Design style" value={current} onChange={(e) => update({ design: e.target.value })}
        style={{ background: 'none', border: 0, color: 'inherit', font: 'inherit', cursor: 'pointer' }}>
        {OPTIONS.map(d => <option key={d.name} value={d.name}>{d.title}</option>)}
      </select>
    </div>
  );
};

// One style as a card, in that style: its name as a heading, what it is, a sample button that uses it. Two layers:
// the outer one sets the style (its variables), the card inside the mode, so a style's light / dark page colors
// (written for a [data-theme] inside it) apply and the text takes them (color: --body-color).
const DesignCard = ({ design, active, dark, use }) => (
  <div data-design={design.name} className="grid h-100">
    <article data-theme={dark ? 'dark' : 'light'} className="bg border round shadow pad grid cols-1 gap-sm h-100 hover-holographic"
      style={{ gridTemplateRows: 'auto 1fr auto', color: 'var(--body-color)' }}>
      <h3 className="h5">{design.title}</h3>
      <p className="fs-sm opacity-75" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {design.description}
      </p>
      <Button icon={active ? 'check' : 'swatchbook'} className={active ? 'success w-100' : 'primary w-100'} aria-pressed={active} onClick={use}>
        {active ? 'In use' : 'Use'}
      </Button>
    </article>
  </div>
);

/** DesignCards: every style as a card in a carousel, the one in use first marked. */
const DesignCards = ({ theme, update }) => {
  const current = theme.value('design') ?? DEFAULT_DESIGN;
  return (
    <div className="grid cols-1 gap-sm">
      <h2 className="h6 text-uppercase opacity-75">Design style: {designTitle(current)}</h2>
      <Carousel slideWidth="15rem" label="Design styles">
        {OPTIONS.map(d => <DesignCard key={d.name} design={d} active={d.name === current} dark={theme.is_dark} use={() => update({ design: d.name })} />)}
      </Carousel>
    </div>
  );
};

const DesignCardsWT = withT(DesignCards);

export { DesignExpand, DesignCardsWT };

/*
 * Section theming: the theme controls in section scope (Theme.scope, lib/singleton.js) change one section of a page
 * instead of the whole site. Plain JS; components/theme/scope.js is the thin React part.
 *
 * A section is a top-level <section> in <main> (not one inside another), keyed by the page's path and its id, or its
 * place on the page: "/about#contact", "/#section-3". Its overrides ({ active, is_dark, glass, design }) are applied the way the
 * landing pages' Page does it (app/landing/blocks.js): the theme colors and their shades set on the section, plus
 * data-theme, so the page colors in defaults.css (text, surfaces, borders, links) are worked out again inside it. Only
 * existing variables; no CSS of its own. Whatever it changes on an element it remembers, and puts back on reset.
 */

const sectionsOf = (root = document) => [ ...root.querySelectorAll('main section') ].filter(s => !s.parentElement.closest('main section'));
const keyOf = (el, i, path) => `${path}#${el.id || `section-${i + 1}`}`;

// The key of the top-level section just before the one holding el (a mini editor sits right under the section it
// edits), and that section; null when there is none.
const sectionAbove = (el, path = location.pathname) => {
  const list = sectionsOf();
  const i = list.findIndex(s => s.contains(el));
  return i > 0 ? { key: keyOf(list[i - 1], i - 1, path), el: list[i - 1] } : null;
};

// A name for the toast: the section's first heading, or its key.
const labelOf = (el, key) => el.querySelector('h1, h2, h3')?.textContent.trim().slice(0, 60) || key;

// The derived shades the theme writes on :root (components/theme/core.js, defaults.css), so they must be written again
// on the section to follow its colors.
const shade = (color, side) => (color[side]?.[1] ?? color[side]?.at(-1) ?? color).hex;
const paletteVars = (p) => ({
  '--primary': p.primary.hex,
  '--primary-lighter': shade(p.primary, 'lighter'),
  '--primary-darker': shade(p.primary, 'darker'),
  '--secondary': p.secondary.hex,
  '--secondary-lighter': shade(p.secondary, 'lighter'),
  '--secondary-darker': shade(p.secondary, 'darker'),
  '--gradient': 'linear-gradient(to right, var(--primary), var(--secondary))',
  '--gradient-lighter': 'linear-gradient(to right, var(--primary-lighter), var(--secondary-lighter))',
  '--gradient-darker': 'linear-gradient(to right, var(--primary-darker), var(--secondary-darker))',
});

// What we changed on each element, to put it back: { style: { prop: oldValue }, attrs: { name: oldValue|null }, glass }.
const saved = new WeakMap();
const remember = (el) => saved.get(el) ?? (saved.set(el, { style: {}, attrs: {}, glass: false }), saved.get(el));
const setStyle = (el, prop, value) => {
  const s = remember(el);
  if (!(prop in s.style)) s.style[prop] = el.style.getPropertyValue(prop);
  el.style.setProperty(prop, value);
};
const setAttr = (el, name, value) => {
  const s = remember(el);
  if (!(name in s.attrs)) s.attrs[name] = el.getAttribute(name);
  el.setAttribute(name, value);
};
const restore = (el) => {
  const s = saved.get(el);
  if (!s) return;
  for (const [ prop, v ] of Object.entries(s.style)) v ? el.style.setProperty(prop, v) : el.style.removeProperty(prop);
  for (const [ name, v ] of Object.entries(s.attrs)) v == null ? el.removeAttribute(name) : el.setAttribute(name, v);
  if (s.glass) el.classList.remove('glass');
  saved.delete(el);
};

// The section's background shows the page color when it has none of its own (a Box, a plain wrap), so a mode switch
// changes the whole band, not just the text on it.
const transparent = (el) => {
  const cs = getComputedStyle(el);
  return cs.backgroundImage === 'none' && /rgba?\(.*,\s*0\)$|transparent/.test(cs.backgroundColor);
};

/**
 * applySections: puts each section's overrides on the page (and takes away those that were reset), and marks the
 * target section while the visitor is choosing in section scope.
 * @param {Object} theme - The Theme (lib/singleton.js). @param {string} path - The page's path (usePathname).
 */
// What a section looks like now, so a pass that would change nothing changes nothing (re-applying would restart its
// canvases, whose new elements would set off the page watcher again).
const applied = new WeakMap();

const applySections = (theme, path) => {
  if (!theme) return;
  sectionsOf().forEach((el, i) => {
    const key = keyOf(el, i, path);
    const o = theme.sections?.[key];
    const marked = theme.scope === 'section' && theme.target === key;
    const palette = o && (theme.themeList[o.active ?? theme.active] ?? theme.themeList[theme.active]);
    const sig = JSON.stringify([ o, marked, palette?.primary.hex, palette?.secondary.hex, theme.is_dark, theme.glass ]);
    if (applied.get(el) === sig) {
      // Unchanged; only canvases added since (a client render) still need the section's colors.
      if (o?.active != null) el.querySelectorAll('[data-canvas]:not([data-canvas-colors])').forEach(c =>
        setAttr(c, 'data-canvas-colors', `${palette.primary.hex}, ${palette.secondary.hex}`));
      return;
    }
    applied.set(el, sig);
    el.querySelectorAll('[data-canvas]').forEach(restore);
    restore(el);
    if (marked) {
      setStyle(el, 'outline', '2px dashed var(--primary)');
      setStyle(el, 'outline-offset', '-2px');
    }
    if (!o || !Object.keys(o).length) return;

    const bare = transparent(el);
    for (const [ prop, v ] of Object.entries(paletteVars(palette))) setStyle(el, prop, v);
    setAttr(el, 'data-theme', (o.is_dark ?? theme.is_dark) ? 'dark' : 'light');
    // Its own design style (styles/designs.css: each style stops where another one starts).
    if (o.design) setAttr(el, 'data-design', o.design);
    setStyle(el, 'color', 'var(--body-color)');
    if (bare) setStyle(el, 'background-color', 'var(--body-bg)');
    // Glass: on adds .glass (colors.css: its .bg panels turn frosted); off while the site has it makes them solid.
    const glass = o.glass ?? theme.glass;
    if (glass && !el.classList.contains('glass')) { el.classList.add('glass'); remember(el).glass = true; }
    if (!glass && theme.glass) { setStyle(el, '--glass-opacity', '1'); setStyle(el, '--glass-blur', '0px'); }
    // Canvas animations draw in the theme colors unless told otherwise: tell them the section's (canvas-scanner.js).
    if (o.active != null) el.querySelectorAll('[data-canvas]:not([data-canvas-colors])').forEach(c =>
      setAttr(c, 'data-canvas-colors', `${palette.primary.hex}, ${palette.secondary.hex}`));
  });
};

/**
 * SectionPicker: while on, the section under the pointer is outlined and a click picks it (onPick(key, label)) instead of
 * doing what the click would. Escape stops it. start() / stop(); stop() also on destroy.
 */
class SectionPicker {
  constructor(onPick) {
    this.onPick = onPick;
    this.hovered = null;
    this.over = (e) => this.hover(sectionsOf().find(s => s.contains(e.target)) ?? null);
    this.click = (e) => {
      const el = sectionsOf().find(s => s.contains(e.target));
      if (!el) return; // outside the page's sections (header, footer): carry on as normal
      e.preventDefault();
      e.stopPropagation();
      const i = sectionsOf().indexOf(el);
      const key = keyOf(el, i, location.pathname);
      this.stop();
      this.onPick(key, labelOf(el, key));
    };
    this.key = (e) => e.key === 'Escape' && this.stop();
  }

  hover(el) {
    if (el === this.hovered) return;
    if (this.hovered) { this.hovered.style.removeProperty('box-shadow'); this.hovered.style.removeProperty('cursor'); }
    this.hovered = el;
    if (el) { el.style.setProperty('box-shadow', 'inset 0 0 0 3px var(--primary)'); el.style.setProperty('cursor', 'crosshair'); }
  }

  start() {
    if (this.on) return;
    this.on = true;
    document.addEventListener('mouseover', this.over);
    document.addEventListener('click', this.click, true); // capture: before links and buttons in the section
    document.addEventListener('keydown', this.key);
  }

  stop() {
    if (!this.on) return;
    this.on = false;
    this.hover(null);
    document.removeEventListener('mouseover', this.over);
    document.removeEventListener('click', this.click, true);
    document.removeEventListener('keydown', this.key);
  }
}

export { applySections, SectionPicker, sectionsOf, sectionAbove };

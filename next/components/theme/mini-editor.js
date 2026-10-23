'use client';
// Mini theme editor: the theme controls in one line, for the section right above it only (whatever the scope of the
// full editor in the header and footer). Design style, mode, glass, the color cards and a reset. The logic is the
// Theme class (lib/singleton.js: updateSection) and lib/section-theme.js; this is the thin React part.
import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext, ToastContext } from '@/lib/context';
import { sectionAbove } from '@/lib/section-theme';
import { Button } from '@/components/ui/button';
import { ThemeMode, GlassMode } from './toggles';
import { Swatches } from './swatches';
import { DesignExpand } from './designs';

/**
 * MiniThemeEditor: put it in its own short section (a Box) right under the section it edits. A third of the section
 * for the text, two thirds for the controls (layout-1-2, side by side from 40rem, stacked below), the controls one
 * .row-wrap that wraps item by item rather than squeeze; the design style is a button that widens into a select.
 * site: the same controls for the whole site instead (whatever the full editor's scope), and with no title just the
 * row of controls, to sit inside a section (the home page's "Try it now").
 * @param {React.ReactNode} [props.title] @param {React.ReactNode} [props.text] @param {boolean} [props.site]
 */
const MiniThemeEditor = ({ title, text, site }) => {
  const { theme, setTheme } = useContext(ThemeContext) ?? {};
  const { toast, setToast } = useContext(ToastContext) ?? {};
  const box = useRef(null);
  const [ target, setTarget ] = useState(null); // { key, el } of the section above, once mounted

  useEffect(() => { if (!site) setTarget(sectionAbove(box.current)); }, [ site ]);

  // The theme as these controls see it: the section's own settings, else the site's.
  const view = theme && (site ? Object.assign(Object.create(Object.getPrototypeOf(theme)), theme, { value: (k) => theme[k] }) : target && Object.assign(Object.create(Object.getPrototypeOf(theme)), theme, {
    value: (k) => theme.sections[target.key]?.[k] ?? theme[k],
  }));
  const say = (msg, tone = 'success') => toast && setToast(toast.add(msg, tone));
  // Site: straight onto the theme, so the header's Section scope doesn't send it to a section.
  const update = (obj) => site
    ? (setTheme(Object.assign(theme, obj).save()), say('Site updated'))
    : (setTheme(theme.updateSection(target.key, obj)), say('Section updated'));
  const reset = () => site
    ? (setTheme(theme.reset()), say('Theme reset to the defaults'))
    : (setTheme(theme.resetSections({ key: target.key })), say('Section reset to the site theme'));
  // A ring round the section being edited while the pointer is on the editor.
  const mark = (on) => !site && target?.el.style[on ? 'setProperty' : 'removeProperty']('box-shadow', 'inset 0 0 0 3px var(--primary)');

  // One row-wrap for every control, the color squares included: one line until it runs out of room, then each wraps
  // on its own. A tighter gap than usual, so the row fits two thirds of a section.
  const controls = view && (
    <div className="row-wrap" role="group" aria-label={site ? 'Site theme' : 'Section theme'} style={{ '--gap': 'var(--space-xs)' }}>
      <DesignExpand theme={view} update={update} />
      <ThemeMode theme={view} update={update} className="hover-expand" />
      <GlassMode theme={view} update={update} className="hover-expand" />
      <Swatches theme={view} update={update} bare />
      <Button icon="rotate-left" className="hover-expand" onClick={reset}
        title={site ? 'Put the whole site back to the default theme' : 'Put this section back to the site theme'}>Reset</Button>
    </div>
  );

  if (site && !title) return controls;
  return (
    <div ref={box} className="grid gap-lg items-center layout-1-2"
      onPointerEnter={() => mark(true)} onPointerLeave={() => mark(false)}>
      <div className="grid cols-1 gap-0">
        <strong>{!site && <i className="fa-solid fa-arrow-up text-primary" aria-hidden="true"></i>} {title}</strong>
        {text && <small className="opacity-75">{text}</small>}
      </div>
      {controls && <div className="grid cols-1 justify-end">{controls}</div>}
    </div>
  );
};

export { MiniThemeEditor };

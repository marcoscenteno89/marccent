'use client';
// Theme scope: whether the theme controls (toggles.js, the footer theme cards in slider.js) change the whole site or
// one section of the page. The logic is plain JS in lib/section-theme.js; these are its React mounts.
import { useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeContext, ToastContext } from '@/lib/context';
import { applySections, SectionPicker } from '@/lib/section-theme';
import { Button } from '@/components/ui/button';
import { withT } from './hoc';

/**
 * Scope: the scope switch (Site / Section), in section scope Pick (choose a section, then the controls change only
 * it), and Reset: in site scope everything back to the defaults (Theme.reset); in section scope the picked section back
 * to the site's theme (with none picked, every section on this page). Renders two or three buttons, each a grid item.
 * @param {string} [className] - On every button (hover-expand).
 */
const Scope = ({ theme, setTheme, className }) => {
  const { toast, setToast } = useContext(ToastContext);
  const path = usePathname();
  const latest = useRef(theme);
  latest.current = theme;
  const say = (msg, tone = 'info') => setToast(toast.add(msg, tone));
  const picker = useRef(null);
  if (!picker.current && typeof window !== 'undefined') {
    picker.current = new SectionPicker((key, label) => {
      setTheme(latest.current.update({ target: key }));
      say(`Theming "${label}": use the mode, glass and theme cards`, 'success');
    });
  }
  const section = theme.scope === 'section';

  // A new page has its own sections: the picked one doesn't carry over.
  useEffect(() => {
    if (latest.current.target && !latest.current.target.startsWith(`${path}#`)) setTheme(latest.current.update({ target: null }));
  }, [ path ]);
  useEffect(() => () => picker.current?.stop(), []);

  const pick = () => { picker.current.start(); say('Click a section to theme it (Esc to cancel)'); };
  const toggle = () => {
    if (section) { picker.current.stop(); setTheme(theme.update({ scope: 'global', target: null })); say('Theme controls: whole site'); }
    else { setTheme(theme.update({ scope: 'section', target: null })); pick(); }
  };
  const reset = () => {
    if (!section) { picker.current?.stop(); setTheme(theme.reset()); say('Theme reset to the defaults', 'success'); return; }
    setTheme(theme.target ? theme.resetSections({ key: theme.target }) : theme.resetSections({ prefix: `${path}#` }));
    say(theme.target ? 'Section reset to the site theme' : 'Every section on this page reset', 'success');
  };

  return (
    <>
      <Button icon={section ? 'crop-simple' : 'globe'} className={className} aria-pressed={section}
        title={section ? 'Theme controls change one section: switch to the whole site' : 'Theme controls change the whole site: switch to one section'}
        onClick={toggle}>{section ? 'Section' : 'Site'}</Button>
      {section && <Button icon="crosshairs" className={className} title="Pick a section to theme" onClick={pick}>Pick</Button>}
      <Button icon="rotate-left" className={className}
        title={!section ? 'Put the whole theme back to the defaults' : theme.target ? 'Put this section back to the site theme' : 'Put every section on this page back to the site theme'}
        onClick={reset}>Reset</Button>
    </>
  );
};

/**
 * SectionThemes: applies the sections' overrides to the page whenever the theme or the page changes, or the page's
 * content does (a client navigation that streams in). Renders nothing; mount once (layout.tsx).
 */
const SectionThemes = () => {
  const { theme } = useContext(ThemeContext) ?? {};
  const path = usePathname();
  useEffect(() => {
    if (!theme) return;
    applySections(theme, path);
    const main = document.querySelector('main');
    if (!main) return;
    let frame;
    const mo = new MutationObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => applySections(theme, path)); });
    mo.observe(main, { childList: true, subtree: true });
    return () => { mo.disconnect(); cancelAnimationFrame(frame); };
  }, [ theme, path ]);
  return null;
};

const ScopeWT = withT(Scope);

export { ScopeWT, SectionThemes };

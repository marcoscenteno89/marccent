"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MiniThemeEditor } from 'marccent-theme/components/theme/mini-editor';
import { Button } from 'marccent-theme/components/ui/button';
import { Menu, main, social, externalProps } from './menus';
import { ThemeLogo } from '@/components/brand/theme-logo';
import 'marccent-theme/styles/components/menu.css';
import 'marccent-theme/styles/components/nav.css';

// Layout only: layout.css classes; menu look lives in styles/components/menu.css.
// Narrow (below 56rem, the body's width): brand at the start, the menu toggle and the theme button together at the
// right end of one row; the toggle opens the
// main menu (stacked) and the social icons below them. From 56rem: one row, brand and menu at the start, social icons
// and the theme button (col-last) at the end, empty space between; the toggle hides and .nav-collapse steps aside
// (display: contents). Look: the .nav component (styles/components/nav.css).
// The theme button pulls down the whole site's mini theme editor (just its controls, at the end) above the bar, at the very top of the page: it's
// inside the sticky header, so it pushes the bar down and stays with it while scrolling; it slides down and up
// (.collapse). Escape closes it.
export default function Header() {
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu
  const [themeOpen, setThemeOpen] = useState(false); // the theme editor above the bar
  const panel = useRef<HTMLDivElement>(null);

  // The closed theme editor is inert: out of the tab order and hidden from screen readers. Set on the element, since
  // React 18 doesn't know the inert attribute.
  useEffect(() => { if (panel.current) panel.current.inert = !themeOpen; }, [themeOpen]);

  // Menu dropdowns are <details>; close them and the mobile menu after navigating.
  useEffect(() => {
    header.current?.querySelectorAll('details[open]').forEach(d => d.removeAttribute('open'));
    setOpen(false);
  }, [pathname]);

  // A click anywhere outside an open dropdown closes it, so opening another one closes the first; Escape closes all.
  // click, not pointerdown: on mobile an open dropdown pushes the menu down, and closing it on press would move the
  // next summary out from under the finger before the click lands.
  useEffect(() => {
    const closeOutside = (event: MouseEvent) => header.current?.querySelectorAll('details[open]').forEach(d => {
      if (!d.contains(event.target as Node)) d.removeAttribute('open');
    });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      header.current?.querySelectorAll('details[open]').forEach(d => d.removeAttribute('open'));
      setThemeOpen(false);
    };
    document.addEventListener('click', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('click', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    // The bar (.nav, background, line) spans the screen; the inner .wrap caps its content at --wrap-max (pad-0: the
    // outer wrap already gives the side padding). A 1-column grid: the theme editor, when open, is the row above the bar.
    <header ref={header} className={`nav wrap wrap-fluid pad-sm bg border-bottom sticky-top grid cols-1 gap-sm${open ? ' open' : ''}${themeOpen ? ' divide' : ''}`}>
      {/* Not a .wrap itself (nav.css lays out .nav > .wrap as the bar); the .wrap inside caps its width. */}
      {/* Always rendered so it can slide shut too (.collapse, the theme's animations.css); inert while closed, so
          its controls are out of the tab order. Padding on the innermost box, so it closes all the way. The line under it
          is .divide on the header, only while open (on the panel itself it would stay when shut). */}
      <div id="theme-panel" className={`collapse${themeOpen ? ' open' : ''}`} ref={panel}>
        <div>
          <div className="pad-y-sm">
            <div className="wrap pad-0 grid cols-1 justify-end"><MiniThemeEditor scope="site" /></div>
          </div>
        </div>
      </div>
      <div className="wrap pad-0 grid layout-ends items-center gap-sm">
        <Link href="/" className="menu-link" aria-label="Marccent, home"><ThemeLogo height="2rem" style={{ maxWidth: '100%' }} /></Link>
        <Button
          icon={open ? 'xmark' : 'bars-staggered'}
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)} />
        <div id="site-nav" className="nav-collapse">
          {/* auto-cols: each item is its text plus the link padding (not equal columns as wide as the longest). */}
          <Menu items={main} label="Main" layout="auto-cols" gap="gap-0" className="divide"/>
          {/* Social links as icon buttons that widen to show their name on hover (hover-expand). */}
          <nav aria-label="Social" className="nav-end grid auto-cols items-center gap-sm">
            {social.map(s => (
              <Button key={s.href} icon={s.icon} href={s.href} className="secondary hover-expand" {...externalProps(s)}>{s.name}</Button>
            ))}
          </nav>
        </div>
        {/* The theme button stays in the header row at every width, outside the collapsing menu, at the end
            (col-last). hover-expand: the icon at rest, the label on hover. */}
        <Button
          icon={themeOpen ? 'xmark' : 'brush'}
          className="hover-expand col-last"
          aria-expanded={themeOpen}
          aria-controls="theme-panel"
          onClick={() => setThemeOpen(!themeOpen)}>
          Theme
        </Button>
      </div>
    </header>
  );
};

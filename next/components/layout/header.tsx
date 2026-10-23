"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ModeToggle, GlassToggle, ThemeReset } from 'marccent-theme/components/theme/toggles';
import { Button } from 'marccent-theme/components/ui/button';
import { Menu, main, social, externalProps } from './menus';
import { ThemeLogo } from '@/components/brand/theme-logo';
import 'marccent-theme/styles/components/menu.css';
import 'marccent-theme/styles/components/nav.css';

// Layout only: layout.css classes; menu look lives in styles/components/menu.css.
// Narrow (below 56rem, the body's width): brand at the start, the menu toggle and the theme tools together at the
// right end of one row; the toggle opens the
// main menu (stacked) and the social icons below them. From 56rem: one row, brand and menu at the start, social icons
// and theme tools (col-last) at the end, empty space between; the toggle hides and .nav-collapse steps aside
// (display: contents). Look: the .nav component (styles/components/nav.css).
export default function Header() {
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu

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
      if (event.key === 'Escape') header.current?.querySelectorAll('details[open]').forEach(d => d.removeAttribute('open'));
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
    // outer wrap already gives the side padding).
    <header ref={header} className={`nav wrap wrap-fluid pad-y-sm bg border-bottom sticky-top${open ? ' open' : ''}`}>
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
          <Menu items={main} label="Main" layout="auto-cols" className="divide"/>
          {/* Social links as icon buttons that widen to show their name on hover (hover-expand). */}
          <nav aria-label="Social" className="nav-end grid auto-cols items-center gap-sm">
            {social.map(s => (
              <Button key={s.href} icon={s.icon} href={s.href} className="secondary hover-expand" {...externalProps(s)}>{s.name}</Button>
            ))}
          </nav>
        </div>
        {/* Theme tools stay in the header row at every width, outside the collapsing menu: one grid item, at the
            end (col-last), the buttons side by side with only the gap between them. hover-expand: icons at rest, the
            label shows on hover (so no .icon-only-* needed). */}
        <div className="grid auto-cols items-center gap-sm col-last">
          {/* The whole site's quick tools: reset, glass, mode; Theme jumps to the full editor in the footer. */}
          <ThemeReset className="hover-expand"/>
          <GlassToggle className="hover-expand"/>
          <ModeToggle className="hover-expand"/>
          <Button icon="brush" href="#footer" className="hover-expand">Theme</Button>
        </div>
      </div>
    </header>
  );
};

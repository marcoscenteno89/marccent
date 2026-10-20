"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeModeWT, GlassModeWT } from '../components/client/theme-toggles';
import { Button } from '@/components/server/component';
import { Menu, main, social } from './menus';

// Layout only: grid.css classes; menu look lives in styles/components.css.
// Narrow (below 56rem, the body's width): brand at the start, the menu toggle and the theme tools together at the
// right end of one row; the toggle opens the
// main menu (stacked) and the social icons below them. From 56rem: one row, brand and menu at the start, social icons
// and theme tools (col-last) at the end, empty space between; the toggle hides and .nav-collapse steps aside
// (display: contents). Look: MOBILE NAV in custom.css.
export default function Header() {
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu

  // Menu dropdowns are <details>; close them and the mobile menu after navigating.
  useEffect(() => {
    header.current?.querySelectorAll('details[open]').forEach(d => d.removeAttribute('open'));
    setOpen(false);
  }, [pathname]);

  return (
    <header ref={header} className={`site-header wrap wrap-fluid pad-y-sm bg border-bottom sticky-md-top grid layout-ends items-center gap-sm${open ? ' open' : ''}`}>
      <Link href="/" className="menu-link fs-lg fw-bold">Marccent</Link>
      <Button
        icon={open ? 'xmark' : 'bars-staggered'}
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen(!open)} />
      <div id="site-nav" className="nav-collapse">
        <Menu items={main} label="Main" className="divide"/>
        <Menu items={social} label="Social" iconOnly layout="auto-cols cols-center" className="divide nav-social"/>
      </div>
      {/* Theme tools stay in the header row at every width, outside the collapsing menu: one grid item, at the
          end (col-last), the buttons side by side with only the gap between them. */}
      <div className="theme-tools grid auto-cols items-center gap-sm col-last icon-only-sm">
        <GlassModeWT/>
        <ThemeModeWT/>
        <Button icon="brush" href="#footer" className="outline-gradient">Theme</Button>
      </div>
    </header>
  );
};

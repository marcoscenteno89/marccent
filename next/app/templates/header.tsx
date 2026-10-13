"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ThemeModeWT, GlassModeWT } from '../components/client/theme';
import { Button } from '@/components/button';
import { Menu, main, social } from './menus';

// Layout only: grid.css classes; menu look lives in styles/components.css.
// Narrow: brand, main menu and tools stack as three rows. From 56rem: one row, brand and menu at the start, tools (col-last) at the end, empty space between.
export default function Header() {
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Menu dropdowns are <details>; close them after navigating.
  useEffect(() => {
    header.current?.querySelectorAll('details[open]').forEach(d => d.removeAttribute('open'));
  }, [pathname]);

  return (
    <header ref={header} className="cq bg border-bottom sticky-md-top">
      <div className="wrap wrap-fluid grid layout-ends items-center gap-2 pad">
        <Link href="/" className="menu-link fs-md fw-bold">Marccent</Link>
        <Menu items={main} label="Main" className="divide" />
        <div className="grid auto-cols items-center gap-2 col-last">
          <Menu items={social} label="Social" iconOnly className="divide" />
          <GlassModeWT />
          <ThemeModeWT />
          <Button icon="brush" href="#footer">Theme</Button>
        </div>
      </div>
    </header>
  );
};

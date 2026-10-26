"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MiniThemeEditor } from 'marccent-theme/components/theme/mini-editor';
import { Button } from 'marccent-theme/components/ui/button';
import { NavBar } from 'marccent-theme/components/widgets/navbar';
import { main, social, externalProps } from './menus';
import { ThemeLogo } from '@/components/brand/theme-logo';

// The site's header: the theme's NavBar (components/widgets/navbar.js: the bar, the menu toggle, closing dropdowns)
// with this site's parts in its slots. end: the social links, as icon buttons that widen to show their name on hover
// (hover-expand). last: the theme button, in the row at every width. top: the whole site's mini theme editor, which
// the theme button pulls down above the bar, at the very top of the page: it's inside the sticky header, so it pushes
// the bar down and stays with it while scrolling; it slides down and up (.collapse). Escape closes it.
export default function Header() {
  const pathname = usePathname();
  const [themeOpen, setThemeOpen] = useState(false); // the theme editor above the bar
  const panel = useRef<HTMLDivElement>(null);

  // The closed theme editor is inert: out of the tab order and hidden from screen readers. Set on the element, since
  // React 18 doesn't know the inert attribute.
  useEffect(() => { if (panel.current) panel.current.inert = !themeOpen; }, [themeOpen]);

  return (
    <NavBar
      items={main}
      path={pathname}
      onEscape={() => setThemeOpen(false)}
      // The line under the theme editor is .divide on the header, only while open (on the panel itself it would stay when shut).
      className={themeOpen ? 'divide' : undefined}
      brand={<Link href="/" className="menu-link" aria-label="Marccent, home"><ThemeLogo height="2rem" style={{ maxWidth: '100%' }} /></Link>}
      end={
        <nav aria-label="Social" className="nav-end grid auto-cols items-center gap-sm">
          {social.map(s => (
            <Button key={s.href} icon={s.icon} href={s.href} className="secondary hover-expand" {...externalProps(s)}>{s.name}</Button>
          ))}
        </nav>
      }
      last={
        // hover-expand: the icon at rest, the label on hover.
        <Button
          icon={themeOpen ? 'xmark' : 'brush'}
          className="hover-expand col-last"
          aria-expanded={themeOpen}
          aria-controls="theme-panel"
          onClick={() => setThemeOpen(!themeOpen)}>
          Theme
        </Button>
      }
      top={
        // Always rendered so it can slide shut too (.collapse, the theme's animations.css); inert while closed, so
        // its controls are out of the tab order. Padding on the innermost box, so it closes all the way.
        <div id="theme-panel" className={`collapse${themeOpen ? ' open' : ''}`} ref={panel}>
          <div>
            <div className="pad-y-sm">
              <div className="wrap pad-0 grid cols-1 justify-end"><MiniThemeEditor scope="site" /></div>
            </div>
          </div>
        </div>
      }
    />
  );
};

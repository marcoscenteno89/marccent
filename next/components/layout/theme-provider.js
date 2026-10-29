'use client';
// The theme wired to this site: ThemeProvider (marccent-theme/lib/context) with Next's path, so elements' own themes
// and the canvas backgrounds follow client navigation. layout.tsx is a server component, so the hook lives here.
// The theme's links (Button, Menu, the Dock) are next/link's, so they navigate on the client. The theme's messages go
// to its own toasts (the default notify).
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'marccent-theme/lib/context';

const SiteThemeProvider = ({ children }) => (
  <ThemeProvider path={usePathname()} link={Link}>{children}</ThemeProvider>
);

export { SiteThemeProvider };

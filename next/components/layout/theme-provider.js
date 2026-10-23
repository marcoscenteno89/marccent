'use client';
// The theme wired to this site: ThemeProvider (marccent-theme/lib/context) with Next's path, so elements' own themes
// and the canvas backgrounds follow client navigation. layout.tsx is a server component, so the hook lives here.
// The theme's messages go to its own toasts (the default notify).
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'marccent-theme/lib/context';

const SiteThemeProvider = ({ children }) => (
  <ThemeProvider path={usePathname()}>{children}</ThemeProvider>
);

export { SiteThemeProvider };

'use client';
// The theme wired to this site: ThemeProvider (lib/context.js) with Next's path, so elements' own themes follow
// client navigation, and the site's toasts for the theme's messages. layout.tsx is a server component, so the hook
// and the callback live here.
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/lib/context';
import { toastSI } from '@/lib/toasts';

const notify = (msg, tone) => toastSI.add(msg, tone);

const SiteThemeProvider = ({ children }) => (
  <ThemeProvider path={usePathname()} notify={notify}>{children}</ThemeProvider>
);

export { SiteThemeProvider };

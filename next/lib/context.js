'use client';
import { createContext, useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { themeSI } from '@/lib/singleton';

// The theme (lib/singleton.js) is one object changed in place: its methods save and emit, and ThemeProvider
// re-renders everything below it on the new version. { theme: null } until it has loaded. An effect that follows
// the theme lists theme?.version (the object itself never changes).
const ThemeContext = createContext(null);

const noop = () => () => {};
const silent = () => {};

/**
 * ThemeProvider: loads the theme and hands it down with what the theme needs from the app, so it works with any
 * router or toast system (components/layout/theme-provider.js passes the site's).
 * @param {string} [path] - The page's path: elements' own themes are saved per page. Defaults to location.pathname
 *   (pass it from the router so it follows client navigation).
 * @param {(msg: string, tone?: string) => void} [notify] - Called with a message when the theme changes (a toast).
 */
const ThemeProvider = ({ children, path, notify = silent }) => {
  const [theme, setTheme] = useState(null);
  useEffect(() => { themeSI().then(setTheme); }, []);
  const version = useSyncExternalStore(theme?.subscribe ?? noop, () => theme?.version ?? -1, () => -1);
  const page = path ?? (typeof location === 'undefined' ? '/' : location.pathname);
  const value = useMemo(() => ({ theme, version, path: page, notify }), [theme, version, page, notify]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext }

'use client';
import { createContext, useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { themeSI, toastSI } from '@/lib/singleton';

// The theme (lib/singleton.js) is one object changed in place: its methods save and emit, and ThemeProvider
// re-renders everything below it on the new version. { theme: null } until it has loaded. An effect that follows
// the theme lists theme?.version (the object itself never changes).
const ThemeContext = createContext(null);

const noop = () => () => {};

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(null);
  useEffect(() => { themeSI().then(setTheme); }, []);
  const version = useSyncExternalStore(theme?.subscribe ?? noop, () => theme?.version ?? -1, () => -1);
  const value = useMemo(() => ({ theme, version }), [theme, version]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// The toasts need no provider: add one with toastSI.add(msg, tone) from anywhere; only a component that shows
// them (components/ui/toast.js) subscribes, through useToasts.
const useToasts = () => {
  const version = () => toastSI.version;
  useSyncExternalStore(toastSI.subscribe, version, version);
  return toastSI;
};

export { ThemeProvider, ThemeContext, useToasts, toastSI }

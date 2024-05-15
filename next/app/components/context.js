'use client';
import { createContext, useState, useEffect } from 'react';
import { themeSI, toastSI } from '@/components/singleton';

// type ThemeInterface {
//   active: number;
//   animation: number;
//   rainbow: boolean;
//   is_dark: boolean;
//   glass: boolean;
//   dark: {};
//   light: {};
//   themeList: [];
// }

const ThemeContext = createContext(null);
const ToastContext = createContext(null);

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    (async () => setTheme(await themeSI()))();
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const ToastProvider = ({children}) => {
  const [toast, setToast] = useState(toastSI);
  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export { ThemeProvider, ThemeContext, ToastProvider, ToastContext }
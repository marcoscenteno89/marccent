'use client';
// Theme core: Body (puts the mode and glass on <body>) and UpdateThemeVariables (writes the palette on <html>).
// The parts people interact with live beside it: toggles.js (light/dark, glass, rainbow buttons) and slider.js
// (the footer theme cards); the canvas animations and their picker are in components/visuals/animations.js.
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/lib/context";
import { cx } from '@/lib/cx';
import { DEFAULT_DESIGN } from '@/lib/design';

const Body = (props) => {
  let { theme } = useContext(ThemeContext);
  if (!theme) theme = {};
  const is_dark = theme.is_dark ? 'dark' : 'light';
  return (
    <body className={cx(props.className, theme.glass && 'glass')} suppressHydrationWarning={true} data-theme={is_dark}>
      {props.children}
    </body>
  )  
}

// Applies the saved theme: writes the COLORS in styles/defaults.css (the only ones meant to be changed at runtime)
// on :root whenever the theme changes, from the same Color shades the canvas animations use. Renders nothing.
const UpdateThemeVariables = () => {
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement.style;
    for (const [ name, color ] of [[ 'primary', theme.primary() ], [ 'secondary', theme.secondary() ]]) {
      root.setProperty(`--${name}`, color.hex);
      // 2 of up to 5 steps lighter / darker. Very light or dark colors have fewer steps (util 2.0 skips
      // repeats; #fff has no lighter ones), so fall back to the last step, then the color itself.
      root.setProperty(`--${name}-lighter`, (color.lighter[1] ?? color.lighter.at(-1) ?? color).hex);
      root.setProperty(`--${name}-darker`, (color.darker[1] ?? color.darker.at(-1) ?? color).hex);
    }
    if (theme.dark) root.setProperty('--dark', theme.dark.hex);
    if (theme.light) root.setProperty('--light', theme.light.hex);
    // The design style (styles/designs.css is scoped by it); the server renders the default (layout.tsx).
    document.documentElement.dataset.design = theme.design ?? DEFAULT_DESIGN;
  }, [theme]);
  return null;
}

export { Body, UpdateThemeVariables }

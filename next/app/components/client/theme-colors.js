'use client'
import { useEffect, useContext } from "react";
import { ThemeContext } from "@/components/context";

// Applies the saved theme: writes the --mc-* color shades on :root whenever the theme changes. Renders nothing.
const ThemeColors = () => {
  const { theme } = useContext(ThemeContext);
  useEffect( () => {
    if (theme) {
      const pmode = theme.is_dark ? theme.primary().darker : theme.primary().lighter;
      const prev = theme.is_dark ? theme.primary().lighter : theme.primary().darker;

      const smode = theme.is_dark ? theme.secondary().darker : theme.secondary().lighter;
      const srev = theme.is_dark ? theme.secondary().lighter : theme.secondary().darker;

      const { r: pr, g: pg, b: pb } = pmode[0].rgb;
      const { r: sr, g: sg, b: sb } = smode[0].rgb;
      const root = document.querySelector(':root');

      root.style.setProperty('--mc-primary', pmode[0].hex);
      root.style.setProperty('--mc-primary-bg-subtle', pmode[1].hex);
      root.style.setProperty('--mc-primary-border-subtle', prev[0].hex);
      root.style.setProperty('--mc-primary-text-emphasis', prev[4].hex);
      root.style.setProperty('--mc-primary-rgb', `${pr}, ${pg}, ${pb}`);

      root.style.setProperty('--mc-accordion-active-bg', pmode[0].hex);

      root.style.setProperty('--mc-secondary', smode[0].hex);
      root.style.setProperty('--mc-secondary-bg-subtle', smode[1].hex);
      root.style.setProperty('--mc-secondary-border-subtle', srev[1].hex);
      root.style.setProperty('--mc-secondary-text-emphasis', srev[4].hex);
      root.style.setProperty('--mc-secondary-rgb', `${sr}, ${sg}, ${sb}`);
    }

  }, [theme]);

  return null;
}

export { ThemeColors }
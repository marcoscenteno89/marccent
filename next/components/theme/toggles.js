'use client';
// Theme toggles: buttons that flip one setting of the saved theme (light / dark, glass, rainbow).
// W = With, T = Theme (withT passes the theme and an update function).
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { withT } from "./hoc";

const RainbowMode = (props) => {
  const rainbow = props.theme.rainbow;
  return (
    <Button icon={['fa-solid', rainbow ? 'fa-wand-magic-sparkles' : 'fa-wand-magic', props.className].filter(Boolean).join(' ')} aria-label="Toggle rainbow mode" onClick={() => props.update({rainbow: !rainbow})} />
  )  
}

const ThemeMode = (props) => {
  const is_dark = props.theme.value('is_dark'); // the target section's in section scope (lib/singleton.js)
  return (
    <Button
      icon={is_dark ? 'sun' : 'moon'}
      className={[is_dark ? 'light' : 'dark', props.className].filter(Boolean).join(' ')} /* filled in the mode it switches to (colors.css) */
      onClick={() => props.update({is_dark: !is_dark})}>
      {is_dark ? 'Light' : 'Dark'}
    </Button>
  )  
}

// The glass toggle's own look, on no other button: a frosted pane (backdrop blur), a light sheen from the top-left,
// a bright top edge and a soft drop shadow; its hover-expand fill is a clear tint, the text stays the page color.
const GLASS = {
  background: 'radial-gradient(120% 90% at 25% 0%, rgb(255 255 255 / .45), transparent 55%), '
    + 'linear-gradient(135deg, color-mix(in srgb, var(--light) 25%, transparent), color-mix(in srgb, var(--light) 5%, transparent))',
  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
  backdropFilter: 'blur(10px) saturate(180%)',
  borderColor: 'color-mix(in srgb, var(--light) 50%, transparent)',
  boxShadow: 'inset 0 1px 0 rgb(255 255 255 / .7), inset 0 -1px 1px rgb(0 0 0 / .15), 0 6px 18px rgb(0 0 0 / .25)',
  color: 'var(--body-color)',
  '--hover-from': 'color-mix(in srgb, var(--light) 30%, transparent)',
  '--hover-to': 'color-mix(in srgb, var(--primary) 30%, transparent)',
};

// Glass toggle. Off (disabled) when the design theme is glass already: it sets --theme-glass: 1 (styles/themes/).
const GlassMode = (props) => {
  const glass = props.theme.value('glass');
  const [ builtIn, setBuiltIn ] = useState(false);
  // Read again when the design style changes (core.js sets it on <html> in an effect, so after a frame).
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setBuiltIn(getComputedStyle(document.documentElement).getPropertyValue('--theme-glass').trim() === '1'));
    return () => cancelAnimationFrame(frame);
  }, [ props.theme.design ]);
  return (
    <Button
      icon="fa-brands fa-hornbill"
      className={props.className}
      style={{ ...GLASS, ...props.style }}
      aria-pressed={!builtIn && !!glass}
      disabled={builtIn}
      title={builtIn ? 'Glass is built into this theme' : 'Glass'}
      onClick={() => props.update({ glass: !glass })}>
      Glass
    </Button>
  )  
}

const RainbowModeWT = withT(RainbowMode);
const ThemeModeWT = withT(ThemeMode);
const GlassModeWT = withT(GlassMode);

export { RainbowModeWT, ThemeModeWT, GlassModeWT, ThemeMode, GlassMode }

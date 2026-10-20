'use client';
// Theme toggles: buttons that flip one setting of the saved theme (light / dark, glass, rainbow).
// W = With, T = Theme (withT passes the theme and an update function).
import { Button } from "@/components/server/component";
import { withT } from "./hoc";

const RainbowMode = (props) => {
  const rainbow = props.theme.rainbow;
  return (
    <Button icon={['fa-solid', rainbow ? 'fa-wand-magic-sparkles' : 'fa-wand-magic', props.className].filter(Boolean).join(' ')} aria-label="Toggle rainbow mode" onClick={() => props.update({rainbow: !rainbow})} />
  )  
}

const ThemeMode = (props) => {
  const is_dark = props.theme.is_dark; // Oposite
  return (
    <Button
      icon={is_dark ? 'sun' : 'moon'}
      className={is_dark ? 'light' : 'dark'} /* filled in the mode it switches to (theme.css) */
      onClick={() => props.update({is_dark: !is_dark})}>
      {is_dark ? 'Light' : 'Dark'}
    </Button>
  )  
}

const GlassMode = (props) => {
  const glass = props.theme.glass;
  return (
    <Button
      icon="fa-brands fa-hornbill"
      aria-pressed={!!glass}
      onClick={() => props.update({ glass: !glass })}>
      Glass
    </Button>
  )  
}

const RainbowModeWT = withT(RainbowMode);
const ThemeModeWT = withT(ThemeMode);
const GlassModeWT = withT(GlassMode);

export { RainbowModeWT, ThemeModeWT, GlassModeWT }

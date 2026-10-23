'use client';
import { useContext } from 'react';
import { ThemeContext } from '@/lib/context';
import { cx } from '@/lib/cx';
import { Color } from '@marccent/util/class';
import { textVars } from '@/lib/theme-scope';

/*
 * The structure every landing page shares, and its palette:
 * - Page: the page's own colors and type. It sets the theme colors (primary, secondary, dark, light; the shades and
 *   gradients mixed from them) on its box, plus data-theme (the visitor's mode, or a forced one), so the page colors
 *   (defaults.css: body text and background, surfaces, borders, the mode shades) are worked out again from the
 *   page's palette. Every color class inside (bg-*, text-*, .btn.gradient, .bg…) then uses it: a page uses only
 *   its own colors.
 * - Full: a full-width section, edge to edge. Box: a short, contained one (a panel in the page's width, the site's
 *   background showing round it). Mix them.
 */

const MIX = {
  '--primary-lighter': 'color-mix(in srgb, var(--primary) 60%, #fff)',
  '--primary-darker': 'color-mix(in srgb, var(--primary) 60%, #000)',
  '--secondary-lighter': 'color-mix(in srgb, var(--secondary) 60%, #fff)',
  '--secondary-darker': 'color-mix(in srgb, var(--secondary) 60%, #000)',
  '--gradient': 'linear-gradient(to right, var(--primary), var(--secondary))',
  '--gradient-lighter': 'linear-gradient(to right, var(--primary-lighter), var(--secondary-lighter))',
  '--gradient-darker': 'linear-gradient(to right, var(--primary-darker), var(--secondary-darker))',
};

/**
 * Page: the sections stacked with no gap, in the page's own palette and type.
 * @param {{ primary: string, secondary: string, dark: string, light: string }} palette - The page's colors; the
 *   shades and gradients are mixed from them like the theme's own.
 * @param {'light'|'dark'} [mode] - Force a mode; otherwise the visitor's.
 * @param {Object} [style] - e.g. --font-heading / --font-body for the page's type.
 */
const Page = ({ palette, mode, className, style, children }) => {
  const { theme } = useContext(ThemeContext) ?? {};
  const vars = { '--primary': palette.primary, '--secondary': palette.secondary, '--dark': palette.dark, '--light': palette.light, ...MIX,
    ...textVars(new Color(palette.primary), new Color(palette.secondary)) }; // text on its fills, by brightness
  return (
    <div id="top" data-theme={mode ?? (theme?.isDark ? 'dark' : 'light')} suppressHydrationWarning
      className={cx('grid cols-1 gap-0', className)} style={{ ...vars, color: 'var(--body-color)', ...style }}>
      {children}
    </div>
  );
};

/**
 * Full: one full-width section (watched by PauseOffscreen, so its animations stop off screen); the background runs
 * edge to edge, the content sits in a .wrap.
 * @param {'light'|'dark'} [mode] - The section in that mode, whatever the page's: its background is the mode's page
 *   color (light or dark) and everything inside follows.
 * @param {string} [className] - Background classes (bg, bg-primary, bg-gradient-darker…) when not a mode.
 * @param {string} [inner='grid cols-1 gap-lg'] - Classes on the content box. @param {string} [wrap='wrap'] - Its width.
 * @param {string} [space='clamp(3rem, 7vw, 6rem)'] - Padding above and below (inline: --pad would reach every .pad inside).
 */
const Full = ({ id, mode, className, style, inner = 'grid cols-1 gap-lg', wrap = 'wrap', space = 'clamp(3rem, 7vw, 6rem)', children }) => (
  <section id={id} data-theme={mode} className={cx('wrap wrap-fluid', className)}
    style={{ paddingBlock: space, ...(mode && { background: 'var(--body-bg)', color: 'var(--body-color)' }), ...style }}>
    <div className={cx(wrap, inner)}>{children}</div>
  </section>
);

/**
 * Box: a short, contained section: a rounded panel in the page's width, the background round it showing through.
 * @param {string} [className='bg border'] - The panel's colors. @param {'light'|'dark'} [mode] - As in Full.
 * @param {string} [inner='grid cols-1'] - Layout classes on the panel. @param {string} [space='1.5rem'] - Above and below.
 */
const Box = ({ id, mode, className = 'bg border', style, inner = 'grid cols-1', wrap = 'wrap', space = '1.5rem', children }) => (
  <section id={id} className="wrap wrap-fluid" style={{ paddingBlock: space }}>
    <div data-theme={mode} className={cx(wrap, 'round pad shadow', inner, className)}
      style={{ ...(mode && { background: 'var(--body-bg)', color: 'var(--body-color)' }), ...style }}>{children}</div>
  </section>
);

export { Page, Full, Box };

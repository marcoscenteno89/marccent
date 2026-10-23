'use client';
import { useContext } from 'react';
import { ThemeContext } from '@/lib/context';
import { Logo } from './logo';

// The brand's own colors (the default theme set): the gradient logo is drawn in these.
const BRAND = [ '#1f64cf', '#1ecbe1' ];
const isBrand = (set) => [ set?.primary?.hex, set?.secondary?.hex ].every((hex, i) => hex?.toLowerCase() === BRAND[i]);

/**
 * ThemeLogo: the Logo that suits the visitor's theme. On the blue brand set it's the gradient logo, "marc" in the
 * text color; on any other color set the gradient would clash, so it's the solid logo opposite to the mode (white on
 * dark, dark on light). The gradient logo until the theme loads. Takes Logo's props.
 */
const ThemeLogo = (props) => {
  const theme = useContext(ThemeContext)?.theme;
  if (!theme || isBrand(theme.themeList[theme.active])) return <Logo currentText {...props} />;
  return <Logo variant={theme.is_dark ? 'white' : 'dark'} {...props} />;
}

export { ThemeLogo };

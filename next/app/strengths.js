'use client';
import { useContext } from 'react';
import { ThemeContext } from 'marccent-theme/lib/context';
import { Button } from 'marccent-theme/components/ui/button';
import { Icon } from 'marccent-theme/components/ui/icon';
import { MiniThemeEditor } from 'marccent-theme/components/theme/mini-editor';
import { DesignSelect } from 'marccent-theme/components/theme/designs';
import { ModeToggle, GlassToggle, ThemeReset } from 'marccent-theme/components/theme/toggles';
import { designTitle } from 'marccent-theme/lib/design';
import { Code } from 'marccent-theme/components/ui/code';
import { SectionHead } from '@/components/layout/section-head';
import { Full, Box } from './landing/blocks';

/*
 * Strengths: the home page sections for what sets the theme apart, each one showing it live rather than telling it.
 * One markup in several design styles; section theming; the morphing control; motion from one attribute; what's
 * under the hood. Copy is here (S) until it moves to lib/content.js. Hover: hover-holographic only.
 */

const S = {
  styles: {
    kicker: 'Same markup, new look',
    title: '27 design styles, zero markup changes',
    text: 'These four cards are the same HTML. Only data-design differs on each, and it restyles type, corners, depth and effects.',
    designs: [ 'brutalism', 'glassmorphism', 'terminal', 'claymorphism' ],
    cta: { icon: 'swatchbook', href: '/theme', label: 'See all 27' },
  },
  scopes: {
    kicker: 'Theme one section',
    title: 'Not just the site: any part of it',
    text: 'Give an element an id and a theme editor can restyle it alone: its own colors, mode, glass and design style, saved per page.',
    panels: [
      { id: 'strength-a', title: 'This panel', text: 'Pick a style or a palette here and only this box follows.' },
      { id: 'strength-b', title: 'And this one', text: 'Its neighbour keeps its own theme, whatever you do next door.' },
    ],
  },
  morph: {
    kicker: 'Morphing control',
    title: 'An icon that becomes the control',
    text: 'Each pill rests as an icon and widens in place into the live control when you hover or focus it, so a whole set of settings fits in one compact row. The design style is a select hidden in a button.',
    hint: 'Hover or tab into the pills: they theme this section.',
  },
  motion: {
    kicker: 'Motion in one attribute',
    title: 'data-name="snow" and it snows',
    text: 'Eleven canvas animations drawn in the theme colors, mounted from an attribute on any element. They pause off screen and stay still for visitors who ask for reduced motion.',
    code: '<div data-component="animation" data-name="snow">…</div>\n<section data-component="animation" data-name="blob">…</section>',
    canvases: [ 'snow', 'bubbles', 'fireflies' ],
  },
  hood: {
    kicker: 'Under the hood',
    title: 'Built to be used, not just looked at',
    install: 'npm install github:marcoscenteno89/marccent-theme',
    features: [
      { icon: 'eye', title: 'Readable on any color', text: 'Text on primary, secondary and gradient fills turns dark or light by the colors\' brightness, whatever palette is picked.' },
      { icon: 'leaf', title: 'Light on the machine', text: 'Animations and timers run only while on screen; reduced motion is respected everywhere.' },
      { icon: 'code', title: 'Plain JS inside', text: 'Widgets are plain JS classes with thin React wrappers, so the logic can move to another framework.' },
      { icon: 'file-code', title: 'No framework underneath', text: 'No Bootstrap or Tailwind: the grid, utilities and components are the theme\'s own.' },
      { icon: 'magnifying-glass', title: 'Found by search and AI', text: 'JSON-LD, sitemap, Open Graph images, llms.txt and answer-first copy come with the site.' },
      { icon: 'sitemap', title: 'Easy to find in the HTML', text: 'Every component marks its root with data-component, so devtools show where each one starts and ends.' },
    ],
  },
};

const Feature = ({ icon, title, text }) => (
  <article className="bg border round pad grid cols-1 gap-sm content-start hover-holographic">
    <div className="shape-hexagon bg-gradient col-center" style={{ width: '3.25rem' }}>
      <Icon name={icon} />
    </div>
    <h3 className="h4">{title}</h3>
    <p className="opacity-75">{text}</p>
  </article>
);

// The same card in one design style. Two layers, like the theme's DesignCards: the outer one sets the style, the
// inner one the visitor's mode, so the style's light / dark page colors apply inside it.
const StyledCard = ({ design, dark }) => (
  <div data-component="styled-card" data-name={design} data-design={design} className="grid h-100">
    <article data-theme={dark ? 'dark' : 'light'} suppressHydrationWarning
      className="bg border round shadow pad grid cols-1 gap-sm h-100 hover-holographic"
      style={{ gridTemplateRows: 'auto 1fr auto', color: 'var(--body-color)' }}>
      <h3 className="h5">{designTitle(design)}</h3>
      <p className="fs-sm opacity-75">One card, one markup. The style does the rest.</p>
      <Button icon="bolt" className="gradient w-100">Get started</Button>
    </article>
  </div>
);

const Strengths = () => {
  const { theme } = useContext(ThemeContext) ?? {};
  const dark = theme?.isDark;
  return (
    <div data-component="strengths" className="grid cols-1 gap-0">

      {/* STYLES: the same card in four design styles. */}
      <Full id="styles" className="bg">
        <div className="grid layout-ends items-end gap-sm">
          <SectionHead kicker={S.styles.kicker} title={S.styles.title} text={S.styles.text} />
          <Button icon={S.styles.cta.icon} href={S.styles.cta.href} className="primary col-last">{S.styles.cta.label}</Button>
        </div>
        <div className="grid gap-lg" style={{ '--cols': 4, '--min': '13rem' }}>
          {S.styles.designs.map(d => <StyledCard key={d} design={d} dark={dark} />)}
        </div>
      </Full>

      {/* SCOPES: two panels, each with its own mini theme editor. */}
      <Full id="scopes" className="bg-gradient-darker" style={{ color: 'var(--light)' }}>
        <SectionHead center onColor kicker={S.scopes.kicker} title={S.scopes.title} text={S.scopes.text} />
        <div className="grid gap-lg" style={{ '--cols': 2, '--min': '18rem' }}>
          {S.scopes.panels.map(p => (
            <article key={p.id} id={p.id} data-component="scope-panel" data-name={p.id}
              className="bg border round pad grid cols-1 gap-lg content-start hover-holographic" style={{ color: 'var(--body-color)' }}>
              <div className="grid cols-1 gap-xs">
                <h3 className="h4">{p.title}</h3>
                <p className="opacity-75">{p.text}</p>
              </div>
              <div className="row-wrap gap-sm">
                <Button icon="star" className="primary">Primary</Button>
                <Button icon="heart" className="outline-secondary">Outline</Button>
              </div>
              <MiniThemeEditor scope={p.id} />
            </article>
          ))}
        </div>
      </Full>

      {/* MORPH: the morphing control, live; the pills theme this section. */}
      <Box id="morph" inner="grid gap-lg items-center layout-ends">
        <div className="grid cols-1 gap-xs">
          <SectionHead kicker={S.morph.kicker} title={S.morph.title} text={S.morph.text} />
          <small className="opacity-75"><Icon name="hand-pointer" className="text-primary" /> {S.morph.hint}</small>
        </div>
        <div className="col-last grid auto-cols gap-sm items-center">
          <DesignSelect scope="morph" />
          <ModeToggle scope="morph" className="hover-expand" />
          <GlassToggle scope="morph" className="hover-expand" />
          <ThemeReset scope="morph" className="hover-expand" />
        </div>
      </Box>

      {/* MOTION: the attribute, then three live canvases from it. */}
      <Full id="motion" className="bg">
        <div className="grid gap-lg layout-1-2 items-center">
          <div className="grid cols-1 gap-lg">
            <SectionHead kicker={S.motion.kicker} title={S.motion.title} text={S.motion.text} />
            <Code lang="html">{S.motion.code}</Code>
          </div>
          <div className="grid gap-sm" style={{ '--cols': 3, '--min': '10rem' }}>
            {S.motion.canvases.map(c => (
              <figure key={c} data-component="canvas-sample" data-name={c} className="stack round border overflow-hidden" style={{ minHeight: '14rem' }}>
                <div data-component="animation" data-name={c} className="bg-gradient-darker w-100 h-100" aria-hidden="true" />
                <figcaption className="self-end pad-sm" style={{ position: 'relative' }}>
                  <code className="fs-sm" style={{ color: 'var(--light)' }}>{c}</code>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Full>

      {/* HOOD: what makes it good to build with, and how to install it. */}
      <Full id="hood" className="bg">
        <SectionHead center kicker={S.hood.kicker} title={S.hood.title} />
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '16rem' }}>
          {S.hood.features.map(f => <Feature key={f.title} {...f} />)}
        </div>
        <Code lang="sh">{S.hood.install}</Code>
      </Full>
    </div>
  );
};

export { Strengths };

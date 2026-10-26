import { apps } from '@/components/apps/list';
import AppCard from '@/components/apps/app-card';
import { Button } from 'marccent-theme/components/ui/button';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Accordion, AccordionItem } from 'marccent-theme/components/ui/accordion';
import { social, externalProps } from '@/components/layout/menus';
import { SectionHead } from '@/components/layout/section-head';
import { MiniThemeEditor } from 'marccent-theme/components/theme/mini-editor';
import { CanvasBand } from '@/components/layout/canvas-band';
import { Collage, Light, Spinner } from 'marccent-theme/components/widgets/collage';
import { Alert } from 'marccent-theme/components/ui/alert';
import { Input } from 'marccent-theme/components/ui/field';
import { Carousel } from 'marccent-theme/components/widgets/carousel';
import { CountUp } from '@/components/widgets/count-up';
import { CardCarousel } from '@/components/widgets/card-carousel';
import { ImageCard, Timeline } from 'marccent-theme/components/widgets/layout';
import ThemedMap from '@/components/apps/map';
import { RingGauge, Radar } from '@/components/widgets/data';
import { AnalogClock } from '@/components/widgets/fun';
import { LiveSpeedometer } from './landing/parts';
import Markdown from '@/components/markdown';
import JsonLd from '@/components/json-ld';
import { faqPage } from '@/lib/schema';
import { Full, Box } from './landing/blocks';
import { home, theme, faq } from '@/lib/content';
import { img } from '@/lib/img';
import { Strengths } from './strengths';

/*
 * Home: what Marccent (the theme) is, that this site is its demo, who builds it and what he's working on now. Full
 * width sections (Full) alternate with short boxed ones (Box), the site background showing round the boxes, and now
 * and then a full-width live canvas (CanvasBand). No parallax: that stays on the Parallax page for now. Everything
 * is in the visitor's theme colors and mode, so the page itself shows the theme following them. Copy: lib/content.js.
 * Hover: hover-holographic only (cards; buttons have it by default).
 */

export const metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
  alternates: { canonical: '/' },
  openGraph: { title: home.meta.title, description: home.meta.description, url: '/' },
};

// A feature: its icon in a gradient hexagon (the brand's shape), the title and a line.
const Feature = ({ icon, title, text }) => (
  <article className="bg border round pad grid cols-1 gap-sm content-start hover-holographic">
    <div className="shape-hexagon bg-gradient col-center" style={{ width: '3.25rem' }}>
      <Icon name={icon} />
    </div>
    <h3 className="h4">{title}</h3>
    <p className="opacity-75">{text}</p>
  </article>
);

// A collage tile: a .bg panel with its widget on top and, under it, what the theme does to it.
const Tile = ({ icon, title, text, className, style, children }) => (
  <article className={['bg border round pad grid cols-1 gap-sm hover-holographic', className].filter(Boolean).join(' ')}
    style={{ color: 'var(--body-color)', gridTemplateRows: '1fr auto', ...style }}>
    <div className="grid cols-1 items-center">{children}</div>
    <div className="grid cols-1 gap-xs">
      <h3 className="h5"><Icon name={icon} className="text-gradient" style={{ '--icon-size': '1.5em' }} /> {title}</h3>
      <p className="fs-sm opacity-75">{text}</p>
    </div>
  </article>
);

// One collage in the live section: its title, a line and a link to its page, then its tiles on a dense 4-column grid.
const Group = ({ title, text, cta, children }) => (
  <div className="grid cols-1">
    <div className="grid layout-ends items-end gap-sm">
      <div className="grid cols-1 gap-xs">
        <h3>{title}</h3>
        <p className="opacity-75">{text}</p>
      </div>
      <Button icon={cta.icon} href={cta.href} className="light col-last">{cta.label}</Button>
    </div>
    <div className="grid" style={{ '--cols': 4, '--min': '13rem', gridAutoRows: 'minmax(13rem, auto)', gridAutoFlow: 'dense' }}>
      {children}
    </div>
  </div>
);

// A photo from public/img as an ImageCard (props from lib/content.js), with its button if it has one.
const Photo = ({ src, button, ...card }) => (
  <ImageCard src={img(src)} {...card}>
    {button && <Light icon={button.icon} href={button.href}>{button.label}</Light>}
  </ImageCard>
);

const RADAR = [ 'Color', 'Mode', 'Glass', 'Style', 'Type' ].map((label, i) => ({ label, value: [ 80, 65, 90, 70, 55 ][i] }));

export default function Home() {
  const { components: { tiles: c }, widgets: { tiles: w } } = home.live;
  return (
    <>

      {/* HERO: a full-screen network of points linking up, in the theme colors. */}
      <CanvasBand canvas="network-loop" height="calc(100vh - 4rem)" label="hero-title">
          <div className="grid cols-1 gap-lg w-100" style={{ maxWidth: '50rem' }}>
            <small className="fw-bold text-uppercase text-primary" style={{ letterSpacing: '.25em' }}>
              <Icon name="circle" className="text-success" style={{ fontSize: '.6em' }} /> {home.hero.kicker}
            </small>
            <h1 id="hero-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.75rem)', lineHeight: 1.05, textWrap: 'balance' }}>
              {home.hero.title}
            </h1>
            <Markdown text={home.hero.intro} className="fs-lg" />
            <div className="row-wrap gap-sm cols-center">
              <Button icon={home.hero.primary.icon} href={home.hero.primary.href} className="gradient">{home.hero.primary.label}</Button>
              <Button icon={home.hero.secondary.icon} href={home.hero.secondary.href} className="primary">{home.hero.secondary.label}</Button>
              {social.filter(s => s.external).map(s => (
                <Button key={s.href} icon={s.icon} href={s.href} aria-label={s.label} title={s.name} className="secondary" {...externalProps(s)} />
              ))}
            </div>
          </div>
      </CanvasBand>

      {/* SHORT: the theme in numbers, boxed; they count up as they come into view. */}
      <Box inner="grid gap-sm items-center text-center" style={{ '--cols': theme.stats.length, '--min': '9rem' }}>
        {theme.stats.map(s => (
          <div key={s.label} className="grid cols-1 gap-0">
            <span className="display-sm fw-bold"><Icon name={s.icon} className="text-gradient" style={{ fontSize: '.6em' }} /> <CountUp to={s.value} /></span>
            <small className="text-uppercase opacity-75" style={{ letterSpacing: '.12em' }}>{s.label}</small>
          </div>
        ))}
      </Box>

      {/* WHAT: the product, answered in the first lines beside a photo tinted in the theme colors, then what it does. */}
      <Full id="what" className="bg">
        <div className="grid gap-lg layout-2-1">
          <div className="grid cols-1 gap-lg content-center">
            <SectionHead kicker={home.what.kicker} title={home.what.title} />
            <Markdown text={home.what.answer} className="fs-lg" />
          </div>
          <Photo {...home.what.photo} ratio="4 / 3" />
        </div>
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '16rem' }}>
          {home.what.features.map(f => <Feature key={f.title} {...f} />)}
        </div>
      </Full>

      {/* STRENGTHS: what sets the theme apart, each shown live (app/strengths.js). */}
      <Strengths />

      {/* LIVE: three groups (components, the cards carousel, widgets), each a live piece per tile saying what the theme
          does to it and a link to its page, then the site's mini theme editor. The tiles
          take the page colors (.bg panels on the gradient). */}
      <Full id="try" className="bg-gradient-darker" style={{ color: 'var(--light)' }}>
        <SectionHead center onColor kicker={home.live.kicker} title={home.live.title} text={<Markdown text={home.live.text} className="fs-lg" />} />

        <Group {...home.live.components}>
          <ImageCard canvas="blob" ratio={null} overlay="glass" align="end" badge="Live" className="span-2"
            label={c.canvas.title} title={c.canvas.text} />
          <Tile {...c.buttons} className="span-2">
            <div className="row-wrap gap-sm">
              <Button icon="bolt" className="gradient">Gradient</Button>
              <Button icon="star" className="primary">Primary</Button>
              <Button icon="heart" className="outline-primary">Outline</Button>
            </div>
          </Tile>
          <Tile {...c.alert}><Alert tone="success"><Icon name="check" /> Theme saved</Alert></Tile>
          <Tile {...c.form}><Input name="email" type="email" /></Tile>
          <Tile {...c.loading}><div className="grid auto-cols cols-center gap-lg"><Spinner kind="ring" width="2.5rem" /><Spinner kind="dots" width="2.5rem" /><Spinner kind="bars" width="2.5rem" /></div></Tile>
          <Tile {...c.accordion}>
            <Accordion><AccordionItem header={<span className="fw-bold">What changes?</span>}><p className="fs-sm">Everything.</p></AccordionItem></Accordion>
          </Tile>
        </Group>

        <Group {...home.live.cards}>
          <div className="span-4"><CardCarousel /></div>
        </Group>

        <Group {...home.live.widgets}>
          <Tile {...w.map} className="span-2" style={{ gridRow: 'span 2' }}>
            <ThemedMap zoom={11} className="round" style={{ minHeight: '16rem', height: '100%' }} />
          </Tile>
          <Tile {...w.gauge}><div className="col-center"><RingGauge value={72} label="Theme" size="7rem" /></div></Tile>
          <Tile {...w.clock}><div className="col-center"><AnalogClock style={{ width: '7rem' }} /></div></Tile>
          <Tile {...w.speed}><LiveSpeedometer value={64} label="Load" /></Tile>
          <Tile {...w.radar}><Radar axes={RADAR} className="w-100" style={{ maxWidth: '10rem', justifySelf: 'center' }} /></Tile>
        </Group>

        {/* The site's theme editor. */}
        <div className="bg border round pad grid gap-lg items-center layout-ends" style={{ color: 'var(--body-color)' }}>
          <div className="grid cols-1 gap-xs">
            <h3 className="h4">{home.live.editor.title}</h3>
            <p className="opacity-75">{home.live.editor.text}</p>
          </div>
          <div className="col-last"><MiniThemeEditor scope="try" /></div>
        </div>
      </Full>

      {/* SHOWCASE: the Design pages as a collage; each tile opens its page. */}
      <Full id="demo" className="bg">
        <SectionHead kicker={home.showcase.kicker} title={home.showcase.title} text={home.showcase.text} />
        <Collage cols={4} min="12rem" row="14rem" tiles={home.showcase.tiles.map(({ href, icon, ...tile }) => ({
          ...tile, children: <Light icon={icon} href={href}>Open</Light>,
        }))} />
      </Full>

      {/* LANDING: rolling waves full width, then the made-up companies in a carousel, each on a photo that suits it. */}
      <CanvasBand canvas="wave" height="55vh" label="landing-title">
        <SectionHead center kicker={home.landing.kicker} title={<span id="landing-title">{home.landing.title}</span>} text={home.landing.text} />
      </CanvasBand>
      <Full className="bg" space="clamp(2rem, 5vw, 4rem)">
        <Carousel slideWidth="16rem" label={home.landing.title}>
          {home.landing.pages.map(p => (
            <Photo key={p.href} src={p.src} overlay={p.overlay} label={p.kind} title={p.name} className="h-100"
              button={{ icon: p.icon, href: p.href, label: 'Visit' }} />
          ))}
        </Carousel>
      </Full>

      {/* NOW: what I'm working on, as a timeline from the repository's history. */}
      <Full id="now" className="bg">
        <div className="grid gap-lg layout-1-2">
          <div className="grid cols-1 gap-lg content-start">
            <SectionHead kicker={home.now.kicker} title={home.now.title} text={<Markdown text={home.now.text} className="fs-lg opacity-75" />} />
            <Button icon="user" href="/about" className="gradient" style={{ justifySelf: 'start' }}>More about me</Button>
            <Photo {...home.now.photo} ratio="4 / 3" />
          </div>
          <Timeline events={home.now.events} />
        </div>
      </Full>

      {/* A breather: dust on a current, full width, with one line over it. */}
      <CanvasBand canvas="particle-flowfield" height="45vh" label="band-title">
        <div className="grid cols-1 gap-sm w-100" style={{ maxWidth: '40rem' }}>
          <h2 id="band-title" className="display-sm">{home.band.title}</h2>
          <p className="fs-lg opacity-75">{home.band.text}</p>
        </div>
      </CanvasBand>

      {/* SHORT: the apps, boxed. */}
      <Box inner="grid cols-1 gap-lg">
        <SectionHead center kicker={home.apps.kicker} title={home.apps.title} text={home.apps.text} />
        <div className="grid gap-lg" style={{ '--cols': 4, '--min': '14rem' }}>
          {apps.map(app => <AppCard key={app.url} app={app} />)}
        </div>
      </Box>

      {/* FAQ: plain questions and answers (also sent as FAQPage data, below). */}
      <Full id="faq" className="bg">
        <div className="grid gap-lg layout-1-2">
          <div className="grid cols-1 gap-lg content-start">
            <SectionHead kicker="FAQ" title={home.faqTitle} />
            <Photo {...home.faqPhoto} ratio="1 / 1" />
          </div>
          <Accordion>
            {faq.map(({ q, a }) => <AccordionItem key={q} header={<h3 className="h5">{q}</h3>}><p>{a}</p></AccordionItem>)}
          </Accordion>
        </div>
      </Full>

      {/* SHORT: the call to action, boxed in the gradient. */}
      <Box className="bg-gradient" inner="grid cols-1 gap-sm text-center">
        <h2>{home.cta.title}</h2>
        <p className="fs-lg">{home.cta.text}</p>
        <Button icon={home.cta.button.icon} href={home.cta.button.href} className="light" style={{ justifySelf: 'center' }}>{home.cta.button.label}</Button>
      </Box>

      <JsonLd data={faqPage()} />
    </>
  );
}

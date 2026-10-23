import { apps } from '@/components/apps/list';
import AppCard from '@/components/apps/app-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { social, externalProps } from '@/components/layout/menus';
import { SectionHead } from '@/components/layout/section-head';
import { MiniThemeEditor } from '@/components/theme/mini-editor';
import { CanvasBand } from '@/components/layout/canvas-band';
import { Collage, Light } from '@/components/widgets/collage';
import { Carousel } from '@/components/widgets/carousel';
import { CountUp } from '@/components/widgets/count-up';
import { ImageCard, Timeline } from '@/components/widgets/layout';
import Markdown from '@/components/markdown';
import JsonLd from '@/components/json-ld';
import { faqPage } from '@/lib/schema';
import { Full, Box } from './landing/blocks';
import { home, theme, faq } from '@/lib/content';

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

export default function Home() {
  return (
    <div className="grid cols-1 gap-0">

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

      {/* WHAT: the product, answered in the first lines, then what it does. */}
      <Full id="what" className="bg">
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <SectionHead kicker={home.what.kicker} title={home.what.title} />
          <Markdown text={home.what.answer} className="fs-lg" />
        </div>
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '16rem' }}>
          {home.what.features.map(f => <Feature key={f.title} {...f} />)}
        </div>
      </Full>

      {/* LIVE: the theme switches, right here, next to a canvas drawn in the theme colors. */}
      <Full id="try" className="bg-gradient-darker" style={{ color: 'var(--light)' }}>
        <div className="grid gap-lg items-center" style={{ '--cols': 2, '--min': '18rem' }}>
          <div className="grid cols-1 gap-lg">
            <SectionHead kicker={home.live.kicker} title={home.live.title} text={<Markdown text={home.live.text} className="fs-lg" />} />
            <MiniThemeEditor scope="site" />
          </div>
          <ImageCard canvas="blob" ratio="4 / 3" overlay="glass" align="end" badge="Live"
            label={home.live.card.label} title={home.live.card.title} text={home.live.card.text} />
        </div>
      </Full>

      {/* SHOWCASE: the Design pages as a collage; each tile opens its page. */}
      <Full id="demo" className="bg">
        <SectionHead kicker={home.showcase.kicker} title={home.showcase.title} text={home.showcase.text} />
        <Collage cols={4} min="12rem" row="14rem" tiles={home.showcase.tiles.map(({ href, icon, ...tile }) => ({
          ...tile, children: <Light icon={icon} href={href}>Open</Light>,
        }))} />
      </Full>

      {/* SHORT: a mini theme editor for the showcase right above it (only that section changes). */}
      <Box><MiniThemeEditor scope="demo" title={home.mini.title} text={home.mini.text} /></Box>

      {/* LANDING: rolling waves full width, then the made-up companies in a carousel. */}
      <CanvasBand canvas="wave" height="55vh" label="landing-title">
        <SectionHead center kicker={home.landing.kicker} title={<span id="landing-title">{home.landing.title}</span>} text={home.landing.text} />
      </CanvasBand>
      <Full className="bg" space="clamp(2rem, 5vw, 4rem)">
        <Carousel slideWidth="16rem" label={home.landing.title}>
          {home.landing.pages.map(p => (
            <article key={p.href} className="bg border round pad grid cols-1 gap-sm h-100 hover-holographic" style={{ gridTemplateRows: 'auto auto 1fr auto' }}>
              <div className="shape-hexagon bg-gradient col-center" style={{ width: '3rem' }}><Icon name={p.icon} /></div>
              <small className="text-uppercase opacity-75" style={{ letterSpacing: '.12em' }}>{p.kind}</small>
              <h3 className="h4">{p.name}</h3>
              <Button icon="arrow-right" href={p.href} className="outline-primary w-100">Visit</Button>
            </article>
          ))}
        </Carousel>
      </Full>

      {/* NOW: what I'm working on, as a timeline from the repository's history. */}
      <Full id="now" className="bg">
        <div className="grid gap-lg layout-1-2">
          <div className="grid cols-1 gap-lg content-start">
            <SectionHead kicker={home.now.kicker} title={home.now.title} text={<Markdown text={home.now.text} className="fs-lg opacity-75" />} />
            <Button icon="user" href="/about" className="gradient" style={{ justifySelf: 'start' }}>More about me</Button>
          </div>
          <Timeline events={home.now.events} />
        </div>
      </Full>

      {/* SHORT: another mini theme editor, for the timeline above. */}
      <Box><MiniThemeEditor scope="now" title={home.mini.title} text={home.mini.text} /></Box>

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
          <SectionHead kicker="FAQ" title={home.faqTitle} />
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
    </div>
  );
}

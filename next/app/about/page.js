import { Button } from 'marccent-theme/components/ui/button';
import { Icon } from 'marccent-theme/components/ui/icon';
import { Menu, social, contact, externalProps } from '@/components/layout/menus';
import { SectionHead } from '@/components/layout/section-head';
import ContactForm from '@/components/layout/contact-form';
import MapWTCL from '@/components/apps/map';
import { CanvasBand } from '@/components/layout/canvas-band';
import { MiniThemeEditor } from 'marccent-theme/components/theme/mini-editor';
import { StatCard, Timeline } from 'marccent-theme/components/widgets/layout';
import Markdown from '@/components/markdown';
import JsonLd from '@/components/json-ld';
import { profilePage } from '@/lib/schema';
import { Full, Box } from '../landing/blocks';
import { about } from '@/lib/content';

/*
 * About me, and contact (/contact redirects to #contact): who I am, what I'm trying to accomplish right now, my work
 * and skills, then the map, the form and the links. Full-width sections with short boxed ones between them, and a
 * live canvas band between experience and contact (no parallax: that stays on the Parallax page for now).
 * Copy: lib/content.js. Hover: hover-holographic only.
 */

export const metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: { canonical: '/about' },
  openGraph: { type: 'profile', title: about.meta.title, description: about.meta.description, url: '/about' },
};

export default function About() {
  return (
    <div className="grid cols-1 gap-0">

      {/* HERO: the photo in the brand's hexagon, who I am and where. */}
      <Full className="bg-gradient-darker" style={{ color: 'var(--light)' }}>
        <div className="grid gap-lg items-center layout-1-2">
          <div className="shape-hexagon shadow" style={{ width: 'min(100%, 22rem)', justifySelf: 'center' }}>
            <img src={about.photo.src} alt={about.photo.alt} className="w-100 h-100" style={{ objectFit: 'cover' }} />
          </div>
          <div className="grid cols-1 gap-sm">
            <small className="fw-bold text-uppercase text-secondary-lighter" style={{ letterSpacing: '.2em' }}>{about.greeting}</small>
            <h1 className="display">{about.title}</h1>
            <p className="fs-lg fw-bold">{about.role}</p>
            <Markdown text={about.intro} className="fs-lg" />
            <ul className="grid gap-sm pad-y-sm" style={{ '--cols': 3, '--min': '12rem' }}>
              {about.facts.map(f => <li key={f.text}><Icon name={f.icon} className="text-secondary-lighter" /> {f.text}</li>)}
            </ul>
            <div className="row-wrap gap-sm">
              <Button icon="paper-plane" href="#contact" className="light">Contact me</Button>
              {social.filter(s => s.external).map(s => (
                <Button key={s.href} icon={s.icon} href={s.href} aria-label={s.label} title={s.name} {...externalProps(s)} />
              ))}
            </div>
          </div>
        </div>
      </Full>

      {/* FOCUS: what I'm trying to accomplish right now. */}
      <Full id="now" className="bg">
        <SectionHead kicker={about.focus.kicker} title={about.focus.title} />
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '15rem' }}>
          {about.focus.items.map(f => <StatCard key={f.title} className="bg border" accent icon={f.icon} value={f.title} text={f.text} />)}
        </div>
      </Full>

      {/* SHORT: a mini theme editor for the section above (only it changes). */}
      <Box><MiniThemeEditor scope="now" title={about.mini.title} text={about.mini.text} /></Box>

      {/* EXPERIENCE: the job on a timeline, what it involves, then skills. */}
      <Full id="experience" className="bg">
        <div className="grid gap-lg layout-1-2">
          <div className="grid cols-1 gap-lg content-start">
            <SectionHead kicker={about.experienceTitle} title={about.experienceHeading} />
            <Timeline events={about.jobs} />
          </div>
          <div className="grid cols-1 gap-sm content-start">
            <h3>{about.dutiesTitle}</h3>
            <ul className="grid gap-sm" style={{ '--cols': 2, '--min': '16rem' }}>
              {about.job.duties.map(d => (
                <li key={d} className="grid gap-sm items-start" style={{ gridTemplateColumns: 'auto minmax(0, 1fr)' }}>
                  <Icon name="check" className="text-primary" />{d}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid cols-1 gap-sm">
          <h3>{about.skillsTitle}</h3>
          <ul className="grid gap-sm" style={{ '--cols': 6, '--min': '9rem' }}>
            {about.skills.map(s => <li key={s} className="bg border round pad-sm text-center">{s}</li>)}
          </ul>
        </div>
      </Full>

      {/* A full-width breather between the work and the contact: blobs in the theme colors. */}
      <CanvasBand canvas="blob" height="40vh" label="band-title">
        <div className="grid cols-1 gap-sm w-100" style={{ maxWidth: '40rem' }}>
          <h2 id="band-title" className="display-sm">{about.band.title}</h2>
          <p className="fs-lg opacity-75">{about.band.text}</p>
        </div>
      </CanvasBand>

      {/* CONTACT: the map beside the form and the links. scroll-margin keeps the sticky header off the heading. */}
      <Full id="contact" className="bg-gradient" style={{ scrollMarginTop: '4rem' }}>
        <div className="bg border round shadow overflow-hidden grid gap-0 layout-2-1" style={{ color: 'var(--body-color)' }}>
          <div className="grid cols-1 gap-0" style={{ minHeight: '24rem' }}>
            <MapWTCL className="h-100" zoom={10} />
          </div>
          <div className="grid cols-1 pad-x pad-y-lg gap-sm">
            <SectionHead kicker={about.contact.kicker} title={about.contact.title} />
            <p>{about.contact.intro}</p>
            <ContactForm />
            <Menu items={contact} label="Contact links" iconOnly layout="auto-cols cols-center" className="divide border round" />
            <small className="opacity-75 text-center"><Icon name="location-dot" /> {about.contact.mapCaption}</small>
          </div>
        </div>
      </Full>

      <JsonLd data={profilePage()} />
    </div>
  );
}

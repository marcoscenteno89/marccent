import { notFound } from 'next/navigation';
import { apps, findApp } from '@/components/apps/list';
import AppCard from '@/components/apps/app-card';
import Markdown from '@/components/markdown';
import { SectionHead } from '@/components/layout/section-head';
import { Accordion, AccordionItem } from 'marccent-theme/components/ui/accordion';
import { Full } from '../../landing/blocks';

export const generateStaticParams = () => apps.map(app => ({ slug: app.url.split('/').pop() }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => ({ title: findApp(params.slug)?.name });

/*
 * One app: its name and what it is, the app in a full-row card, how to play in an accordion (closed, so the app
 * comes first), then the other apps as cards. Full sections like the rest of the site. Copy: lib/content.js. Hover: hover-holographic on the app cards only (not while playing).
 */
export default function AppPage({ params }: { params: { slug: string } }) {
  const app = findApp(params.slug);
  if (!app) notFound();
  const Component = app.component;
  const others = apps.filter(a => a !== app);

  return (
    <div className="grid cols-1 gap-0">

      {/* APP: the head, the app in a card across the row, then how to play (closed until asked for). */}
      <Full className="bg">
        <SectionHead as="h1" kicker="Apps" title={app.name} text={<Markdown text={app.about} className="fs-lg opacity-75" />} />
        <div className="bg border round shadow pad grid cols-1">
          <Component />
        </div>
        <Accordion defaultOpen={-1}>
          <AccordionItem header={<h2 className="h5">How to play</h2>} className="grid cols-1 gap-sm">
            <Markdown text={app.instructions} />
          </AccordionItem>
        </Accordion>
      </Full>

      {/* MORE: the other apps as cards. */}
      <Full className="bg">
        <SectionHead kicker="More apps" title="Try another one" />
        <div className="grid gap-lg" style={{ '--cols': 3, '--min': '14rem' } as React.CSSProperties}>
          {others.map(a => <AppCard key={a.url} app={a} />)}
        </div>
      </Full>
    </div>
  )
}

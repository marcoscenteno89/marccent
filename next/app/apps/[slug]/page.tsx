import { notFound } from 'next/navigation';
import { apps, findApp } from '../list';
import Markdown from '@/components/server/markdown';

export const generateStaticParams = () => apps.map(app => ({ slug: app.url.split('/').pop() }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => ({ title: findApp(params.slug)?.name });

export default function AppPage({ params }: { params: { slug: string } }) {
  const app = findApp(params.slug);
  if (!app) notFound();
  const Component = app.component;

  const text = (
    <>
      <div className="grid cols-1 gap-2">
        <h4>About</h4>
        <Markdown text={app.about} />
      </div>
      <div className="grid cols-1 gap-2">
        <h4>Instructions</h4>
        <Markdown text={app.instructions} />
      </div>
    </>
  );

  // items-start: columns keep their own height, so short text isn't stretched to match the app.
  return (
    <section className="wrap wrap-fluid">
      <div className="wrap bg border round pad grid cols-1 gap-3">
        <h1 className="text-center">{app.name}</h1>
        {app.layout === 'side' ? (
          <div className="grid cols-2 gap-3 items-start">
            <Component />
            <div className="grid cols-1 gap-3">{text}</div>
          </div>
        ) : (
          <>
            <Component />
            <div className="grid cols-2 gap-3 items-start">{text}</div>
          </>
        )}
      </div>
    </section>
  )
}

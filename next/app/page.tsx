import { apps } from '@/components/server/list';
import AppCard from '@/components/server/app-card';
import { Button } from '@/components/server/component';
import { social, externalProps } from '@/templates/menus';
import Markdown from '@/components/server/markdown';
import { home } from '@/components/server/content';

export default function Home() {

  return (
    <>
      {/* Hero keeps two layers: the section fills the screen height and centers the box. */}
      <section className="wrap wrap-fluid vh-100 col-center">
        <div className="wrap bg border round pad grid cols-1 gap-sm">
          <h4>{home.greeting}</h4>
          <h1>{home.title}</h1>
          <Markdown text={home.intro} />
          <div className="grid fixed cols-4 gap-sm icon-only-md">
            {social.map(s => (
              <Button key={s.href} icon={s.icon} href={s.href} {...externalProps(s)}>{s.name}</Button>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap wrap-fluid">
        <div className="wrap bg border pad grid cols-1 round">
          <h1 className="text-center">{home.appsTitle}</h1>
          <div className="grid cols-4">
            {apps.map(app => <AppCard key={app.url} app={app} />)}
          </div>
        </div>
      </section>
    </>
  )
}

import { apps } from './apps/list';
import AppCard from '@/components/server/app-card';
import { CompactButton } from '@/components/client/util';
import { social, externalProps } from '@/templates/menus';
import Markdown from '@/components/server/markdown';
import { home } from './content';

export default function Home() {

  return (
    <>
      {/* Hero keeps two layers: the section fills the screen height and centers the box. */}
      <section className="vh-100 col-center">
        <div className="wrap bg border round pad grid cols-1 gap-2">
          <h4>{home.greeting}</h4>
          <h1>{home.title}</h1>
          <Markdown text={home.intro} />
          <div className="grid fixed cols-4 gap-1">
            {social.map(s => (
              <CompactButton key={s.href} icon={s.icon} href={s.href} {...externalProps(s)}>{s.name}</CompactButton>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap bg border pad grid cols-1 gap-3 round">
        <h1 className="text-center">{home.appsTitle}</h1>
        <div className="grid cols-3">
          {apps.map(app => <AppCard key={app.url} app={app} />)}
        </div>
      </section>
    </>
  )
}

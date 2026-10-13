import { apps } from '@/components/server/list';
import AppCard from '@/components/server/app-card';
import { appsPage } from '@/components/server/content';

export default function Apps() {
  return (
    <section className="wrap bg border pad grid cols-1 gap-3 round">
      <h1 className="text-center">{appsPage.title}</h1>
      <div className="grid cols-3 gap-3">
        {apps.map(app => <AppCard key={app.url} app={app} />)}
      </div>
    </section>
  )
}

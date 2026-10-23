import { apps } from '@/components/apps/list';
import AppCard from '@/components/apps/app-card';
import { appsPage } from '@/lib/content';

export default function Apps() {
  return (
    <section className="wrap wrap-fluid">
      <div className="wrap bg border pad grid cols-1 round">
        <h1 className="text-center">{appsPage.title}</h1>
        <div className="grid gap-lg" style={{ '--cols': 4 } as React.CSSProperties}>
          {apps.map(app => <AppCard key={app.url} app={app} />)}
        </div>
      </div>
    </section>
  )
}

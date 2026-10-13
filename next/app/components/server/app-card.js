import { Button } from '@/components/button';
import Markdown from './markdown';

/**
 * Card for one entry of the apps list (list.tsx in this folder). Used by the apps page and the home page.
 * Subgrid keeps title, text and button aligned across cards.
 *
 * @param {Object} props
 * @param {import('./list').App} props.app - The app to show.
 * @returns {JSX.Element}
 */
export default function AppCard({ app }) {
  return (
    <div className="card sub rows-4 gap-y-0 round">
      <div className="bg-primary pad text-center">
        <i className={`h1 fa-solid ${app.icon}`}></i>
      </div>
      <div className="card-body sub rows-3 gap-y-2">
        <h5 className="card-title">{app.name}</h5>
        <Markdown text={app.about} className="card-text" />
        <Button icon="arrow-right" href={app.url}>{`Go to ${app.name}`}</Button>
      </div>
    </div>
  )
}

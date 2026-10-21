import { Button } from '@/components/ui/button';
import Markdown from '@/components/markdown';

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
    <div className="bg border round sub rows-4 gap-y-0 shadow">
      <div className="bg-primary pad text-center">
        <i className={`h1 fa-solid ${app.icon}`}></i>
      </div>
      <div className="pad sub rows-3 gap-y-sm">
        <h5>{app.name}</h5>
        <Markdown text={app.about} />
        <Button icon="arrow-right" href={app.url}>{app.name}</Button>
      </div>
    </div>
  )
}

import { Button } from '@/components/ui/button';
import Markdown from '@/components/markdown';
import { StatCard } from '@/components/widgets/layout';

/**
 * Card for one entry of the apps list (list.tsx in this folder), used by the apps page and the home page: a StatCard
 * on the site's own panel surface (bg border), the theme gradient only as the accent on the icon and its ring, the
 * app's name and what it does, and a Play button (with the app's icon) in the site's gradient button color.
 *
 * @param {Object} props
 * @param {import('./list').App} props.app - The app to show.
 * @returns {JSX.Element}
 */
export default function AppCard({ app }) {
  return (
    <StatCard className="bg border" accent icon={app.icon.replace(/^fa-/, '')} value={app.name} text={<Markdown text={app.about} />}>
      <Button icon={app.icon.replace(/^fa-/, '')} href={app.url} className="gradient w-100">Play</Button>
    </StatCard>
  )
}

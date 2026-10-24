// Shared: no 'use client' (no state or effects); MiniThemeEditor is the client part.
// A mini theme editor with this site's heading beside it: a third for the title and text, two thirds for the controls
// (layout-1-2: side by side from 40rem, stacked below), the controls at the end. The theme's MiniThemeEditor is only
// the row of controls, so the words live here, with the site.
import { MiniThemeEditor } from 'marccent-theme/components/theme/mini-editor';
import { Icon } from 'marccent-theme/components/ui/icon';

/**
 * ThemeEditorRow: usually its own short section (a Box) right under the element it edits.
 * A section's editor gets an arrow up to the section it changes.
 * @param {Object} props
 * @param {string} props.scope - "site" or the id of the element it themes.
 * @param {React.ReactNode} props.title @param {React.ReactNode} [props.text]
 */
const ThemeEditorRow = ({ scope, title, text }) => (
  <div className="grid gap-lg items-center layout-1-2">
    <div className="grid cols-1 gap-0">
      <strong>{scope !== 'site' && <Icon name="arrow-up" className="text-primary" />} {title}</strong>
      {text && <small className="opacity-75">{text}</small>}
    </div>
    <div className="grid cols-1 justify-end">
      <MiniThemeEditor scope={scope} />
    </div>
  </div>
);

export { ThemeEditorRow };

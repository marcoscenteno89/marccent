import { marked } from 'marked';

/**
 * Renders a Markdown string as HTML. Server-only: marked never ships to the browser.
 * Only use with our own text (e.g. list.tsx and content.js in this folder), never user input; the HTML is not sanitized.
 * The output is a 1-col grid, so paragraphs and lists are spaced by gap (grid.css drops their margins).
 *
 * @param {Object} props
 * @param {string} props.text - Markdown. Common leading indentation is removed, so template literals can be indented.
 * @param {string} [props.className] - Extra classes for the wrapper.
 * @returns {JSX.Element}
 */
export default function Markdown({ text, className = '' }) {
  const lines = text.replace(/^\n+|\s+$/g, '').split('\n');
  const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
  const html = marked.parse(lines.map(l => l.slice(indent)).join('\n'));
  return <div className={`grid cols-1 gap-2 ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

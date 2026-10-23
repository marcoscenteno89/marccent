/**
 * JsonLd: structured data (lib/schema.js) as a <script type="application/ld+json">, for search and answer engines.
 * Our own data only; "<" is escaped so no string can close the script tag.
 * @param {Object} props @param {Object} props.data
 */
export default function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

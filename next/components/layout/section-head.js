// Shared: no 'use client' (no state or effects), so it renders on the server or in the browser.
import { cx } from 'marccent-theme/lib/cx';

/**
 * SectionHead: a section's heading: a small spaced-capitals kicker in the primary, the title, and a line of text.
 * Used by the home and About pages. Only theme classes; the letter spacing and width cap are one-off values. The
 * cap is also at most its container's width (cqi), for heads over a Scenery, whose cropped layers are wider than the screen.
 * @param {Object} props
 * @param {string} [props.kicker] @param {React.ReactNode} props.title @param {React.ReactNode} [props.text]
 * @param {boolean} [props.center] - Centered in its column.
 * @param {boolean} [props.onColor] - On a colored background: the kicker takes the text color (faded), not the primary.
 * @param {'h1'|'h2'|'h3'} [props.as='h2'] - The heading level (one h1 per page).
 * @param {string} [props.className]
 */
const SectionHead = ({ kicker, title, text, center, onColor, as: Tag = 'h2', className }) => (
  <header className={cx('grid cols-1 gap-sm', center && 'text-center w-100', className)}
    style={{ maxWidth: 'min(44rem, 100cqi - 2 * var(--space))', justifySelf: center ? 'center' : undefined }}>
    {kicker && <small className={cx('fw-bold text-uppercase', onColor ? 'opacity-75' : 'text-primary')} style={{ letterSpacing: '.2em' }}>{kicker}</small>}
    <Tag className="display-sm">{title}</Tag>
    {text && (typeof text === 'string' ? <p className="fs-lg opacity-75">{text}</p> : text)}
  </header>
);

export { SectionHead };

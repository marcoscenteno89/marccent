// Shared: no 'use client' (no state or effects): the canvas mounts from data-component="animation" (visuals/canvas-scanner.js).

/**
 * CanvasBand: a full-width section with a live canvas animation behind its content, drawn in the theme colors (or
 * the section's own, in section scope). The canvas runs only while on screen; the content is centered over it.
 * Built from .stack (one cell, layers on top of each other); only the height and the content's column are inline:
 * minmax(0, 1fr), so the content shrinks to the band's width instead of sizing the column to its own (a phone).
 * @param {Object} props
 * @param {string} props.canvas - An animation name: "network-loop", "wave", "particle-flowfield", "blob"…
 * @param {string} [props.height='60vh'] - The least height (the content can make it taller).
 * @param {string} [props.id] @param {string} [props.label] - aria-labelledby target id, when the content has a heading.
 * @param {React.ReactNode} [props.children]
 */
const CanvasBand = ({ canvas, height = '60vh', id, label, children }) => (
  <section id={id} className="wrap wrap-fluid pad-0 stack" style={{ minHeight: height }} aria-labelledby={label}>
    <div data-component="animation" data-name={canvas} className="bg w-100 h-100" aria-hidden="true" />
    {children && <div className="col-center pad text-center" style={{ position: 'relative', gridTemplateColumns: 'minmax(0, 1fr)' }}>{children}</div>}
  </section>
);

export { CanvasBand };

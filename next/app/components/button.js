// No 'use client': Button has no state, so server components (home page, AppCard) can render it.
// Client components import it the same way.
import Link from 'next/link';
import Icon from '@/components/icon';

const cx = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Button: icon on the left, label on the right (styles: .btn / .btn-text / .btn-link in components.css).
 * With an icon it looks like a button; the label hides below 8rem, leaving the icon, so the label is also
 * its aria-label/title. Without an icon it looks like a plain text link.
 * Renders a next/link <Link> when href is given, otherwise a <button type="button">.
 * Icon-only buttons need an aria-label.
 *
 * @param {Object} props
 * @param {string|false} [props.icon=false] - Icon name, rendered with <Icon> (components/icon.js):
 *   "star" → fa-solid fa-star. Starting with "fa-" it is taken as full classes instead, for other families
 *   or extra classes: "fa-brands fa-github", "fa-solid fa-plus display-6".
 * @param {string} [props.href] - Makes it a link.
 * @param {string} [props.className] - Extra classes.
 * @param {React.ReactNode} [props.children] - The label.
 * @returns {JSX.Element}
 *
 * @example <Button icon="message" href="/contact">Message Me</Button>
 * @example <Button icon="fa-brands fa-github" href={github}>Github</Button>
 * @example <Button onClick={reset}>Start Over</Button>  // text link
 */
const Button = ({ icon = false, href, className, children, ...rest }) => {
  if (!icon) {
    const cls = cx('btn-link', className);
    if (href) return <Link href={href} className={cls} {...rest}>{children}</Link>;
    return <button type="button" className={cls} {...rest}>{children}</button>;
  }
  const label = typeof children === 'string' ? children : undefined;
  const props = {
    className: cx('btn', className),
    ...(children && { 'aria-label': label, title: label }), // the label may hide, so it is also the accessible name
    ...rest,
  };
  const content = (
    <>
      {icon.startsWith('fa-')
        ? <Icon family={false} className={cx(icon, 'btn-icon')} />
        : <Icon name={icon} className="btn-icon" />}
      {children && <span className="btn-text">{children}</span>}
    </>
  );
  if (href) return <Link href={href} {...props}>{content}</Link>;
  return <button type="button" {...props}>{content}</button>;
}

export { Button };

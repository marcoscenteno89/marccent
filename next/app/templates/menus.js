import Link from 'next/link';
import { apps } from '@/components/server/list';

// Shared menus: edit a link here and the header, hero and contact page all pick it up.
// name: visible text. label: aria-label for icon-only links. icon: full Font Awesome classes.
// external: opens in a new tab (spread target/rel from externalProps); internal links stay in the site.

export const social = [
  { name: 'Message Me', href: '/contact', label: 'Message Me', icon: 'fa-solid fa-message', external: false },
  { name: 'Codepen', href: 'https://codepen.io/marcos-centeno/pens/public', label: 'Codepen Link', icon: 'fa-brands fa-codepen', external: true },
  { name: 'Linkedin', href: 'https://www.linkedin.com/in/marcos-centeno-0b1a7b65/', label: 'Linkedin Link', icon: 'fa-brands fa-linkedin', external: true },
  { name: 'Github', href: 'https://github.com/marcoscenteno89', label: 'Github Link', icon: 'fa-brands fa-github', external: true },
];

// Contact page: email first, then the external links (Message Me would point at the page itself).
export const contact = [
  { name: 'Email', href: 'mailto:marcoscenteno89@gmail.com', label: 'Email Me', icon: 'fa-solid fa-envelope', external: true },
  ...social.filter(s => s.external),
];

// Main navigation. An item with children is a dropdown; its href is the "browse all" page.
// Apps come from components/server/list, so adding an app there adds it here too.
export const main = [
  { name: 'About Me', href: '/about' },
  {
    name: 'Apps',
    href: '/apps',
    children: [
      { name: 'Browse Apps', href: '/apps' },
      ...apps.map(app => ({ name: app.name, href: app.url, icon: `fa-solid ${app.icon}` })),
    ],
  },
  { name: 'Theme', href: '/theme' },
  { name: 'Contact', href: '/contact' },
];

// Usage: <a href={s.href} {...externalProps(s)}>
export const externalProps = (link) => link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

// Joins class names, skipping empty ones.
const cx = (...names) => names.filter(Boolean).join(' ');

/**
 * Menu: renders any menu above (styles: .menu-* in styles/components.css).
 * No hooks, so it works in server and client components. An item with children becomes a
 * <details> dropdown; it stays open after navigating unless the parent closes it (see header.tsx).
 *
 * Classes: every part takes extra classes. A menu item can also carry its own className.
 * layout replaces the default layout classes; use it to swap them (adding e.g. "fixed" next to
 * "auto-cols" through className would just conflict). Extra gap-* classes override gap-0.
 *
 * @param {Object} props
 * @param {Array} props.items - A menu, e.g. main or social. Item: { name, href, icon?, label?, external?, className?, children? }.
 * @param {string} props.label - aria-label for the <nav>, e.g. "Main".
 * @param {boolean} [props.iconOnly] - Show icons only; the item's label becomes the aria-label.
 * @param {string} [props.className] - Extra classes for the <nav>.
 * @param {string} [props.layout] - Replaces the default layout classes (text: "fixed", icon-only: "auto-cols cols-center").
 * @param {string} [props.linkClassName] - Extra classes for every link (dropdown links included).
 * @param {string} [props.dropdownClassName] - Extra classes for each dropdown <details>.
 * @param {string} [props.panelClassName] - Extra classes for each dropdown panel.
 *
 * @example <Menu items={main} label="Main" />
 * @example <Menu items={social} label="Social" iconOnly />
 * @example <Menu items={contact} label="Contact" iconOnly className="divide border round" linkClassName="fs-lg" />
 * @example <Menu items={main} label="Footer" layout="grid cols-1" />
 */
// Text menus split the width into equal columns (fixed). Icon-only menus size each column to its icon,
// so every link is a square, and center the group when the nav is wider than the icons.
export const Menu = ({ items, label, iconOnly = false, className, layout, linkClassName, dropdownClassName, panelClassName }) => {
  const defaultLayout = iconOnly ? 'auto-cols cols-center' : 'fixed';
  return (
    <nav
      className={cx('menu grid gap-0 items-center', layout ?? defaultLayout, className)}
      style={!layout && !iconOnly ? { '--cols': items.length } : undefined}
      aria-label={label}
    >
      {items.map(item => item.children
        ? <MenuDropdown key={item.name} item={item} className={dropdownClassName} panelClassName={panelClassName} linkClassName={linkClassName} />
        : <MenuLink key={item.href} item={item} iconOnly={iconOnly} className={linkClassName} />
      )}
    </nav>
  );
};

const MenuLink = ({ item, iconOnly, className }) => (
  <Link
    href={item.href}
    className={cx('menu-link', className, item.className)}
    aria-label={iconOnly ? item.label ?? item.name : undefined}
    title={iconOnly ? item.name : undefined}
    {...externalProps(item)}
  >
    {item.icon && <i className={item.icon} aria-hidden="true"></i>}
    {!iconOnly && <span>{item.name}</span>}
  </Link>
);

const MenuDropdown = ({ item, className, panelClassName, linkClassName }) => (
  <details className={cx('menu-dropdown', className, item.className)}>
    <summary className={cx('menu-link', linkClassName)}>
      {item.icon && <i className={item.icon} aria-hidden="true"></i>}
      <span>{item.name}</span>
    </summary>
    <div className={cx('menu-panel bg border round shadow-md pad grid cols-1 gap-1', panelClassName)}>
      {item.children.map(child => <MenuLink key={child.href + child.name} item={child} className={linkClassName} />)}
    </div>
  </details>
);

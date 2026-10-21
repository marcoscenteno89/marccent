import Link from 'next/link';
import { cx } from '@/lib/cx';
import { apps } from '@/components/apps/list';

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
// Apps come from components/apps/list, so adding an app there adds it here too.
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
  {
    name: 'Design',
    href: '/theme',
    children: [
      { name: 'Theme', href: '/theme', icon: 'fa-solid fa-palette' },
      { name: 'Shapes', href: '/shapes', icon: 'fa-solid fa-shapes' },
      { name: 'Widgets', href: '/widgets', icon: 'fa-solid fa-puzzle-piece' },
    ],
  },
  { name: 'Contact', href: '/contact' },
];

// Usage: <a href={s.href} {...externalProps(s)}>
export const externalProps = (link) => link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

/**
 * Menu: renders any menu above (styles: .menu-* in styles/components.css).
 * No hooks, so it works in server and client components. An item with children becomes a
 * <details> dropdown; it stays open after navigating unless the parent closes it (see header.tsx).
 *
 * Classes: the nav only gets "menu grid fixed gap-0" (.menu is the hook for styles/components.css);
 * everything else (dividers, border, alignment) is passed in. layout replaces "fixed", e.g.
 * "auto-cols cols-center" for icon-only menus (adding it through className would conflict with fixed).
 * Every part takes extra classes; a menu item can also carry its own className.
 *
 * @param {Object} props
 * @param {Array} props.items - A menu, e.g. main or social. Item: { name, href, icon?, label?, external?, className?, children? }.
 * @param {string} props.label - aria-label for the <nav>, e.g. "Main".
 * @param {boolean} [props.iconOnly] - Show icons only; the item's label becomes the aria-label.
 * @param {string} [props.className] - Extra classes for the <nav>.
 * @param {Object} [props.style] - Inline styles for the <nav> (may override --cols).
 * @param {string} [props.layout="fixed"] - Replaces "fixed": e.g. "auto-cols cols-center" (icons sized to fit,
 *   centered) or "cols-1" (stacked).
 * @param {string} [props.linkClassName] - Extra classes for every link (dropdown links included).
 * @param {string} [props.dropdownClassName] - Extra classes for each dropdown <details>.
 * @param {string} [props.panelClassName] - Extra classes for each dropdown panel.
 *
 * @example <Menu items={main} label="Main" />
 * @example <Menu items={social} label="Social" iconOnly layout="auto-cols cols-center" />
 * @example <Menu items={contact} label="Contact" iconOnly layout="auto-cols cols-center" className="divide border round" />
 * @example <Menu items={main} label="Footer" layout="cols-1" />
 */
// fixed (default) splits the width into equal columns, one per item (--cols).
export const Menu = ({ items, label, iconOnly = false, className, style, layout = 'fixed', linkClassName, dropdownClassName, panelClassName }) => {
  return (
    <nav
      className={cx('menu grid gap-0', layout, className)}
      style={{ '--cols': items.length, ...style }}
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
    {!iconOnly && <span className="text-truncate">{item.name}</span>}
  </Link>
);

const MenuDropdown = ({ item, className, panelClassName, linkClassName }) => (
  <details className={cx('menu-dropdown', className, item.className)}>
    <summary className={cx('menu-link', linkClassName)}>
      {item.icon && <i className={item.icon} aria-hidden="true"></i>}
      <span className="text-truncate">{item.name}</span>
    </summary>
    <div className={cx('menu-panel bg border round shadow pad grid cols-1 gap-sm', panelClassName)}>
      {item.children.map(child => <MenuLink key={child.href + child.name} item={child} className={linkClassName} />)}
    </div>
  </details>
);

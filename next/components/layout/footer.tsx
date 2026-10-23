import { dt } from "@/lib/sac";
import { ThemeEditor } from 'marccent-theme/components/theme/editor';
import { Menu, main, contact } from '@/components/layout/menus';
import { Logo } from '@/components/brand/logo';
import Markdown from '@/components/markdown';
import { site } from '@/lib/content';

// The footer's site links: each top-level menu item once (a dropdown's own page, e.g. Design → /theme).
const explore = main.map(({ name, href }) => ({ name, href }));

export default function Footer() {
  return (
    // Like the header: the background spans the screen (wrap wrap-fluid gives the side padding), the inner .wrap caps
    // the content at --wrap-max (pad-0: no second side padding). Grid only: the parts are spaced by gap (the body grid
    // spaces the footer from main). On top the site's full theme editor; then the logo and what the site is (the theme's
    // demo), the site links and the contact links; then the copyright.
    <footer className="wrap wrap-fluid bg pad-y-lg" id="footer">
      <div className="wrap pad-0 grid cols-1 gap-lg">
        <ThemeEditor scope="site" />
        <div className="grid gap-lg layout-2-1-1">
          <div className="grid cols-1 gap-sm content-start">
            <Logo currentText height="2.25rem" />
            <Markdown text={site.footerBlurb} className="opacity-75" />
          </div>
          <div className="grid cols-1 gap-sm content-start">
            <h2 className="h6 text-uppercase opacity-75">{site.footerExplore}</h2>
            <Menu items={explore} label="Footer" layout="cols-1 justify-start" style={{ '--cols': 1 }} />
          </div>
          <div className="grid cols-1 gap-sm content-start">
            <h2 className="h6 text-uppercase opacity-75">{site.footerConnect}</h2>
            <Menu items={contact} label="Connect" layout="cols-1 justify-start" style={{ '--cols': 1 }} />
          </div>
        </div>
        <Markdown text={site.footer(dt.getFullYear())} className="text-center" />
      </div>
    </footer>
  );
};

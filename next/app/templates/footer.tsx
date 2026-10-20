import { dt } from "@/components/sac";
import { ThemesWT } from '@/components/client/theme-slider';
import { AnimListWT } from '@/components/client/animations';
import Markdown from '@/components/server/markdown';
import { site } from '@/components/server/content';

export default function Footer() {
  return (
    // The footer's background spans the screen; the inner .wrap caps the content at --wrap-max like other sections.
    // Grid only: the parts are spaced by gap (the body grid spaces the footer from main).
    <footer className="bg pad-y-lg" id="footer">
      <div className="wrap grid cols-1">
        <AnimListWT />
        <ThemesWT />
        <Markdown text={site.footer(dt.getFullYear())} className="text-center" />
      </div>
    </footer>
  );
};
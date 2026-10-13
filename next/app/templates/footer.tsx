import { dt } from "@/components/sac";
import { ThemesWT, AnimListWT } from '@/components/client/theme';
import Markdown from '@/components/server/markdown';
import { site } from '@/components/server/content';

export default function Footer() {
  return (
    // Grid only: the parts are spaced by gap; .pad gives the edge space (the body grid spaces it from main).
    <footer className="wrap wrap-fluid bg" id="footer">
      <div className="wrap pad grid cols-1 gap-3">
        <AnimListWT />
        <ThemesWT />
        <Markdown text={site.footer(dt.getFullYear())} className="text-center" />
      </div>
    </footer>
  );
};
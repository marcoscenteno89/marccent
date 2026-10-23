import { ImageResponse } from 'next/og';
import { site } from '@/lib/content';

/*
 * The social image (Open Graph and Twitter cards) for every page: the brand hexagon, the name and the tagline on the
 * brand's dark background, in the brand colors (public/brand/brand-guide.md), whatever theme a visitor picks.
 */

export const alt = `${site.title}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PRIMARY = '#1f64cf', SECONDARY = '#1ecbe1', DARK = '#1a1a1a';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, gap: 28,
        backgroundColor: DARK, backgroundImage: `radial-gradient(circle at 85% 20%, ${PRIMARY}55, transparent 55%)`, color: '#fff', fontFamily: 'sans-serif' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor={PRIMARY} /><stop offset="1" stopColor={SECONDARY} /></linearGradient></defs>
          <polygon points="60,8 105,34 105,86 60,112 15,86 15,34" fill="url(#g)" />
        </svg>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>
          marc<span style={{ color: SECONDARY }}>cent_</span>
        </div>
        <div style={{ display: 'flex', fontSize: 40, opacity: .85, maxWidth: 900 }}>{site.tagline}</div>
        <div style={{ display: 'flex', fontSize: 28, color: SECONDARY }}>by {site.author.name} · {site.url.replace('https://', '')}</div>
      </div>
    ),
    size,
  );
}

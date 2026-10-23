import { Button } from 'marccent-theme/components/ui/button';
import { Logo } from '@/components/brand/logo';

/*
 * 404: shown for any URL with no page (Next.js uses app/not-found.js for every unknown route), inside the site's
 * layout and theme instead of Next.js's own built-in page. Built from the theme's classes.
 */

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="wrap">
      <div className="bg border round shadow pad col-center text-center gap-lg" style={{ minHeight: '50vh' }}>
        <div className="grid cols-1 gap-sm justify-center">
          <Logo mark height="5rem" />
          <span className="display-lg fw-bold text-primary">404</span>
          <h1 className="fs-lg">This page could not be found</h1>
          <p className="opacity-75">It may have moved, or the link may be wrong.</p>
        </div>
        <div className="row-wrap gap-sm cols-center">
          <Button icon="house" href="/" className="primary">Go home</Button>
          <Button icon="message" href="/about#contact" className="outline-primary">Contact me</Button>
        </div>
      </div>
    </section>
  );
}

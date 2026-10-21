import type { Metadata } from 'next';
import '@/styles/main.css'; // all styles, in cascade order (styles/main.css); the optional theme is picked there
import { UpdateThemeVariables } from "@/components/theme/core";
import { CurrentAnimWT } from "@/components/visuals/animations";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Body } from '@/components/theme/core';
import { ThemeProvider, ToastProvider } from "@/lib/context";
import { Toast } from '@/components/ui/toast';
import { Goo } from '@/components/ui/goo';
import { Analytics } from '@/components/analytics';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const debug = process.env.DEBUG === 'true'; // read on the server; local work isn't tracked

  return (
    <html lang="en" className="">
      <ThemeProvider>
        <ToastProvider>
          {/* Body is a 1-col grid: header, main and footer are spaced by its gap. It is also the container (.cq)
              the header's layout-ends measures, since an element can't measure itself. */}
          <Body className="cq grid cols-1 gap-0">
            <div className="fixed-layer back">
              <CurrentAnimWT id="main" />
            </div>
            <Header />
            <main className="grid cols-1 gap-lg">{children}</main>
            <Footer />
            <Toast />
            <Goo /> {/* the #goo SVG filter hover-goo uses (styles/hovers.css) */}
            <UpdateThemeVariables />
            <Analytics enabled={!debug} />
          </Body>
        </ToastProvider>
      </ThemeProvider>
    </html>
  )
}
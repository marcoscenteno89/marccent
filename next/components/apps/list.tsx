import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { apps as text } from '@/lib/content';

// Components load lazily, so importing this list (header, cards) doesn't pull every app's code into the page.
const MineSweeper = dynamic(() => import('@/components/apps/minesweeper'));
const NumPuz = dynamic(() => import('@/components/apps/numpuz'));
const Weather = dynamic(() => import('@/components/apps/weather'));
const StockLookup = dynamic(() => import('@/components/apps/stock_lookup'));

export type App = {
  name: string;
  url: string;
  icon: string;
  about: string;        // Markdown
  instructions: string; // Markdown
  component: ComponentType;
  layout?: 'side' | 'full'; // side: app left, text right. full (default): app on top, text below.
};

// Add a new app here; the apps page, home page, header and /apps/[slug] route all read from this list.
// name, about and instructions live in lib/content.js (keyed by slug); about and instructions are Markdown.
export const apps: App[] = [
  {
    name: text.minesweeper.name,
    url: '/apps/minesweeper',
    icon: 'fa-bomb',
    about: text.minesweeper.about,
    instructions: text.minesweeper.instructions,
    component: MineSweeper,
    layout: 'side',
  },
  {
    name: text.numpuz.name,
    url: '/apps/numpuz',
    icon: 'fa-hashtag',
    about: text.numpuz.about,
    instructions: text.numpuz.instructions,
    component: NumPuz,
    layout: 'side',
  },
  {
    name: text.weather.name,
    url: '/apps/weather',
    icon: 'fa-temperature-half',
    about: text.weather.about,
    instructions: text.weather.instructions,
    component: Weather,
  },
  {
    name: text.stock_lookup.name,
    url: '/apps/stock_lookup',
    icon: 'fa-chart-line',
    about: text.stock_lookup.about,
    instructions: text.stock_lookup.instructions,
    component: StockLookup,
  },
];

export const findApp = (slug: string) => apps.find(app => app.url === `/apps/${slug}`);

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // The theme (marccent-theme, github:marcoscenteno89/marccent-theme) ships source: JSX and CSS imports, compiled with the site.
  transpilePackages: ['marccent-theme'],
  // While the theme is linked to ~/app/marccent-theme (npm run dev:link), its imports (react, next…) would find that
  // folder's own node_modules: a second React and Next, which breaks hooks and the router. The site's copies come first.
  webpack: (config) => {
    config.resolve.modules = [path.resolve(__dirname, 'node_modules'), ...(config.resolve.modules ?? ['node_modules'])];
    return config;
  },
  // output: "standalone",
  // Contact now lives on the About page; old links and search results land on its form.
  async redirects() {
    return [
      { source: '/contact', destination: '/about#contact', permanent: true },
      // Photos moved to the img R2 bucket; anything still asking for /img/… (the theme's Collage) goes there.
      { source: '/img/:file', destination: 'https://img.marccent.com/marccent/:file', permanent: false },
    ];
  },
}

module.exports = nextConfig

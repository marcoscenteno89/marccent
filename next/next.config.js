/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // The theme (marccent-theme, github:marcoscenteno89/marccent-theme) ships source: JSX and CSS imports, compiled with the site.
  transpilePackages: ['marccent-theme'],
  // output: "standalone",
  // Contact now lives on the About page; old links and search results land on its form.
  async redirects() {
    return [ { source: '/contact', destination: '/about#contact', permanent: true } ];
  },
}

module.exports = nextConfig

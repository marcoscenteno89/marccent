/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // output: "standalone",
  // Contact now lives on the About page; old links and search results land on its form.
  async redirects() {
    return [ { source: '/contact', destination: '/about#contact', permanent: true } ];
  },
}

module.exports = nextConfig

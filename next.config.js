/** @type {import('next').NextConfig} */
const nextConfig = {
  // The `rewrites` function allows us to proxy requests to other servers.
  // This is the key to a gradual migration strategy.
  async rewrites() {
    return {
      // The fallback rewrite is executed if no other route is matched.
      // We will use this to proxy all non-Next.js routes to the old
      // React SPA (Vite) server.
      fallback: [
        {
          // The source is any path that wasn't matched by a Next.js page.
          source: '/:path*',
          // The destination is the Vite development server, which runs on port 8080 by default.
          destination: 'http://localhost:8080/:path*',
        },
      ],
    }
  },
};

export default nextConfig;

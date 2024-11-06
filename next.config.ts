import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    console.log('Setting CORS headers for widget.js');
    return [
      {
        source: '/widget.js',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM *'
          },
          {
            key: 'Content-Type',
            value: 'application/javascript'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*'
          }
        ]
      }
    ]
  },
  async rewrites() {
    console.log('Processing rewrite for widget.js');
    return [
      {
        source: '/widget.js',
        destination: '/public/widget.js'
      }
    ]
  }
}

module.exports = nextConfig

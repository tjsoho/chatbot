/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
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
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/widget.js',
        destination: '/public/widget.js'
      }
    ]
  }
}

module.exports = nextConfig

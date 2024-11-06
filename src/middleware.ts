import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get hostname (e.g. admin.sloane.biz, chatbot-sigma-flax.vercel.app)
  const hostname = request.headers.get('host')

  // If it's the admin subdomain, let the request continue to the admin route
  if (hostname?.startsWith('admin.')) {
    return NextResponse.rewrite(new URL('/admin' + request.nextUrl.pathname, request.url))
  }

  // For all other hostnames, serve the chat widget
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g., images, fonts)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
} 
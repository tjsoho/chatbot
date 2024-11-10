import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get hostname (e.g. admin.sloane.biz, chatbot-sigma-flax.vercel.app)
  const hostname = request.headers.get('host')
  const path = request.nextUrl.pathname

  // If it's the admin subdomain, handle admin routes
  if (hostname?.startsWith('admin.')) {
    // List of valid admin routes
    const validAdminRoutes = [
      '/admin',
      '/admin/dashboard',
      '/admin/chats',
      '/admin/config',
      // Add any other admin routes here
    ]

    // Check if the requested path (minus /admin prefix) is valid
    const requestedAdminPath = '/admin' + path
    if (validAdminRoutes.includes(requestedAdminPath)) {
      return NextResponse.rewrite(new URL(requestedAdminPath, request.url))
    }

    // If not a valid admin route, could redirect to admin dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
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
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get hostname and path
  const hostname = request.headers.get('host')
  const path = request.nextUrl.pathname

  // If it's the admin subdomain
  if (hostname?.startsWith('admin.')) {
    // Valid admin routes
    const validRoutes = [
      '/admin',
      '/admin/dashboard',
      '/admin/chats',
      '/admin/config'
    ]

    // If at root, redirect to admin dashboard
    if (path === '/') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // If it's a valid admin route, let it through
    if (validRoutes.includes(path)) {
      return NextResponse.next()
    }

    // If path doesn't include /admin prefix, check if it's a valid route with prefix
    if (!path.startsWith('/admin')) {
      const pathWithPrefix = `/admin${path}`
      if (validRoutes.includes(pathWithPrefix)) {
        return NextResponse.rewrite(new URL(pathWithPrefix, request.url))
      }
    }

    // For all other paths on admin subdomain, let them through
    return NextResponse.next()
  }

  // For all other hostnames, serve the chat widget
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
} 
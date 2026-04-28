import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that are reserved by the app — never treated as clinic slugs
const RESERVED_PATHS = new Set([
  '/',
  '/login',
  '/signup',
  '/onboarding',
  '/pricing',
  '/widget',
  '/sites',
  '/api',
  '/app',
])

function isReservedPath(pathname: string): boolean {
  if (RESERVED_PATHS.has(pathname)) return true
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/app/') ||
    pathname.startsWith('/widget/') ||
    pathname.startsWith('/sites/') ||
    pathname.startsWith('/_next/')
  )
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl

  // Doctor website pages are public — skip Supabase session update
  // They match /:slug where slug is not a reserved path
  const segments = url.pathname.split('/').filter(Boolean)
  if (segments.length === 1 && !isReservedPath(url.pathname)) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|widget).*)',
  ],
}

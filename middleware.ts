import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl
  
  // If there's an auth code at the root, redirect to the auth callback route
  if (pathname === '/' && searchParams.has('code')) {
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'
    const callbackUrl = new URL('/auth/callback', request.url)
    callbackUrl.searchParams.set('code', code!)
    callbackUrl.searchParams.set('next', next)
    return NextResponse.redirect(callbackUrl)
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

const PROTECTED_PREFIXES = ['/mon-compte', '/paiement', '/ebooks/']
const AUTH_PAGES = ['/login', '/inscription']

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const needsAuth = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
  const isAuthPage = AUTH_PAGES.some(page => pathname.startsWith(page))
  const isAdmin = pathname.startsWith('/admin')

  if (!needsAuth && !isAuthPage && !isAdmin) {
    return NextResponse.next()
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    if (needsAuth || isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  const { supabase, response, user } = await createMiddlewareClient(request)

  if (!user) {
    if (needsAuth || isAdmin) {
      const login = new URL('/login', request.url)
      login.searchParams.set('next', pathname)
      return NextResponse.redirect(login)
    }
    return response
  }

  if (isAuthPage) {
    const next = request.nextUrl.searchParams.get('next')
    const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/mon-compte'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  if (isAdmin) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/mon-compte', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/mon-compte/:path*',
    '/paiement/:path*',
    '/ebooks/:path*/lecture',
    '/login',
    '/inscription',
  ],
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow /admin/login without auth
  if (pathname === '/admin/login') {
    const response = NextResponse.next()
    return updateSession(request, response)
  }

  // Protect /admin/* and /api/admin/*
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const response = NextResponse.next()
    const supabase = createMiddlewareClient(request, response)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())

    if (!adminEmails.includes(user.email?.toLowerCase() || '')) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }

    return response
  }

  return NextResponse.next()
}

function createMiddlewareClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
}

async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createMiddlewareClient(request, response)
  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

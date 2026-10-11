
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/website',
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) =>
      pathname === path ||
      (path !== '/' && pathname.startsWith(`${path}/`))
  )
}

function redirectWithCookies(
  request: NextRequest,
  source: NextResponse,
  pathname: string
) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''

  const redirect = NextResponse.redirect(url)

  source.cookies.getAll().forEach((cookie) =>
    redirect.cookies.set(cookie)
  )

  return redirect
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          response = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Allow visitors to access the public Jeevan Sutra website.
  if (isPublicPath(pathname)) {
    if (user && pathname === '/login') {
      return redirectWithCookies(request, response, '/employee')
    }

    response.headers.set('Cache-Control', 'private, no-store')
    return response
  }

  // Protect employee and other private application routes.
  if (!user) {
    return redirectWithCookies(request, response, '/login')
  }

  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

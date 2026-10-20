import { NextResponse } from "next/server"
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  if(request.nextUrl.pathname === "/" && ["jeevansutra.co.in","www.jeevansutra.co.in"].includes(request.nextUrl.hostname)){const u=request.nextUrl.clone();u.pathname="/website";return NextResponse.redirect(u)}
  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}

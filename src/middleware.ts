import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware" 
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // If user is logged in and tries to access auth pages
    if (token && 
        (url.pathname.startsWith('/sign-in') ||
         url.pathname.startsWith('/sign-up') || 
         url.pathname.startsWith('/verify'))
    ) {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    // If user is not logged in and tries to access protected pages
    // if (!token && url.pathname === '/') {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }

    return NextResponse.next()
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*'
  ]
}
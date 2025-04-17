import { NextResponse } from 'next/server';

export async function middleware(request: any) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/write-email', '/home', '/dashboard/:path*', '/admin', '/write_email'];

  // Check if the current route is protected
  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route.replace('/:path*', '')))) {
    console.log('Cookies sent:', request.headers.get('cookie')); // Debug cookies
    const authResponse = await fetch('http://localhost:8000/api/check-auth', {
      method: 'GET',
      headers: {
        ...(request.headers.get('cookie') && { Cookie: request.headers.get('cookie') }),
      },
      credentials: 'include',
    });

    console.log('Auth response status:', authResponse.status); // Debug response
    if (!authResponse.ok) {
      console.error('Auth check failed:', authResponse.status, authResponse.statusText);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const authData = await authResponse.json();
    if (!authData.is_authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect based on status
    if (pathname === '/write-email' && authData.status !== 'Normal') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    if (pathname !== '/write-email' && authData.status === 'Normal') {
      return NextResponse.redirect(new URL('/write-email', request.url));
    }
  }

  // Handle /login route
  if (pathname === '/login') {
    console.log('Cookies sent for login:', request.headers.get('cookie')); // Debug cookies
    const authResponse = await fetch('http://localhost:8000/api/check-auth', {
      method: 'GET',
      headers: {
        ...(request.headers.get('cookie') && { Cookie: request.headers.get('cookie') }),
      },
      credentials: 'include',
    });

    if (authResponse.ok) {
      const authData = await authResponse.json();
      if (authData.is_authenticated) {
        if (authData.status === 'Normal') {
          return NextResponse.redirect(new URL('/write_email', request.url));
        } else {
          return NextResponse.redirect(new URL('/home', request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/write-email', '/home', '/dashboard/:path*', '/login', '/admin', '/write_email'],
};
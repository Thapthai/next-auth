import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from "@/route";

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req;
    const token = req.nextauth.token;
    const isLoggedIn = !!token;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return NextResponse.next();

    // ป้องกันการเข้าหน้า /2fa โดยตรง ถ้าไม่มี token
    if (nextUrl.pathname === '/2fa') {
      const token = nextUrl.searchParams.get('token');
      if (!token) {
        return NextResponse.redirect(new URL('/login', nextUrl));
      }
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

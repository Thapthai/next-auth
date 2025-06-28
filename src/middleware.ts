import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from "@/route";

import {
  admin,
  manager,
  header,
  user,
  customer
} from "@/premissionRoute";

interface MyUser {
  id: number;
  email: string;
  permission: number;
  name?: string | null;
  image?: string | null;
}

// Define role types for better type safety
type UserRole = 1 | 2 | 3 | 4 | 5;

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

    let userData: MyUser | undefined;

    if (token?.user) {
      userData = token.user as MyUser;
    } else {
      console.log("Not logged in or no user in token");
    }

    // ============== Permission Path ==============
    const permission = userData?.permission as UserRole;
    const roleAccessMap: Record<UserRole, string[]> = {
      1: admin,
      2: manager,
      3: header,
      4: user,
      5: customer,
    };

    if (!permission || !roleAccessMap[permission]) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }

    const allowedPaths = roleAccessMap[permission];
    const isAllowed = allowedPaths.some((path) => nextUrl.pathname.startsWith(path));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
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

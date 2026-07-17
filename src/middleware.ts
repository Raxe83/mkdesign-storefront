import { NextRequest, NextResponse } from "next/server";

/**
 * Edge-Runtime — kein Node.js-Crypto möglich.
 * Wir prüfen nur die Cookie-Existenz; die echte Token-Validierung
 * passiert in den Server Components / Route Handlers via session.ts.
 */
const COOKIE_NAME = "mk_session";

const PROTECTED_PATHS = ["/pages/account"];
const LOGIN_PATH = "/pages/login";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasSession = request.cookies.has(COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    // Ursprüngliches Ziel als Query-Parameter weitergeben
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pages/account/:path*"],
};

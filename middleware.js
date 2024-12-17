import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("authToken");
  const pathname = request.nextUrl.pathname;

  // Redirect logged-in users from /login or /signup to /account/properties
  if ((pathname === "/login" || pathname === "/signup") && token) {
    const accountUrl = new URL("/account/properties", request.url);
    return NextResponse.redirect(accountUrl);
  }

  // Redirect unauthenticated users trying to access private routes
  const isPrivateRoute =
    pathname.startsWith("/account") || pathname.startsWith("/admin");
  if (isPrivateRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/account/:path*", "/admin/:path*"],
};

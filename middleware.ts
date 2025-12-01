import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const baseUrl = req.nextUrl.origin;

  // If user is authenticated and tries to access auth pages, redirect to home
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/", baseUrl));
  }

  // Require authentication for all routes except auth pages
  if (!isAuthenticated && !isAuthPage) {
    const loginUrl = new URL("/auth/login", baseUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};


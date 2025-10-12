import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuthenticated = !!accessToken;

  const path = request.nextUrl.pathname;

  // Define protected routes (private folder)
  const isPrivateRoute = path.startsWith("/dashboard");

  // Define auth routes
  const isAuthRoute =
    path.startsWith("/login") ||
    path.startsWith("/create-admin") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/verify-otp") ||
    path.startsWith("/onboarding");

  // Redirect logic for private routes
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logic for auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/create-admin",
    "/forgot-password",
    "/verify-otp",
    "/onboarding",
  ],
};

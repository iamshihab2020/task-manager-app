import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/auth/login" || path === "/auth/register" || path === "/";
  const isPrivatePath = path === "/dashboard" || path.startsWith("/api/tasks");

  const token = request.cookies.get("auth-token")?.value || "";

  let userPayload = null;
  if (token) {
    try {
      userPayload = verifyToken(token);
    } catch (error) {
      console.error("🚀 Token verification failed:", error);
    }
  }

  const isAuthenticated = !!userPayload;

  if (
    isPublicPath &&
    isAuthenticated &&
    (path === "/auth/login" || path === "/auth/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (isPrivatePath && !isAuthenticated) {
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  if (path.startsWith("/api/tasks") && userPayload) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", userPayload.userId);
    requestHeaders.set("x-user-email", userPayload.email);
    requestHeaders.set("x-user-name", userPayload.name);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/api/.*",
    "/auth/login",
    "/auth/register",
    "/dashboard",
  ],
};

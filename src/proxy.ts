import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js RBAC Proxy (Middleware)
 *
 * Route group (dashboard) has NO URL segment — actual URLs are:
 *   /patient/*  → requires "patient" role
 *   /doctor/*   → requires "doctor" role
 *   /admin/*    → requires "admin" role
 */

type UserRole = "patient" | "doctor" | "admin";

const ROUTE_ROLE_MAP: Record<string, UserRole> = {
  "/patient": "patient",
  "/doctor": "doctor",
  "/admin": "admin",
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getRequiredRole(pathname: string): UserRole | null {
  for (const [prefix, role] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return role;
    }
  }
  return null;
}

function getRoleFromCookie(request: NextRequest): UserRole | null {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (refreshToken) {
    const payload = decodeJwtPayload(refreshToken);
    const role = payload?.role;
    if (role === "patient" || role === "doctor" || role === "admin") {
      return role as UserRole;
    }
  }
  const roleCookie = request.cookies.get("medivantage-role")?.value;
  if (
    roleCookie === "patient" ||
    roleCookie === "doctor" ||
    roleCookie === "admin"
  ) {
    return roleCookie as UserRole;
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userRole = getRoleFromCookie(request);

  const requiredRole = getRequiredRole(pathname);

  // Protected routes that require any authenticated user (no specific role)
  const authOnlyPaths = ["/doctors", "/medicines"];
  const requiresAuth =
    requiredRole !== null ||
    authOnlyPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!requiresAuth) return NextResponse.next();

  if (!userRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-specific routes — redirect to own dashboard if wrong role
  if (requiredRole !== null && userRole !== requiredRole) {
    return NextResponse.redirect(new URL(`/${userRole}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
    "/doctors",
    "/doctors/:path*",
    "/medicines",
    "/medicines/:path*",
  ],
};

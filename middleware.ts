import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROOT: Record<string, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

// /gear/[id]/edit lives outside /dashboard (so it can share the public gear
// URL space), but it's a provider-only action. It used to be reachable by
// anyone — logged out or not — since only /dashboard/* was guarded here.
const PROVIDER_ONLY_PATTERN = /^\/gear\/[^/]+\/edit\/?$/;

/**
 * Middleware to protect dashboard routes and provider-only actions, keeping
 * each signed-in user inside their own role's area.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isProviderOnlyRoute = PROVIDER_ONLY_PATTERN.test(pathname);

  if (!isDashboardRoute && !isProviderOnlyRoute) {
    return NextResponse.next();
  }

  const session = request.cookies.get("gearup-session")?.value;

  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { role } = JSON.parse(session) as { role?: string };
    const allowedRoot = role ? ROLE_ROOT[role] : undefined;

    if (!allowedRoot) {
      throw new Error("Invalid dashboard role");
    }

    if (isProviderOnlyRoute && role !== "PROVIDER") {
      return NextResponse.redirect(new URL(allowedRoot, request.url));
    }

    const requestedRoleRoot = Object.values(ROLE_ROOT).find((root) => pathname.startsWith(root));

    if (requestedRoleRoot && !pathname.startsWith(allowedRoot)) {
      return NextResponse.redirect(new URL(allowedRoot, request.url));
    }
  } catch {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/gear/:path*",
  ],
};

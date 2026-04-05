import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "@/lib/jwt";

const PUBLIC_ROUTES = ["/login", "/register"];
const ADMIN_ROUTES = ["/dashboard/users", "/dashboard/all-tasks"];
const MANAGER_ROUTES = [
    /^\/dashboard\/teams\/new$/,
    /^\/dashboard\/teams\/[^/]+\/edit$/,
    /^\/dashboard\/teams\/[^/]+\/tasks\/new$/,
    /^\/dashboard\/teams\/[^/]+\/tasks\/[^/]+\/edit$/
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect root to dashboard
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
    const isManagerRoute = MANAGER_ROUTES.some((regex) => regex.test(pathname));

    const token = request.cookies.get("token")?.value;

    // Unauthenticated user trying to access a protected route -> login
    if (!isPublic && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Authenticated user trying to access login/register -> dashboard
    if (isPublic && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Authenticated user trying to access a role-protected route (Admin or Manager)
    if ((isAdminRoute || isManagerRoute) && token) {
        const payload = decodeJwt(token);
        const roles = payload?.roles || [];

        // Check Admin-only routes
        if (isAdminRoute) {
            const isAdmin = roles.some(role => role === "ADMIN" || role === "ROLE_ADMIN");
            if (!isAdmin) {
                return NextResponse.redirect(new URL("/not-found", request.url));
            }
        }

        // Check Manager/Admin routes
        if (isManagerRoute) {
            const isManagerOrAdmin = roles.some(role =>
                ["ADMIN", "ROLE_ADMIN", "MANAGER", "ROLE_MANAGER"].includes(role)
            );
            if (!isManagerOrAdmin) {
                return NextResponse.redirect(new URL("/not-found", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * - _next/static  (static files)
         * - _next/image   (image optimization)
         * - favicon.ico
         * - api routes    (handled by Spring Boot or Next.js API routes)
         */
        "/((?!_next/static|_next/image|favicon.ico|api/).*)",
    ],
};
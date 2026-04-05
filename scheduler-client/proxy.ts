import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "@/lib/jwt";

const PUBLIC_ROUTES = ["/login", "/register"];
const ADMIN_ROUTES = ["/dashboard/users", "/dashboard/all-tasks"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect root to dashboard
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
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

    // Authenticated user trying to access an Admin-only route
    if (isAdminRoute && token) {
        const payload = decodeJwt(token);
        const roles = payload?.roles || [];

        const isAdmin = roles.some(role => role === "ADMIN" || role === "ROLE_ADMIN");

        if (!isAdmin) {
            // Redirect non-admins to the not-found page
            return NextResponse.redirect(new URL("/not-found", request.url));
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
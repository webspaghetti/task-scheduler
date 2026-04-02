import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
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
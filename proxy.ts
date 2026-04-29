import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { EUserRole, ISession } from "./types/user";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = (await auth()) as ISession | null;
    const role = session?.user?.role;

    // const resolvedPathname = pathname.startsWith('/auth/login') ? (role == 'player' ? '/players/dashboard' : role?.includes('admin') ? '/admin' : '/') : pathname

    // Define protected paths
    const isAdminPath = pathname.startsWith("/admin");
    const isPlayerDashboardPath = pathname.startsWith("/players/dashboard");

    // Check if path is protected
    const isProtectedPath = isAdminPath || isPlayerDashboardPath;

    // If NOT a protected path, allow access
    if (!isProtectedPath) {
        return NextResponse.next();
    }

    // If no session, redirect to login
    if (!session?.user) {
        return NextResponse.redirect(
            new URL(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
        );
    }


    // **FIXED LOGIC:**
    // Check admin access
    if (isAdminPath) {
        // Allow only admins
        if (role?.includes(EUserRole.ADMIN)) {
            return NextResponse.next(); // ✅ Admin can access admin routes
        }
        // Redirect non-admins
        if (role === EUserRole.PLAYER) {
            return NextResponse.redirect(new URL("/players/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/auth/not-authorized", request.url));
    }

    // Check player dashboard access
    if (isPlayerDashboardPath) {
        // Allow only players
        if (role === EUserRole.PLAYER) {
            return NextResponse.next(); // ✅ Player can access player dashboard
        }
        // Redirect non-players
        if (role?.includes(EUserRole.ADMIN)) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/auth/not-authorized", request.url));
    }



    // Default fallback (shouldn't reach here for protected paths)
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/players/dashboard/:path*",
    ],
};
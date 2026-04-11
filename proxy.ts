import { NextRequest, NextResponse } from "next/server";
import {jwtDecode,} from "jwt-decode";
import { EUserRole } from "./types/user";

interface JwtPayload {
    role: EUserRole;
    exp: number;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("accessToken")?.value;

    // console.log('token',token)

    let role: EUserRole | null = null;

    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            role = decoded.role;

            // Optional: check expiration
            if (decoded.exp * 1000 < Date.now()) {
                role = null;
            }
        } catch {
            role = null;
        }
    }

    const isAdminPath = pathname.startsWith("/admin");
    const isPlayerDashboardPath = pathname.startsWith("/players/dashboard");
    const isProtectedPath = isAdminPath || isPlayerDashboardPath;

    if (!isProtectedPath) {
        return NextResponse.next();
    }

    // ❌ Not logged in
    if (!token || !role) {
        return NextResponse.redirect(
            new URL(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
        );
    }

    // ✅ Admin routes
    if (isAdminPath) {
        if (role.includes(EUserRole.ADMIN)) {
            return NextResponse.next();
        }

        if (role === EUserRole.PLAYER) {
            return NextResponse.redirect(new URL("/players/dashboard", request.url));
        }

        return NextResponse.redirect(new URL("/auth/not-authorized", request.url));
    }

    // ✅ Player routes
    if (isPlayerDashboardPath) {
        if (role === EUserRole.PLAYER) {
            return NextResponse.next();
        }

        if (role.includes(EUserRole.ADMIN)) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        return NextResponse.redirect(new URL("/auth/not-authorized", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/players/dashboard/:path*"],
};
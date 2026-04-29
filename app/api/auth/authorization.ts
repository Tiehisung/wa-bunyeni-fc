import { NextResponse } from "next/server";
import { EUserRole } from "@/types/user";

/**
 * 
 * @param userRole 
 * @param allowedRoles 
 * @returns Boolean 
 */
export function authorize(
    userRole: string | string[] | undefined,
    allowedRoles: EUserRole | EUserRole[]
) {
    if (!userRole) return false;

    const roles = Array.isArray(userRole) ? userRole : [userRole];
    const allowed = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

    // ✅ Super admin bypass
    if (roles.includes(EUserRole.SUPER_ADMIN)) {
        return true;
    }

    // ✅ Check allowed roles
    return roles.some((role) => allowed.includes(role as EUserRole));
} 

/**
 * Throws error if failed.
 * @param userRole 
 * @param allowedRoles 
 */
export function requireRole(
    userRole: string | string[] | undefined,
    allowedRoles: EUserRole | EUserRole[]
) {
    const isAllowed = authorize(userRole, allowedRoles);

    if (!isAllowed) {
        throw new Error("Not authorized");
    }
}

/**
 * 
 * @param userRole 
 * @param allowedRoles 
 * @returns NextResponse if not authorized, otherwise null (caller should continue with normal flow)
 */
export function authorizeOrResponse(
    userRole: string | string[] | undefined,
    allowedRoles: EUserRole | EUserRole[]
) {
    if (!authorize(userRole, allowedRoles)) {
        return NextResponse.json(
            { success: false, message: "Not authorized" },
            { status: 403 }
        );
    }

    return null;
}
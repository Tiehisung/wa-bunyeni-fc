import { auth } from "@/auth";
import { EUserRole, ISession, } from "@/types/user";
import { NextResponse } from "next/server";

export const checkAuth = async (role: EUserRole = EUserRole.ADMIN) => {
    const session = await auth() as ISession
    if (!session)
        return NextResponse.json({
            message: "Session expired",
            success: false,
        });

    if (!session?.user?.role?.includes(role)) {
        return NextResponse.json({
            message: "You are not authorized to execute this action",
            success: false,
        });
    }


}
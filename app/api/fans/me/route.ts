// app/api/fans/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getApiErrorMessage } from "@/lib/error-api";
import { getOrCreateFanProfile } from "../helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    console.log("session", session);

    console.log(session);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const fan = await getOrCreateFanProfile(session.user?.email as string);

    console.log(fan);

    return NextResponse.json({
      success: true,
      data: fan,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getApiErrorMessage(error) },
      { status: 500 },
    );
  }
}

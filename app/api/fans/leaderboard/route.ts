// app/api/fans/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getApiErrorMessage } from "@/lib/error-api";
import { getFanLeaderboard } from "../helpers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy =
      (searchParams.get("sortBy") as "points" | "engagementScore") || "points";

    const leaderboard = await getFanLeaderboard(limit, sortBy);

    return NextResponse.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getApiErrorMessage(error) },
      { status: 500 },
    );
  }
}

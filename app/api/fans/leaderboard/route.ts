// app/api/fans/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getApiErrorMessage } from "@/lib/error-api";
import dbConnect from "@/config/db.config";
import FanModel  from "@/models/fans";
import "@/models/user";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy =
      (searchParams.get("sortBy") as "points" | "engagementScore") || "points";

    const fans = await FanModel.find({ isActive: true })
      .sort({ [sortBy]: -1 })
      .limit(limit)
      .populate("user", "name email avatar")
      .lean();

    const leaderboard = fans.map((fan, index) => ({
      rank: index + 1,
      user: fan.user as any,
      points: fan.points,
      engagementScore: fan.engagementScore,
      badges: fan.badges,
      contributions: fan.contributions,
      fanSince: fan.fanSince,
    }));

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

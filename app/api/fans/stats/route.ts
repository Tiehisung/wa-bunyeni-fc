// app/api/fans/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getApiErrorMessage } from "@/lib/error-api";
import { getFanStats } from "../helpers";

export async function GET(request: NextRequest) {
  try {
    const stats = await getFanStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getApiErrorMessage(error) },
      { status: 500 },
    );
  }
}

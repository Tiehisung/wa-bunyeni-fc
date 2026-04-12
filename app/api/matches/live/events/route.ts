
import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import MatchModel from "@/models/match";
import { NextRequest, NextResponse } from "next/server";
import { IMatchEvent } from "@/app/matches/(fixturesAndResults)";

ConnectMongoDb();

//Post new fixture

export async function PUT(request: NextRequest) {
  try {
    const { matchId, event } = await request.json() as { event: IMatchEvent; matchId: string }

    await MatchModel.findByIdAndUpdate(matchId, {
      $push: { events: event },
    });
    return NextResponse.json({ message: "Match Event updated", success: true });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error, "Event update failed"),
      success: false,
    });
  }
}

export async function updateMatchEvent(
  matchId: string, event: IMatchEvent) {
  try {
    ConnectMongoDb()
    const updated = await MatchModel.findByIdAndUpdate(matchId, {
      $push: { events: event },
    });

    if (updated) return { success: true, data: updated }
    return { success: false, }

  } catch { return { success: false, } }
}

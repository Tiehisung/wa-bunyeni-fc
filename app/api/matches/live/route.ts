import "@/models/teams";
import "@/models/squad";
import "@/models/player";
import "@/models/goals";
import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import MatchModel from "@/models/match";
import { NextRequest, NextResponse } from "next/server";
import PlayerModel from "@/models/player";
import { EMatchStatus } from "@/types/match.interface";

ConnectMongoDb();

//Go Live

export async function POST(request: NextRequest) {
  try {
    const { _id, playerIds } = await request.json();

    await MatchModel.findByIdAndUpdate(_id, {
      $set: { status: EMatchStatus.LIVE },
    });

    //Update match in Every Player
    for (const id of playerIds) {
      await PlayerModel.findByIdAndUpdate(id, { $push: { matches: id } })
    }
    return NextResponse.json({ message: "Match is live now", success: true });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error, "Match update failed"),
      success: false,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { _id, ...others } = await request.json();

    await MatchModel.findByIdAndUpdate(_id, {
      $set: { ...others },
    });
    return NextResponse.json({ message: "Match updated", success: true });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error, "Match update failed"),
      success: false,
    });
  }
}

export async function GET() {
  const today = new Date().toISOString().split("T")[0]; // "2025-10-18"

  const match = await MatchModel.findOne({
    $or: [
      { date: today },
      { date: new Date().toISOString() },
      { status: "LIVE" }
    ]
  }).populate({ path: "opponent", })
    .populate({ path: "squad", })
    .populate({ path: "goals", })
    .lean()

  return NextResponse.json({ data: match });
}

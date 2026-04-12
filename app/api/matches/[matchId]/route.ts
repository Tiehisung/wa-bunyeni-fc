import { ConnectMongoDb } from "@/lib/dbconfig";
import MatchModel from "@/models/match";
import { NextRequest, NextResponse } from "next/server";
import "@/models/teams";
import "@/models/goals";
import "@/models/squad";
import { logAction } from "../../logs/helper";
import { formatDate } from "@/lib/timeAndDate";
import { ELogSeverity } from "@/types/log";
import { saveToArchive } from "../../archives/helper";
import { EArchivesCollection } from "@/types/archive.interface";
import { slugIdFilters } from "@/lib/api";

ConnectMongoDb();

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const matchId = (await params).matchId;

  const fixtures = await MatchModel.findOne(slugIdFilters(matchId))
    .populate({ path: "opponent", populate: { path: "logo" } })
    .populate({ path: "goals", })
    .populate({ path: "squad", })
    .lean()

  return NextResponse.json(fixtures);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ matchId: string }> }) {
  const body = await request.json();
  const matchId = (await params).matchId;

  const updated = await MatchModel.findOneAndUpdate(slugIdFilters(matchId), {
    $set: { ...body },
  });
  if (updated) return NextResponse.json({ message: "Match updated", success: true });
  return NextResponse.json({ message: "Update failed", success: false });
}

 
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const deleted = await MatchModel.findOneAndDelete(slugIdFilters(matchId)).lean();

  saveToArchive({
    sourceCollection: EArchivesCollection.MATCHES,
    originalId: deleted?._id,
    data: { ...deleted, isLatest: false },
  });

  await logAction({
    title: `Match deleted - [${deleted?.title}]`,
    description: `A match item(${deleted?.title}) deleted. on ${formatDate(new Date().toISOString()) ?? ''}.`,
    severity: ELogSeverity.CRITICAL,
    meta: deleted?.toString(),
  });
  if (deleted.acknowledged)
    return NextResponse.json({ message: "Deleted", success: true });
  return NextResponse.json({ message: "Delete failed", success: false });
}
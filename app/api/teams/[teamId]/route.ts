import { IUpdateTeam } from "@/app/admin/teams/TeamForm";
import { ConnectMongoDb } from "@/lib/dbconfig";
import TeamModel from "@/models/teams";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../logs/helper";
import { formatDate } from "@/lib/timeAndDate";
import ArchiveModel from "@/models/Archives";
import { ELogSeverity } from "@/types/log";
import { EArchivesCollection } from "@/types/archive.interface";


ConnectMongoDb();
//Get teams
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const team = await TeamModel.findById((await params).teamId);
    return NextResponse.json({
      message: "File retrieved successfully",
      success: true,
      data: team,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to retrieve team",
      success: false,
      data: error,
    });
  }
}

//Update team
export async function PUT(request: NextRequest, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const teamId = (await params).teamId
    const team: IUpdateTeam = await request.json();
    const updated = await TeamModel.findByIdAndUpdate(teamId, { $set: { ...team } });

    if (!updated.acknowledged) throw Error('Failed to update team')

    return NextResponse.json({
      message: "Team updated successfully",
      success: true, data: updated
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to update team",
      success: false,
      data: error,
    });
  }
}

//Update team
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const teamId = (await params).teamId
    const body = await request.json();
    const deleted = await TeamModel.findByIdAndDelete(teamId);

    //Archive
    await ArchiveModel.updateOne(
      { sourceCollection: EArchivesCollection.TEAMS, originalId: body?._id },
      { $push: { data: deleted } }
    );

    // log
    await logAction({
      title: `Team deleted - [${body?.name}]`,
      description: `A team(${body?.name}) deleted. on ${formatDate(new Date().toISOString()) ?? ''}.`,
      severity: ELogSeverity.CRITICAL,
      meta: deleted?.toString(),
    });
    return NextResponse.json({
      message: "Team deleted successfully",
      success: true, data: deleted
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to update team",
      success: false,
      data: error,
    });
  }
}



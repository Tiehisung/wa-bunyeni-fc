import "@/models/file";
import {
  IPostTeam,
  IUpdateTeam,
} from "@/app/admin/teams/TeamForm";
import { ConnectMongoDb } from "@/lib/dbconfig";
import TeamModel from "@/models/teams";
import { NextRequest, NextResponse } from "next/server";
import { removeEmptyKeys } from "@/lib";
import { logAction } from "../logs/helper";
import { formatDate } from "@/lib/timeAndDate";
import ArchiveModel from "@/models/Archives";
import { EArchivesCollection } from "@/types/archive.interface";
import { ELogSeverity } from "@/types/log";

ConnectMongoDb()

//Get teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);

    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const search = searchParams.get("team_search") || "";

    const regex = new RegExp(search, "i");

    const query = {
      $or: [
        { "name": regex },
        { "alias": regex },
        { community: regex },
      ],
    }
    const cleaned = removeEmptyKeys(query)

    const teams = await TeamModel.find(cleaned)
      .limit(limit)
      .skip(skip)
      .lean()
      .sort({ createdAt: "desc", });

    const total = await TeamModel.countDocuments(cleaned)
    return NextResponse.json({
      success: true,
      data: teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch {

    return NextResponse.json({
      message: "Failed to retrieve teams",
      success: false,
      data: [],
    });
  }
}
//Post new team
export async function POST(request: NextRequest) {
  try {
    const team: IPostTeam = await request.json();

    //Save team to database
    const createdTeam = await TeamModel.create({
      ...team,
    });
    if (createdTeam) {
      return NextResponse.json({
        message: "Team created successfully",
        success: true,
        data: createdTeam,
      });
    }
    return NextResponse.json({
      message: "Team create failed",
      success: false,
      data: createdTeam,
    });
  } catch (error) {

    return NextResponse.json({
      message: "Failed to create team",
      success: false,
      data: error,
    });
  }
}

//Update team
export async function PUT(request: NextRequest) {
  try {
    const team: IUpdateTeam = await request.json();

    const updated = await TeamModel.updateOne({ _id: team._id }, { $set: { ...team } });

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



//Delete team
export async function DELETE(req: NextRequest) {
  try {

    const body = await req.json();
    const deleted = await TeamModel.findByIdAndDelete(body?._id);

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

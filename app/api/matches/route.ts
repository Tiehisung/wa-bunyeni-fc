import { ConnectMongoDb } from "@/lib/dbconfig";
import MatchModel, { IPostMatch } from "@/models/match";
import { NextRequest, NextResponse } from "next/server";
import "@/models/teams";
import "@/models/file";
import "@/models/goals";
import "@/models/player";
import "@/models/squad";
import { removeEmptyKeys, slugify } from "@/lib";
import { EMatchStatus } from "@/types/match.interface";
import { logAction } from "../logs/helper";
import { formatDate } from "@/lib/timeAndDate";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const status = searchParams.get('status') as EMatchStatus

  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);

  const skip = (page - 1) * limit;

  const search = searchParams.get("match_search") || "";
  const fixtureType = searchParams.get("fixture") || "";

  const regex = new RegExp(search, "i");

  const query: Record<string, string | boolean | unknown> = {}

  if (fixtureType == 'home') query.isHome = true

  if (fixtureType == 'away') query.isHome = false

  if (status) query.status = status

  if (search) {
    query.$or = [
      { "title": regex },
      { "date": regex },
    ]
  }


  const cleanedFilters = removeEmptyKeys(query)
  console.log(cleanedFilters)

  const fixtures = await MatchModel.find(cleanedFilters)
    .populate({ path: "opponent", })
    .populate({ path: "squad", })
    .populate({ path: "goals", })
    .limit(limit)
    .skip(skip)
    .lean()
    .sort({ createdAt: "desc" });

  const total = await MatchModel.countDocuments(cleanedFilters)
  return NextResponse.json({
    data: fixtures, success: true, pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

//Post new fixture

export async function POST(request: NextRequest) {
  const formdata: IPostMatch = await request.json();
  const slug = slugify(`${formdata?.title}-${formdata?.date}`, false);
  const saved = await MatchModel.create({ ...formdata, slug });

  // log
  await logAction({
    title: `Match created - [${saved?.title}]`,
    description: `A match item(${saved?.title}) created on ${formatDate(new Date().toISOString()) ?? ''}.`,
    meta: saved?.toString(),
  });

  return NextResponse.json({ message: "Fixture created", success: true });

}

export async function PUT(request: NextRequest) {


  const { _id, ...others } = await request.json();

  const updated = await MatchModel.findByIdAndUpdate(_id, {
    $set: { ...others },
  });
  if (updated) return NextResponse.json({ message: "Updated", success: true });
  return NextResponse.json({ message: "Update failed", success: false });
}

export async function DELETE(request: NextRequest) {
  const { matchId } = await request.json();
  const deleted = await MatchModel.deleteOne({ _id: matchId });
  if (deleted.acknowledged)
    return NextResponse.json({ message: "Deleted", success: true });
  return NextResponse.json({ message: "Delete failed", success: false });
}

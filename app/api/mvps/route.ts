import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../logs/helper";
import { IMatchCard } from "@/app/matches/(fixturesAndResults)";
import { updateMatchEvent } from "../matches/live/events/route";
import PlayerModel from "@/models/player";
import MvPModel, { IPostMvp } from "@/models/mpv";
import { TSearchKey } from "@/types";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const limit = Number.parseInt(searchParams.get("limit") || "30", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("mvp_search") as TSearchKey || "";

  const regex = new RegExp(search, "i");

  const query = {
    $or: [
      { "player.name": regex },
      { "match.title": regex },
      { "description": regex },
    ],
  }

  const cards = await MvPModel.find(query)
    .limit(limit).skip(skip)
    .lean().sort({ createdAt: "desc" });

  const total = await MvPModel.countDocuments(query)
  return NextResponse.json({
    success: true,
    data: cards,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { match, player, description, positionPlayed } = await request.json() as IPostMvp;

    
    if (match?.mvp) {
      return NextResponse.json({ message: "Match already assigned MoTM.", success: false });
    }
    const savedMVP = await MvPModel.create({
      match, player, description, positionPlayed
    });

    if (!savedMVP) {
      return NextResponse.json({ message: "Failed to create mvp.", success: false });
    }

    //Update Player
    await PlayerModel.findByIdAndUpdate(player?._id, { $push: { mvps: savedMVP._id } })

    //Update events
    // await updateMatchEvent(match?.toString(), {
    //   type: 'general',
     
    //   title: `${player?.name} awarded MVP `,
    //   description: description as string
    // })

    // log
    await logAction({
      title: "MVP declared",
      description: `${player?.name} declared MVP. ${description || ''}`,
    });

    return NextResponse.json({ message: "MVP created successfully!", success: true, data: savedMVP });

  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}


 

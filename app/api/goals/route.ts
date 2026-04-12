import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../logs/helper";
import GoalModel, { IPostGoal } from "@/models/goals";
import { updateMatchEvent } from "../matches/live/events/route";
import MatchModel from "@/models/match";
import PlayerModel from "@/models/player";
import { IGoal } from "@/types/match.interface";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("goal_search") || "";

  const regex = new RegExp(search, "i");

  const query = {
    $or: [
      { "scorer._id": regex },
      { "scorer.name": regex },
      { "assist.name": regex },
      { "assist._id": regex },
      { "description": regex },
      { "opponent.name": regex },
      { "opponent._id": regex },
    ],
  }

  const managers = await GoalModel.find(query)
    .limit(limit).skip(skip)
    .lean().sort({ createdAt: "desc" });

  const total = await GoalModel.countDocuments(query)
  return NextResponse.json({
    success: true, data: managers, pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {

    const { match, description, minute, scorer, assist, modeOfScore, forKFC } = await request.json() as IPostGoal;

    const savedGoal = await GoalModel.create({
      match, description, minute, scorer, assist, modeOfScore, forKFC
    });

    if (!savedGoal) {
      return NextResponse.json({ message: "Failed to create goal.", success: false });
    }
    //Update Match
    const updatedMatech = await MatchModel.findByIdAndUpdate(match, { $push: { 'goals': savedGoal._id } })

    //Update Player
    if (forKFC && scorer) {
      await PlayerModel.findByIdAndUpdate(scorer?._id, { $push: { goals: savedGoal._id } })

      if (assist)
        await PlayerModel.findByIdAndUpdate(assist?._id, { $push: { assists: savedGoal._id } })
    }


    //Update events
    if (minute) {
      const assistance = assist ? `Assist: ${assist?.number ?? ''} ${assist.name} ` : ''
      await updateMatchEvent(match?.toString(), {
        type: 'goal',
        minute: String(minute),
        title: `⚽ ${minute}' - ${scorer?.number ?? 'Goal scored by '}  ${scorer?.name ?? 'unknown player'} `,
        description: `${assistance} ${description} Mode of Score: ${modeOfScore ?? ''}`

      })
    }

    // log
    await logAction({
      title: "Goal Created " + updatedMatech?.title,
      description: description as string,
      meta: savedGoal
    });

    return NextResponse.json({ message: "Goal created successfully!", success: true, data: savedGoal });

  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {

    const { forKFC, match, _id, scorer, assist } = await request.json() as IGoal;

    const deletedGoal = await GoalModel.findByIdAndDelete(_id)
    if (!deletedGoal) {
      return NextResponse.json({ message: "Failed to delete goal.", success: false });
    }
    //Update Match
    const updatedMatech = await MatchModel.findByIdAndUpdate(match, { $pull: { goals: _id } })

    //Update Player
    if (forKFC && scorer) {
      await PlayerModel.findByIdAndUpdate(scorer?._id, { $push: { goals: _id } })

      if (assist)
        await PlayerModel.findByIdAndUpdate(assist?._id, { $pull: { assists: _id } })
    }

    // log
    await logAction({
      title: "Goal Deleted " + updatedMatech?.title,
      description: deletedGoal?.description as string,
      meta: deletedGoal
    });

    return NextResponse.json({ message: "Goal deleted successfully!", success: true, data: deletedGoal });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}

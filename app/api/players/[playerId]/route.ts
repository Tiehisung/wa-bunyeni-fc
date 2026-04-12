import "@/models/file";
import "@/models/galleries";
import "@/models/match";
import "@/models/mpv";
import "@/models/injury";
import "@/models/card";
import "@/models/goals";

import { getErrorMessage, getInitials } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import PlayerModel from "@/models/player";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../logs/helper";
import ArchiveModel from "@/models/Archives";
import { ELogSeverity } from "@/types/log";
import { auth } from "@/auth";
import { EUserRole, ISession } from "@/types/user";
import { slugIdFilters } from "@/lib/api";
import { generatePlayerID } from "../route";
import UserModel from "@/models/user";

ConnectMongoDb();

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const slug = slugIdFilters((await params).playerId)
  const player = await PlayerModel.findOne(slug)
    .populate({ path: "galleries", populate: { path: 'files' } })
    .populate('matches')
    .populate('mvps')
    .populate('cards')
    .populate('injuries')
    .populate('goals')
    .populate('assists')
    .lean();

  return NextResponse.json(player);
}


//put Only relevant fields at a time
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {

  const slug = slugIdFilters((await params).playerId)
  const formData = await request.json();

  const updates = { ...formData };

  try {
    const updatedPlayer = await PlayerModel.findOneAndUpdate(slug, {
      $set: { ...updates },
    });

    //REMOVE AFTER

    //Update existing players to have Code
    let playerCode = generatePlayerID(updatedPlayer.firstName, updatedPlayer.lastName, updatedPlayer.dob)

    if (!updatedPlayer.code) {
      const existingPlayerByCode = await PlayerModel.findOne({ code: playerCode });
      if (!existingPlayerByCode) {
        await PlayerModel.findOneAndUpdate(slug, {
          $set: { code: playerCode },
        });
      } else {
        playerCode = getInitials([updatedPlayer.firstName, updatedPlayer.lastName], 2) + (new Date()).getMilliseconds()
        await PlayerModel.findOneAndUpdate(slug, {
          $set: { code: playerCode },
        });

      }
    }

    return NextResponse.json({
      message: "Update success",
      success: true,
      data: updatedPlayer,
    });
  } catch (error) {
    return NextResponse.json({
      message: `Update failed. ${getErrorMessage(error)}`,
      success: false,
    });
  }
}

//delete
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const slug = slugIdFilters((await params).playerId)

    const session = await auth() as ISession

    if (session?.user?.role !== EUserRole.SUPER_ADMIN) {
      return NextResponse.json({
        message: `You are not authorized to perform this action`,
        success: false,
      });
    }

    //Update issues
    const player = await PlayerModel.findOne(slug);

    await ArchiveModel.updateOne(
      { sourceCollection: "players" },
      { $push: { data: player } }
    );

    //Now remove player
    const deleted = await PlayerModel.findOneAndDelete(slug);

    //Delete from users
    await UserModel.findOneAndDelete({ email: deleted.email });
    // log
    await logAction({
      title: "Player Deleted",
      description: `Player with id [${(await params).playerId}] deleted on ${new Date().toLocaleString()}`,
      severity: ELogSeverity.CRITICAL,
      meta: deleted,
    });
    return NextResponse.json({
      message: "Deleted successful",
      success: true,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message: `Delete failed. ${getErrorMessage(error)}`,
      success: false,
    });
  }
}

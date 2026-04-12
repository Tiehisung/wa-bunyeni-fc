import "@/models/player";
import "@/models/file";
import { ICaptainProps } from "@/app/admin/players/captaincy/Captaincy";
import { ConnectMongoDb } from "@/lib/dbconfig";
import CaptaincyModel from "@/models/captain";
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage, removeEmptyKeys } from "@/lib";
import { QueryFilter } from "mongoose";
import { IPlayerMini } from "@/types/player.interface";
import { auth } from "@/auth";
import { ISession } from "@/types/user";
import { checkAuth } from "../auth/check-auth";


ConnectMongoDb();

interface ICap {
  player: IPlayerMini;
  role: ICaptainProps["role"];
}
//Get all captains

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);

    const search = searchParams.get("captain_search") || "";
    const isActive = searchParams.get("isActive") || "";

    const skip = (page - 1) * limit;

    const regex = new RegExp(search, "i"); // case-insensitive partial match

    const query = {} as QueryFilter<unknown>

    if (search) {
      query.$or = [
        { "player.firstName": regex },
        { "player.lastName": regex },
      ]
    }
    if (isActive) query.isActive = true

    const cleaned = removeEmptyKeys(query)

    const captains = await CaptaincyModel.find(cleaned).sort({ 'createdAt': -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await CaptaincyModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: captains,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: getErrorMessage(error) });
  }
}

//Update database file metadata
export async function POST(req: NextRequest) {
  try {
    checkAuth()

    const { player, role }: ICap = await req.json();

    //Update current captain role
    const reignEnded = await CaptaincyModel.updateMany(
      { isActive: true, role: role },
      { $set: { isActive: false, endDate: new Date().toISOString() } }
    );

    if (!reignEnded)
      return NextResponse.json({
        message: "Current captains could not be updated.",
        success: false,
        data: reignEnded,
      });

    //Now set new captains
    const newCaptain = await CaptaincyModel.create({
      player,
      role,
      isActive: true,
    });

    return NextResponse.json({
      message: "Captain re-assigned successfully.",
      success: true,
      data: newCaptain,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to create captain.",
      success: false,
      data: error,
    });
  }
}


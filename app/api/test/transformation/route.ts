import "@/models/file";
import "@/models/galleries";

import connectDB from "@/config/db.config";
import PlayerModel from "@/models/player";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user";

connectDB();

export async function GET(request: NextRequest) {

    const users = await UserModel.find({}).lean();


    return NextResponse.json({
        success: true,
        data: users,
    });
}
import "@/models/file";
import "@/models/galleries";

import { ConnectMongoDb } from "@/lib/dbconfig";
import PlayerModel from "@/models/player";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user";

ConnectMongoDb();

export async function GET(request: NextRequest) {

    const users = await UserModel.find({}).lean();
        

    return NextResponse.json({
        success: true,
        data: users,
    });
}
import { NextResponse } from "next/server";
import dbConnect from "@/config/db.config";
import PlayerModel from "@/models/player";
import { generatePlayerCode } from "../players/code";
import { slugify } from "@/lib/slugging";
import UserModel from "@/models/user";

export async function GET() {
  try {
    await dbConnect();
    const players = await PlayerModel.find({});

    for (const p of players) {
      await UserModel.findOneAndUpdate(
        { email: p.email },
        { avatar: p.avatar },
      );
    }
    const pls = await UserModel.find({});
    return NextResponse.json({
      ok: true,
      message: "🎉 Migration complete!",
      data: pls,
    });
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
}

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
      const code = await generatePlayerCode(p.firstName, p.lastName);
      const slug = slugify(`${p.firstName}-${p.lastName}-${code}`);
      const email = `${code}@bfc.com`.toLowerCase();
      await UserModel.findOneAndUpdate({ email: p.email }, { email });
      await PlayerModel.findByIdAndUpdate(p._id, {
        email: email,
        slug,
        code,
      });
    }
    const pls = await PlayerModel.find({});
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

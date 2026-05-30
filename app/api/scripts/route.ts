import { NextResponse } from "next/server";
import { EMatchLocation } from "@/types/match.interface";
import dbConnect from "@/config/db.config";
import MatchModel from "@/models/match";

// Run the migration

export async function GET() {
  try {
    await dbConnect();
    await MatchModel.updateMany(
      { isHome: true },
      { $set: { location: EMatchLocation.HOME } },
    );
    await MatchModel.updateMany(
      { isHome: false },
      { $set: { location: EMatchLocation.AWAY } },
    );

    const matches = await MatchModel.find({});
    return NextResponse.json({
      ok: true,
      message: "🎉 Migration complete!",
      data: matches,
      //   fans,
    });
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
}

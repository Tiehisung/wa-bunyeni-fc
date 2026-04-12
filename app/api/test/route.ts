
import { ConnectMongoDb } from "@/lib/dbconfig";
import PlayerModel from "@/models/player";
import { NextResponse } from "next/server";
ConnectMongoDb();
export async function GET() {
  try {
    const mod = await PlayerModel.updateMany({}, { $set: { status: "current" } }) 
    const players = await PlayerModel.find()

     
    return NextResponse.json({
      ok: true,
      message: 'Test complete!',
      data: mod,
      players

    })
  } catch (error) {

    return NextResponse.json({ ok: false, error }, { status: 500 })
  }
}

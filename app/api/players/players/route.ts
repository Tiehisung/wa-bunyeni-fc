import { NextResponse } from "next/server";
import connectDB from "@/config/db.config";
import { getGlobalPlayersStats } from "../stats/globalPlayersStats";

connectDB();
export async function GET() {
    try {
        const playersStats = await getGlobalPlayersStats()

        return NextResponse.json({ data: playersStats, success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch players", success: false },
            { status: 500 }
        );
    }
}

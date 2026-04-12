import { NextResponse } from "next/server";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { getGlobalPlayersStats } from "./globalPlayersStats";

ConnectMongoDb();
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

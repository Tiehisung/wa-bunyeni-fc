import { NextResponse } from "next/server";
import { ConnectMongoDb } from "@/lib/dbconfig";
import MatchModel from "@/models/match";

export async function GET() {
    try {
        await ConnectMongoDb();

        // Win, draw, loss counts
        const [wins, draws, losses] = await Promise.all([
            MatchModel.countDocuments({
                $expr: { $gt: ["$score.kfc", "$score.opponent"] },
            }),

            MatchModel.countDocuments({
                $expr: { $eq: ["$score.kfc", "$score.opponent"] },
            }),

            MatchModel.countDocuments({
                $expr: { $lt: ["$score.kfc", "$score.opponent"] },
            }),
        ]);


        // Goals For
        const goalsForAgg = await MatchModel.aggregate([
            { $group: { _id: null, total: { $sum: "$score.kfc" } } },
        ]);
        const goalsFor = goalsForAgg[0]?.total ?? 0;

        // Goals Against
        const goalsAgainstAgg = await MatchModel.aggregate([
            { $group: { _id: null, total: { $sum: "$score.opponent" } } },
        ]);
        const goalsAgainst = goalsAgainstAgg[0]?.total ?? 0;

        const totalMatches = wins + draws + losses;

        return NextResponse.json({
            data: {
                wins,
                draws,
                losses,
                goalsFor,
                goalsAgainst,
                goalDifference: goalsFor - goalsAgainst,
                totalMatches,
                winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
            },
            success: true
        });
    } catch (err) {
        console.error("Match stats error:", err);
        return NextResponse.json(
            { error: "Failed to calculate match stats", success: false },
            { status: 500 }
        );
    }
}



import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ConnectMongoDb } from "@/lib/dbconfig";
import PlayerModel from "@/models/player";

ConnectMongoDb();
export async function GET(
    _: Request,
    { params }: { params: Promise<{ playerId: string }> }
) {
    try {
        const { playerId } = await params;

        if (!mongoose.Types.ObjectId.isValid(playerId))
            return NextResponse.json({ message: "Invalid ID", success: false }, { status: 400 });

        const player = await PlayerModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(playerId), }
            },

            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    avatar: 1,
                    number: 1,
                    position: 1,
                    captaincy: 1,
                    goals: { $size: "$goals" },
                    assists: { $size: "$assists" },
                    matches: { $size: "$matches" },
                    injuries: { $size: "$injuries" },
                    cards: { $size: "$cards" },

                    ratingAvg: {
                        $cond: [
                            { $gt: [{ $size: "$ratings" }, 0] },
                            { $avg: "$ratings.rating" },
                            0
                        ]
                    },

                    performanceScore: {
                        $add: [
                            { $multiply: [{ $size: "$goals" }, 4] },
                            { $multiply: [{ $size: "$assists" }, 3] },
                            { $multiply: ["$ratingAvg", 2] }
                        ]
                    },

                    ratings: 1,
                }
            },

            { $limit: 1 }
        ]);

        if (!player.length)
            return NextResponse.json(
                { error: "Player not found or inactive" },
                { status: 404 }
            );

        return NextResponse.json(player[0]);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch player", success: false },
            { status: 500 }
        );
    }
}




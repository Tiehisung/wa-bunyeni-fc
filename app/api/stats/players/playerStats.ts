import PlayerModel from "@/models/player";
import mongoose from "mongoose";

export async function getPlayerStats(playerId: string) {
    if (!mongoose.Types.ObjectId.isValid(playerId)) return null;

    const result = await PlayerModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playerId),
                isActive: true,
            },
        },

        {
            $project: {
                firstName: 1,
                lastName: 1,
                avatar: 1,
                number: 1,
                position: 1,
                phone: 1,
                email: 1,
                height: 1,
                about: 1,
                captaincy: 1,
                manager: 1,
                playRole: 1,

                goals: { $size: "$goals" },
                assists: { $size: "$assists" },
                matchesPlayed: { $size: "$matches" },
                injuries: { $size: "$injuries" },
                cards: { $size: "$cards" },

                ratingAvg: {
                    $cond: [
                        { $gt: [{ $size: "$ratings" }, 0] },
                        { $avg: "$ratings.rating" },
                        0,
                    ],
                },

                performanceScore: {
                    $add: [
                        { $multiply: [{ $size: "$goals" }, 4] },
                        { $multiply: [{ $size: "$assists" }, 3] },
                        { $multiply: ["$ratingAvg", 2] },
                    ],
                },

                ratings: 1,
                history: 1,
                featureMedia: 1,
            },
        },

        { $limit: 1 },
    ]);

    return result[0] ?? null;
}

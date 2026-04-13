// app/api/matches/stats/route.ts

import connectDB from "@/config/db.config";
import MatchModel from "@/models/match";
import { EMatchStatus } from "@/types/match.interface";
import { NextRequest, NextResponse } from "next/server";
import { LoggerService } from "../../../../shared/log.service";
import { getApiErrorMessage } from "../../../../lib/error-api";

connectDB();

// GET /api/matches/stats - Get match statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await MatchModel.aggregate([
            {
                $facet: {
                    totalMatches: [{ $count: 'count' }],
                    byStatus: [
                        {
                            $group: {
                                _id: '$status',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    byCompetition: [
                        {
                            $group: {
                                _id: '$competition',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
                        { $limit: 10 },
                    ],
                    bySeason: [
                        {
                            $group: {
                                _id: '$season',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { '_id': -1 } },
                    ],
                    homeWins: [
                        {
                            $match: {
                                status: EMatchStatus.FT,
                                $expr: { $gt: ['$homeScore', '$awayScore'] }
                            }
                        },
                        { $count: 'count' }
                    ],
                    awayWins: [
                        {
                            $match: {
                                status: EMatchStatus.FT,
                                $expr: { $lt: ['$homeScore', '$awayScore'] }
                            }
                        },
                        { $count: 'count' }
                    ],
                    draws: [
                        {
                            $match: {
                                status: EMatchStatus.FT,
                                $expr: { $eq: ['$homeScore', '$awayScore'] }
                            }
                        },
                        { $count: 'count' }
                    ],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalMatches: stats[0]?.totalMatches[0]?.count || 0,
                byStatus: stats[0]?.byStatus || [],
                byCompetition: stats[0]?.byCompetition || [],
                bySeason: stats[0]?.bySeason || [],
                results: {
                    homeWins: stats[0]?.homeWins[0]?.count || 0,
                    awayWins: stats[0]?.awayWins[0]?.count || 0,
                    draws: stats[0]?.draws[0]?.count || 0,
                },
            },
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch match statistics'),
        }, { status: 500 });
    }
}
// app/api/metrics/players/overview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import PlayerModel from '@/models/player';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/metrics/players/overview - Get players overview metrics
export async function GET(request: NextRequest) {
    try {
        const playerStats = await PlayerModel.aggregate([
            {
                $facet: {
                    totalPlayers: [{ $count: 'count' }],
                    byPosition: [
                        {
                            $group: {
                                _id: '$position',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    topScorers: [
                        {
                            $lookup: {
                                from: 'goals',
                                localField: 'goals',
                                foreignField: '_id',
                                as: 'goalDetails',
                            },
                        },
                        { $addFields: { goalCount: { $size: '$goalDetails' } } },
                        { $sort: { goalCount: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                name: { $concat: ['$firstName', ' ', '$lastName'] },
                                number: 1,
                                position: 1,
                                goalCount: 1,
                            },
                        },
                    ],
                    topAssists: [
                        {
                            $lookup: {
                                from: 'goals',
                                localField: 'assists',
                                foreignField: '_id',
                                as: 'assistDetails',
                            },
                        },
                        { $addFields: { assistCount: { $size: '$assistDetails' } } },
                        { $sort: { assistCount: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                name: { $concat: ['$firstName', ' ', '$lastName'] },
                                number: 1,
                                position: 1,
                                assistCount: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                total: playerStats[0]?.totalPlayers[0]?.count || 0,
                byPosition: playerStats[0]?.byPosition || [],
                topScorers: playerStats[0]?.topScorers || [],
                topAssists: playerStats[0]?.topAssists || [],
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch overview metrics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch overview metrics'),
        }, { status: 500 });
    }
}
// app/api/cards/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import CardModel from '@/models/card';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/cards/stats - Get card statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await CardModel.aggregate([
            {
                $facet: {
                    totalCards: [{ $count: 'count' }],
                    byType: [
                        {
                            $group: {
                                _id: '$type',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    byMinute: [
                        {
                            $bucket: {
                                groupBy: '$minute',
                                boundaries: [0, 15, 30, 45, 60, 75, 90],
                                default: 'Other',
                                output: {
                                    count: { $sum: 1 },
                                    reds: {
                                        $sum: { $cond: [{ $eq: ['$type', 'red'] }, 1, 0] }
                                    },
                                    yellows: {
                                        $sum: { $cond: [{ $eq: ['$type', 'yellow'] }, 1, 0] }
                                    },
                                },
                            },
                        },
                    ],
                    mostCardedPlayers: [
                        {
                            $group: {
                                _id: '$player',
                                total: { $sum: 1 },
                                reds: {
                                    $sum: { $cond: [{ $eq: ['$type', 'red'] }, 1, 0] }
                                },
                                yellows: {
                                    $sum: { $cond: [{ $eq: ['$type', 'yellow'] }, 1, 0] }
                                },
                            },
                        },
                        { $sort: { total: -1 } },
                        { $limit: 10 },
                        {
                            $lookup: {
                                from: 'players',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'playerDetails',
                            },
                        },
                        {
                            $project: {
                                playerId: '$_id',
                                total: 1,
                                reds: 1,
                                yellows: 1,
                                playerName: { $arrayElemAt: ['$playerDetails.name', 0] },
                                playerNumber: { $arrayElemAt: ['$playerDetails.number', 0] },
                                playerPosition: { $arrayElemAt: ['$playerDetails.position', 0] },
                                _id: 0,
                            },
                        },
                    ],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalCards: stats[0]?.totalCards[0]?.count || 0,
                byType: stats[0]?.byType || [],
                byMinute: stats[0]?.byMinute || [],
                mostCardedPlayers: stats[0]?.mostCardedPlayers || [],
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch card statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch card statistics'),
        }, { status: 500 });
    }
}
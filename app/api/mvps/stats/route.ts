// app/api/mvps/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import MvPModel from '@/models/mpv';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';


connectDB();

// GET /api/mvps/stats - Get MVP statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await MvPModel.aggregate([
            {
                $facet: {
                    totalMvps: [{ $count: 'count' }],
                    byPosition: [
                        {
                            $group: {
                                _id: '$positionPlayed',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
                    ],
                    topPlayers: [
                        {
                            $group: {
                                _id: '$player',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
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
                                count: 1,
                                playerName: { $arrayElemAt: ['$playerDetails.name', 0] },
                                playerNumber: { $arrayElemAt: ['$playerDetails.number', 0] },
                                playerPosition: { $arrayElemAt: ['$playerDetails.position', 0] },
                                _id: 0,
                            },
                        },
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
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalMvps: stats[0]?.totalMvps[0]?.count || 0,
                byPosition: stats[0]?.byPosition || [],
                topPlayers: stats[0]?.topPlayers || [],
                bySeason: stats[0]?.bySeason || [],
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch MVP statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch MVP statistics'),
        }, { status: 500 });
    }
}
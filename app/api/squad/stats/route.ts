// app/api/squads/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import SquadModel from '@/models/squad';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/squads/stats - Get squad statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await SquadModel.aggregate([
            {
                $facet: {
                    totalSquads: [{ $count: 'count' }],
                    byFormation: [
                        {
                            $group: {
                                _id: '$formation',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
                    ],
                    averageSquadSize: [
                        {
                            $group: {
                                _id: null,
                                avgSize: { $avg: { $size: '$players' } },
                            },
                        },
                    ],
                    mostUsedPlayers: [
                        { $unwind: '$players' },
                        {
                            $group: {
                                _id: '$players.player',
                                appearances: { $sum: 1 },
                            },
                        },
                        { $sort: { appearances: -1 } },
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
                                appearances: 1,
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
                totalSquads: stats[0]?.totalSquads[0]?.count || 0,
                byFormation: stats[0]?.byFormation || [],
                averageSquadSize: Math.round(stats[0]?.averageSquadSize[0]?.avgSize || 0),
                mostUsedPlayers: stats[0]?.mostUsedPlayers || [],
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch squad statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch squad statistics'),
        }, { status: 500 });
    }
}
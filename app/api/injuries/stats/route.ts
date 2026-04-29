// app/api/injuries/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import InjuryModel from '@/models/injury';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/injuries/stats - Get injury statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await InjuryModel.aggregate([
            {
                $facet: {
                    totalInjuries: [{ $count: 'count' }],
                    bySeverity: [
                        {
                            $group: {
                                _id: '$severity',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    byStatus: [
                        {
                            $group: {
                                _id: '$status',
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
                                },
                            },
                        },
                    ],
                    mostInjuredPlayers: [
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
                totalInjuries: stats[0]?.totalInjuries[0]?.count || 0,
                bySeverity: stats[0]?.bySeverity || [],
                byStatus: stats[0]?.byStatus || [],
                byMinute: stats[0]?.byMinute || [],
                mostInjuredPlayers: stats[0]?.mostInjuredPlayers || [],
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch injury statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch injury statistics'),
        }, { status: 500 });
    }
}
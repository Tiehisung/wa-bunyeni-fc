// app/api/teams/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import TeamModel from '@/models/teams';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/teams/stats - Get team statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await TeamModel.aggregate([
            {
                $facet: {
                    totalTeams: [{ $count: 'count' }],
                    bySeason: [
                        {
                            $group: {
                                _id: '$season',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { '_id': -1 } },
                    ],
                    byLeague: [
                        {
                            $group: {
                                _id: '$league',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
                        { $limit: 10 },
                    ],
                    byStatus: [
                        {
                            $group: {
                                _id: '$status',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalTeams: stats[0]?.totalTeams[0]?.count || 0,
                bySeason: stats[0]?.bySeason || [],
                byLeague: stats[0]?.byLeague || [],
                byStatus: stats[0]?.byStatus || [],
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch team statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch team statistics'),
        }, { status: 500 });
    }
}
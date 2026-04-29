// app/api/goals/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import GoalModel from '@/models/goals';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/goals/stats - Get goal statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await GoalModel.aggregate([
            {
                $facet: {
                    totalGoals: [{ $count: 'count' }],
                    byMode: [
                        {
                            $group: {
                                _id: '$modeOfScore',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    byMinute: [
                        {
                            $bucket: {
                                groupBy: '$minute',
                                boundaries: [0, 15, 30, 45, 60, 75, 90, 120],
                                default: 'Other',
                                output: {
                                    count: { $sum: 1 },
                                },
                            },
                        },
                    ],
                    topScorers: [
                        { $match: { forKFC: true } },
                        {
                            $group: {
                                _id: '$scorer._id',
                                name: { $first: '$scorer.name' },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
                        { $limit: 10 }
                    ],
                    topAssists: [
                        {
                            $match: {
                                forKFC: true,
                                assist: { $exists: true, $ne: null }
                            }
                        },
                        {
                            $group: {
                                _id: '$assist._id',
                                name: { $first: '$assist.name' },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
                        { $limit: 10 }
                    ],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalGoals: stats[0]?.totalGoals[0]?.count || 0,
                byMode: stats[0]?.byMode || [],
                byMinute: stats[0]?.byMinute || [],
                topScorers: stats[0]?.topScorers || [],
                topAssists: stats[0]?.topAssists || [],
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch goal statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch goal statistics'),
        }, { status: 500 });
    }
}
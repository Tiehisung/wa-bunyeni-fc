// app/api/captains/stats/route.ts
import connectDB from '@/config/db.config';
import CaptaincyModel from '@/models/captain';
import { NextRequest, NextResponse } from 'next/server';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB()
// GET /api/captains/stats - Get captaincy statistics
export async function GET(request: NextRequest) {
    try {


        const stats = await CaptaincyModel.aggregate([
            {
                $facet: {
                    totalAppointments: [{ $count: 'count' }],
                    byRole: [
                        {
                            $group: {
                                _id: '$role',
                                count: { $sum: 1 },
                                active: {
                                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                                },
                            },
                        },
                    ],
                    activeCaptains: [
                        { $match: { isActive: true } },
                        {
                            $group: {
                                _id: '$role',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    longestTenure: [
                        { $match: { isActive: false, endDate: { $exists: true } } },
                        {
                            $addFields: {
                                tenureDays: {
                                    $divide: [
                                        { $subtract: ['$endDate', '$startDate'] },
                                        1000 * 60 * 60 * 24
                                    ]
                                }
                            }
                        },
                        { $sort: { tenureDays: -1 } },
                        { $limit: 5 },
                        {
                            $lookup: {
                                from: 'players',
                                localField: 'player._id',
                                foreignField: '_id',
                                as: 'playerDetails',
                            },
                        },
                        {
                            $project: {
                                playerName: { $arrayElemAt: ['$playerDetails.name', 0] },
                                role: 1,
                                tenureDays: 1,
                                startDate: 1,
                                endDate: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalAppointments: stats[0]?.totalAppointments[0]?.count || 0,
                byRole: stats[0]?.byRole || [],
                activeCaptains: stats[0]?.activeCaptains || [],
                longestTenure: stats[0]?.longestTenure || [],
            },
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch captaincy statistics'),
        }, { status: 500 });
    }
}
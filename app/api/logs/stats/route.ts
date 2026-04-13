// app/api/logs/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import LogModel from '@/models/logs';
import { LoggerService } from '@/shared/log.service';
 

connectDB();

// GET /api/logs/stats - Get log statistics
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach', 'player'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days') || '7');
        const numDays = days;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - numDays);

        const severityStats = await LogModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 },
                    lastLog: { $max: '$createdAt' }
                }
            },
            {
                $project: {
                    severity: '$_id',
                    count: 1,
                    lastLog: 1,
                    _id: 0
                }
            }
        ]);

        const categoryStats = await LogModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    category: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        const timeStats = await LogModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    critical: {
                        $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
                    },
                    error: {
                        $sum: { $cond: [{ $eq: ['$severity', 'error'] }, 1, 0] }
                    },
                    warning: {
                        $sum: { $cond: [{ $eq: ['$severity', 'warning'] }, 1, 0] }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
            {
                $project: {
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day'
                        }
                    },
                    count: 1,
                    critical: 1,
                    error: 1,
                    warning: 1,
                    _id: 0
                }
            }
        ]);

        const totalLogs = await LogModel.countDocuments({
            createdAt: { $gte: startDate }
        });

        return NextResponse.json({
            success: true,
            data: {
                period: `${numDays} days`,
                totalLogs,
                severityStats,
                categoryStats,
                timeStats,
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch log statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch log statistics'),
        }, { status: 500 });
    }
}
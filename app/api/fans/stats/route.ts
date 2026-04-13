// app/api/fans/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import UserModel from '@/models/user';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/fans/stats - Get fan statistics
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const totalFans = await UserModel.countDocuments({ isFan: true });

        const totalPoints = await UserModel.aggregate([
            { $match: { isFan: true } },
            { $group: { _id: null, total: { $sum: '$fanPoints' } } }
        ]);

        const averageEngagement = await UserModel.aggregate([
            { $match: { isFan: true } },
            { $group: { _id: null, avg: { $avg: '$engagementScore' } } }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalFans,
                totalPoints: totalPoints[0]?.total || 0,
                averageEngagement: Math.round(averageEngagement[0]?.avg || 0)
            }
        });
    } catch (error) {
        LoggerService.error('Failed to fetch fan stats', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch fan stats'),
        }, { status: 500 });
    }
}
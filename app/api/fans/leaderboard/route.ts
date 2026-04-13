// app/api/fans/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import UserModel from '@/models/user';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/fans/leaderboard - Get fan leaderboard
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '50');
        const sortBy = searchParams.get('sortBy') || 'fanPoints';

        const fans = await UserModel.find({ isFan: true })
            .sort({ [sortBy]: -1 })
            .limit(limit)
            .select('-password')
            .lean();

        const rankedFans = fans.map((fan, index) => ({
            ...fan,
            fanRank: index + 1
        }));

        return NextResponse.json({
            success: true,
            data: rankedFans,
            pagination: {
                total: fans.length,
                limit: limit
            }
        });
    } catch (error) {
        LoggerService.error('Failed to fetch fan leaderboard', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch fans'),
        }, { status: 500 });
    }
}
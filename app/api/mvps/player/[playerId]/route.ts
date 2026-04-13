// app/api/mvps/player/[playerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import MvPModel from '@/models/mpv';


connectDB();

// GET /api/mvps/player/[playerId] - Get MVPs by player
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ playerId: string }> }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const mvps = await MvPModel.find({ player: (await params).playerId })
            .populate('match', 'title date competition opponent')
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await MvPModel.countDocuments({ player: (await params).playerId });

        return NextResponse.json({
            success: true,
            data: mvps,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch player MVPs', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch player MVPs'),
        }, { status: 500 });
    }
}
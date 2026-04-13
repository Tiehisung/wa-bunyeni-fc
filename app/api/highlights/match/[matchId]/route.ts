// app/api/highlights/match/[matchId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import HighlightModel from '@/models/highlight';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';

connectDB();

// GET /api/highlights/match/[matchId] - Get highlights by match
export async function GET(
    request: NextRequest,
    { params }: { params: { matchId: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const highlights = await HighlightModel.find({ match: params.matchId })
            .populate('match')
            .populate('createdBy', 'name role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await HighlightModel.countDocuments({ match: params.matchId });

        return NextResponse.json({
            success: true,
            data: highlights,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch match highlights', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch match highlights'),
        }, { status: 500 });
    }
}
// app/api/mvps/match/[matchId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import MvPModel from '@/models/mpv';
;

connectDB();

// GET /api/mvps/match/[matchId] - Get MVP by match
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ matchId: string }> }
) {
    try {
        const mvp = await MvPModel.findOne({ match: (await params).matchId })
            .populate('player', 'name number position avatar')
            .lean();

        return NextResponse.json({
            success: true,
            data: mvp || null,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch match MVP', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch match MVP'),
        }, { status: 500 });
    }
}
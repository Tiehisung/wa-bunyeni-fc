// app/api/goals/match/[matchId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import GoalModel from '@/models/goals';


connectDB();

// GET /api/goals/match/[matchId] - Get goals by match
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ matchId: string }> }
) {
    try {
        const goals = await GoalModel.find({ match: (await params).matchId })
            .populate('scorer', 'name number position')
            .populate('assist', 'name number position')
            .sort({ minute: 'asc' })
            .lean();

        return NextResponse.json({
            success: true,
            data: goals,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch match goals', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch match goals'),
        }, { status: 500 });
    }
}
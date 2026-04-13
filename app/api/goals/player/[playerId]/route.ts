// app/api/goals/player/[playerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import GoalModel from '@/models/goals';

connectDB();

// GET /api/goals/player/[playerId] - Get goals by player (scored or assisted)
export async function GET(
    request: NextRequest,
    { params }: { params: { playerId: string } }
) {
    try {
        const goals = await GoalModel.find({
            $or: [
                { 'scorer._id': params.playerId },
                { 'assist._id': params.playerId }
            ]
        })
            .populate('match', 'title date competition')
            .populate('scorer', 'name number position')
            .populate('assist', 'name number position')
            .sort({ createdAt: 'desc' })
            .lean();

        return NextResponse.json({
            success: true,
            data: goals,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch player goals', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch player goals'),
        }, { status: 500 });
    }
}
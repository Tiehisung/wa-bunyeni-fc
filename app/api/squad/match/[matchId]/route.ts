// app/api/squads/match/[matchId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import SquadModel from '@/models/squad';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/squads/match/[matchId] - Get squad by match
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ matchId: string }> }
) {
    try {
        const squad = await SquadModel.findOne({ match: (await params).matchId })
            .populate('match')
            .lean();

        if (!squad) {
            return NextResponse.json({
                success: false,
                message: 'Squad not found for this match',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: squad,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch match squad', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch match squad'),
        }, { status: 500 });
    }
}
// app/api/injuries/match/[matchId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import InjuryModel from '@/models/injury';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';

connectDB();

// GET /api/injuries/match/[matchId] - Get injuries by match
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ matchId: string }> }
) {
    try {
        const injuries = await InjuryModel.find({ match: (await params).matchId })
            .sort({ minute: 'asc' })
            .lean();

        return NextResponse.json({
            success: true,
            data: injuries,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch match injuries', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch match injuries'),
        }, { status: 500 });
    }
}
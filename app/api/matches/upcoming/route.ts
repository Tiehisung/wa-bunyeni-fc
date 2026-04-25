// app/api/matches/upcoming/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { EMatchStatus } from '@/types/match.interface';
import MatchModel from '@/models/match';
import { getApiErrorMessage } from '../../../../lib/error-api';
import '@/shared/models.imports'

connectDB();

// GET /api/matches/upcoming - Get upcoming matches
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '5');

        const matches = await MatchModel.find({
            status: { $in: [EMatchStatus.LIVE, EMatchStatus.UPCOMING] },
            date: { $gte: new Date() }
        })
            .populate('opponent')
            .sort({ date: 'desc' })
            .limit(limit);

        return NextResponse.json({
            success: true,
            data: matches,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch upcoming matches', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch upcoming matches'),
        }, { status: 500 });
    }
}
// app/api/injuries/player/[playerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import InjuryModel from '@/models/injury';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/injuries/player/[playerId] - Get injuries by player
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ playerId: string }> }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const injuries = await InjuryModel.find({ player: (await params).playerId })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await InjuryModel.countDocuments({ player: (await params).playerId });

        return NextResponse.json({
            success: true,
            data: injuries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch player injuries', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch player injuries'),
        }, { status: 500 });
    }
}
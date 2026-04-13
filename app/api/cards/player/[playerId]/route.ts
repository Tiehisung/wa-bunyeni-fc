// app/api/cards/player/[playerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import CardModel from '@/models/card';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/cards/player/[playerId] - Get cards by player
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ playerId: string }> }
) {
    try {
        const playerId = (await params).playerId
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const cards = await CardModel.find({ player: playerId })
            .populate('match', 'title date competition opponent')
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await CardModel.countDocuments({ player: playerId });

        return NextResponse.json({
            success: true,
            data: cards,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch player cards', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch player cards'),
        }, { status: 500 });
    }
}
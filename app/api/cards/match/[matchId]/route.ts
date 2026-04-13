// app/api/cards/match/[matchId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import CardModel from '@/models/card';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/cards/match/[matchId] - Get cards by match
export async function GET(
    request: NextRequest,
    { params }: { params: { matchId: string } }
) {
    try {
        const cards = await CardModel.find({ match: params.matchId })
            .populate('player', 'name number position avatar')
            .sort({ minute: 'asc' })
            .lean();

        const yellowCards = cards.filter(c => c.type === 'yellow').length;
        const redCards = cards.filter(c => c.type === 'red').length;

        return NextResponse.json({
            success: true,
            data: {
                cards,
                summary: {
                    total: cards.length,
                    yellow: yellowCards,
                    red: redCards,
                },
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch match cards', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch match cards'),
        }, { status: 500 });
    }
}
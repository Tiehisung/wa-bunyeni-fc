// app/api/metrics/head-to-head/[opponentId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import MatchModel from '@/models/match';
import { IMatch } from '@/types/match.interface';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/metrics/head-to-head/[opponentId] - Get head-to-head metrics
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ opponentId: string }> }
) {
    try {
        const matches = await MatchModel.find({ opponent: (await params).opponentId, status: 'FT' })
            .populate('opponent')
            .populate('goals') as IMatch[];

        const stats = {
            wins: matches.filter(m => m.computed?.result === 'win'),
            draws: matches.filter(m => m.computed?.result === 'draw'),
            losses: matches.filter(m => m.computed?.result === 'loss'),
        };

        const goalsScored = matches.reduce((t, m) => t + (m.computed?.teamScore || 0), 0);
        const goalsConceded = matches.reduce((t, m) => t + (m.computed?.opponentScore || 0), 0);

        return NextResponse.json({
            success: true,
            data: {
                opponent: matches[0]?.opponent,
                totalMatches: matches.length,
                wins: stats.wins.length,
                draws: stats.draws.length,
                losses: stats.losses.length,
                winRate: matches.length > 0
                    ? ((stats.wins.length / matches.length) * 100).toPrecision(3) + '%'
                    : '0%',
                goalsScored,
                goalsConceded,
                goalDifference: goalsScored - goalsConceded,
                matches: matches.map(m => ({ ...m.computed, date: m.date, isHome: m.isHome })),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch head-to-head metrics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch head-to-head metrics'),
        }, { status: 500 });
    }
}
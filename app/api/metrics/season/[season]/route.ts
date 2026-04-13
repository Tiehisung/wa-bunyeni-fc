// app/api/metrics/season/[season]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import MatchModel from '@/models/match';
import { IMatch } from '@/types/match.interface';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/metrics/season/[season] - Get season metrics
export async function GET(
    request: NextRequest,
    { params }: { params: { season: string } }
) {
    try {
        const matches = await MatchModel.find({ status: 'FT', season: params.season })
            .populate('opponent')
            .populate('goals') as IMatch[];

        const matchStats = {
            wins: matches.filter(m => m.computed?.result === 'win'),
            draws: matches.filter(m => m.computed?.result === 'draw'),
            losses: matches.filter(m => m.computed?.result === 'loss'),
        };

        const winRate = matches.length > 0
            ? ((matchStats.wins.length / matches.length) * 100).toPrecision(3)
            : '0';

        const goalsScored = matches.reduce((t, m) => t + (m.computed?.teamScore || 0), 0);
        const goalsConceded = matches.reduce((t, m) => t + (m.computed?.opponentScore || 0), 0);

        return NextResponse.json({
            success: true,
            data: {
                season: params.season,
                matchStats: {
                    wins: matchStats.wins.length,
                    draws: matchStats.draws.length,
                    losses: matchStats.losses.length,
                    totalMatches: matches.length,
                    winRate: winRate + '%',
                    goalsScored,
                    goalsConceded,
                    goalDifference: goalsScored - goalsConceded,
                    matches: matches.map(m => m.computed),
                },
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch season metrics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch season metrics'),
        }, { status: 500 });
    }
}
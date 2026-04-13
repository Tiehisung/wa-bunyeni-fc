// app/api/metrics/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import MatchModel from '@/models/match';
import PlayerModel from '@/models/player';
import { IMatch } from '@/types/match.interface';
import { EPlayerStatus } from '@/types/player.interface';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/metrics/dashboard - Get dashboard metrics
export async function GET(request: NextRequest) {
    try {
        const matches = await MatchModel.find({ status: 'FT' })
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

        const activePlayers = await PlayerModel.countDocuments({ status: EPlayerStatus.CURRENT });

        const recentForm = matches.slice(0, 5).map(m => ({
            result: m.computed?.result,
            scoreline: m.computed?.scoreline,
            opponent: m.opponent,
        }));

        return NextResponse.json({
            success: true,
            data: {
                activePlayers,
                matchStats: {
                    wins: matchStats.wins.length,
                    draws: matchStats.draws.length,
                    losses: matchStats.losses.length,
                    totalMatches: matches.length,
                    winRate: winRate + '%',
                    goalsScored,
                    goalsConceded,
                    goalDifference: goalsScored - goalsConceded,
                    recentForm,
                },
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch dashboard metrics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch dashboard metrics'),
        }, { status: 500 });
    }
}
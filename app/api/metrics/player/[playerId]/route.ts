// app/api/metrics/player/[playerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import PlayerModel from '@/models/player';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/metrics/player/[playerId] - Get player metrics
export async function GET(
    request: NextRequest,
    { params }: { params: { playerId: string } }
) {
    try {
        const player = await PlayerModel.findById(params.playerId)
            .populate('goals')
            .populate('assists')
            .populate('cards')
            .populate('injuries')
            .populate('mvps')
            .lean({ virtuals: true });

        if (!player) {
            return NextResponse.json({
                success: false,
                message: 'Player not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                player: {
                    id: player._id,
                    name: `${player.firstName} ${player.lastName}`,
                    number: player.number,
                    position: player.position,
                },
                stats: {
                    goals: player.goals?.length || 0,
                    assists: player.assists?.length || 0,
                    goalContributions: (player.goals?.length || 0) + (player.assists?.length || 0),
                    cards: {
                        yellow: player.cards?.filter((c: any) => c.type === 'yellow').length || 0,
                        red: player.cards?.filter((c: any) => c.type === 'red').length || 0,
                        total: player.cards?.length || 0,
                    },
                    injuries: player.injuries?.length || 0,
                    mvps: player.mvps?.length || 0,
                    appearances: player.stats?.appearances || 0,
                },
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch player metrics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch player metrics'),
        }, { status: 500 });
    }
}
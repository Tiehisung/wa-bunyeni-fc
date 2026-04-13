// app/api/mvps/[id]/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';

import { ELogSeverity } from '@/types/log.interface';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import { logAction } from '@/app/api/logs/helper';
import MvPModel from '@/models/mpv';
import PlayerModel from '@/models/player';

connectDB();

// POST /api/mvps/[id]/transfer - Transfer MVP to different player
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { newPlayerId, reason } = await request.json();

        if (!newPlayerId) {
            return NextResponse.json({
                success: false,
                message: 'New player ID is required',
            }, { status: 400 });
        }

        const currentMvp = await MvPModel.findById(params.id)
            .populate('player')
            .populate('match');

        if (!currentMvp) {
            return NextResponse.json({
                success: false,
                message: 'MVP not found',
            }, { status: 404 });
        }

        const oldPlayerId = currentMvp.player?._id;

        // Remove from old player
        if (oldPlayerId) {
            await PlayerModel.findByIdAndUpdate(
                oldPlayerId,
                { $pull: { mvps: params.id } }
            );
        }

        // Add to new player
        await PlayerModel.findByIdAndUpdate(
            newPlayerId,
            { $push: { mvps: params.id } }
        );

        const updated = await MvPModel.findByIdAndUpdate(
            params.id,
            {
                $set: {
                    player: newPlayerId,
                    transferredFrom: oldPlayerId,
                    transferReason: reason,
                },
            },
            { new: true }
        ).populate('player', 'name number position avatar')
            .populate('match', 'title date competition opponent');

        await logAction({
            title: '🏆 MVP Transferred',
            description: `MVP transferred to ${updated?.player?.name}`,
            severity: ELogSeverity.WARNING,
            meta: {
                mvpId: params.id,
                fromPlayer: oldPlayerId,
                toPlayer: newPlayerId,
                reason,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'MVP transferred successfully',
            data: updated,
        });
    } catch (error) {
        // LoggerService.error('Failed to transfer MVP', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to transfer MVP'),
        }, { status: 500 });
    }
}
// app/api/teams/[id]/players/[playerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import TeamModel from '@/models/teams';


connectDB();

// DELETE /api/teams/[id]/players/[playerId] - Remove player from team
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; playerId: string }> }
) {
    try {
        const session = await auth();
 

        const team = await TeamModel.findByIdAndUpdate(
            (await params).id,
            {
                $pull: { players: (await params).playerId },
                $set: { updatedAt: new Date() },
            },
        
        ).populate('players');

        if (!team) {
            return NextResponse.json({
                success: false,
                message: 'Team not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Player removed from team',
            data: team,
        });
    } catch (error) {
        LoggerService.error('Failed to remove player from team', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to remove player from team'),
        }, { status: 500 });
    }
}
// app/api/teams/[id]/players/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import TeamModel from '@/models/teams';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { playerId } = await request.json();

        if (!playerId) {
            return NextResponse.json({
                success: false,
                message: 'Player ID is required',
            }, { status: 400 });
        }

        const team = await TeamModel.findByIdAndUpdate(
            params.id,
            {
                $addToSet: { players: playerId },
                $set: { updatedAt: new Date() },
            },
            { new: true }
        ).populate('players');

        if (!team) {
            return NextResponse.json({
                success: false,
                message: 'Team not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Player added to team',
            data: team,
        });
    } catch (error) {
        LoggerService.error('Failed to add player to team', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to add player to team'),
        }, { status: 500 });
    }
}
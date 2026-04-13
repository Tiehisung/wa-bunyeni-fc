// app/api/squads/[id]/players/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import SquadModel from '@/models/squad';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// PATCH /api/squads/[id]/players - Update squad players
export async function PATCH(
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

        const { players } = await request.json();

        if (!players || !Array.isArray(players)) {
            return NextResponse.json({
                success: false,
                message: 'Players array is required',
            }, { status: 400 });
        }

        const updated = await SquadModel.findByIdAndUpdate(
            params.id,
            { $set: { players } },

        ).populate('players.player', 'name number position avatar');

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Squad not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Squad players updated',
            data: updated,
        });
    } catch (error) {
        LoggerService.error('Failed to update squad players', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update squad players'),
        }, { status: 500 });
    }
}
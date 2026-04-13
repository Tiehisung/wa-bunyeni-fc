// app/api/squads/[id]/substitutions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import SquadModel from '@/models/squad';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// PATCH /api/squads/[id]/substitutions - Add substitution
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { minute, playerIn, playerOut, reason } = await request.json();

        if (!minute || !playerIn || !playerOut) {
            return NextResponse.json({
                success: false,
                message: 'Minute, playerIn, and playerOut are required',
            }, { status: 400 });
        }

        const updated = await SquadModel.findByIdAndUpdate(
            (await params).id,
            {
                $push: {
                    substitutions: {
                        minute,
                        playerIn,
                        playerOut,
                        reason: reason || 'Tactical',
                        timestamp: new Date(),
                    },
                },
            },
            { new: true }
        )
            .populate('substitutions.playerIn', 'name number position')
            .populate('substitutions.playerOut', 'name number position');

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Squad not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Substitution added',
            data: updated,
        });
    } catch (error) {
        LoggerService.error('Failed to add substitution', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to add substitution'),
        }, { status: 500 });
    }
}
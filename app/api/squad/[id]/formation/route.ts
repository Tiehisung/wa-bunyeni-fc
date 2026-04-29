// app/api/squads/[id]/formation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import SquadModel from '@/models/squad';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// PATCH /api/squads/[id]/formation - Update formation
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

        const { formation, tactics } = await request.json();

        const updated = await SquadModel.findByIdAndUpdate(
            (await params).id,
            { $set: { formation, tactics } },
     
        );

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Squad not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Formation updated',
            data: updated,
        });
    } catch (error) {
        LoggerService.error('Failed to update formation', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update formation'),
        }, { status: 500 });
    }
}
// app/api/injuries/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import InjuryModel from '@/models/injury';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// PATCH /api/injuries/[id]/status - Update injury status
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

        const { status } = await request.json();

        const validStatuses = ['active', 'recovering', 'recovered', 'season_ending'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid status value',
            }, { status: 400 });
        }

        const updatedInjury = await InjuryModel.findByIdAndUpdate(
            params.id,
            {
                $set: {
                    status,
                    updatedAt: new Date(),
                    updatedBy: session.user?.id,
                    recoveredAt: status === 'recovered' ? new Date() : undefined,
                },
            },
            { new: true }
        ).populate('player', 'name number position avatar');

        if (!updatedInjury) {
            return NextResponse.json({
                success: false,
                message: 'Injury not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Injury status updated',
            data: updatedInjury,
        });
    } catch (error) {
        LoggerService.error('Failed to update injury status', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update injury status'),
        }, { status: 500 });
    }
}
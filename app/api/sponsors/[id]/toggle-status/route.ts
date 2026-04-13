// app/api/sponsors/[id]/toggle-status/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import SponsorModel from '@/models/sponsor';
import { LoggerService } from '@/shared/log.service';


connectDB();

// PATCH /api/sponsors/[id]/toggle-status - Toggle sponsor status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { isActive } = await request.json();

        const updated = await SponsorModel.findByIdAndUpdate(
            (await params).id,
            {
                $set: {
                    isActive,
                    updatedAt: new Date(),
                    updatedBy: session.user?.id,
                },
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Sponsor not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Sponsor ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: updated,
        });
    } catch (error) {
        LoggerService.error('Failed to update sponsor status', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update sponsor status'),
        }, { status: 500 });
    }
}
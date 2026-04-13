// app/api/sponsors/[id]/donations/[donationId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import DonationModel from '@/models/donation';
import SponsorModel from '@/models/sponsor';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';

connectDB();

// ✅ CORRECT - Multiple params as Promise
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; donationId: string }> }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { id, donationId } = await params;

        await DonationModel.findByIdAndDelete(donationId);

        await SponsorModel.findByIdAndUpdate(id, {
            $pull: { donations: donationId },
        });

        return NextResponse.json({
            message: 'Donation revoked successfully',
            success: true,
        });
    } catch (error) {
        LoggerService.error('Failed to delete donation', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to delete donation'),
            success: false,
        }, { status: 500 });
    }
}
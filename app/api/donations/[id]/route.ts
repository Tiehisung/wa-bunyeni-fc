// app/api/donations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import DonationModel from '@/models/donation';
import SponsorModel from '@/models/sponsor';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/donations/[id] - Get single donation
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const donation = await DonationModel.findById(params.id)
            .populate('sponsor')
            .populate('files')
            .populate('createdBy', 'name role')
            .lean();

        if (!donation) {
            return NextResponse.json({
                success: false,
                message: 'Donation not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: donation,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch donation', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch donation'),
        }, { status: 500 });
    }
}

// DELETE /api/donations/[id] - Delete donation
export async function DELETE(
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

        const donation = await DonationModel.findById(params.id);

        if (!donation) {
            return NextResponse.json({
                success: false,
                message: 'Donation not found',
            }, { status: 404 });
        }

        await DonationModel.findByIdAndDelete(params.id);

        // Update sponsor - remove donation reference
        await SponsorModel.findByIdAndUpdate(donation.sponsor, {
            $pull: { donations: params.id },
            $inc: {
                badge: -1,
                totalDonations: -1,
                totalValue: -(donation.value || 0),
            }
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
// app/api/sponsors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import SponsorModel from '@/models/sponsor';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';

connectDB();

// ✅ CORRECT - params is a Promise
export async function GET(
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

        // ✅ MUST await params
        const { id } = await params;

        const sponsor = await SponsorModel.findById(id)
            .populate({ path: 'donations', populate: { path: 'files' } })
            .populate('logo')
            .populate('badges')
            .populate('createdBy', 'name role')
            .lean();

        if (!sponsor) {
            return NextResponse.json({
                success: false,
                message: 'Sponsor not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: sponsor,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch sponsor', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch sponsor'),
        }, { status: 500 });
    }
}

// PUT /api/sponsors/[id] - Update sponsor
export async function PUT(
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

        const { id } = await params;
        const sponsorData = await request.json();
        delete sponsorData._id;

        const updated = await SponsorModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...sponsorData,
                    updatedAt: new Date(),
                    updatedBy: session.user?._id,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Sponsor not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Sponsor updated successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        LoggerService.error('Failed to update sponsor', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to update sponsor'),
            success: false,
        }, { status: 500 });
    }
}

// DELETE /api/sponsors/[id] - Delete sponsor
export async function DELETE(
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

        const { id } = await params;

        const sponsor = await SponsorModel.findById(id);

        if (!sponsor) {
            return NextResponse.json({
                success: false,
                message: 'Sponsor not found',
            }, { status: 404 });
        }

        const deleted = await SponsorModel.findByIdAndDelete(id);

        return NextResponse.json({
            message: 'Sponsor deleted successfully',
            success: true,
            data: {
                id: deleted?._id,
                name: sponsor.name,
                businessName: sponsor.businessName,
            },
        });
    } catch (error) {
        LoggerService.error('Failed to delete sponsor', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to delete sponsor'),
            success: false,
        }, { status: 500 });
    }
}
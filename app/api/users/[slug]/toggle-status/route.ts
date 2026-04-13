// app/api/users/[slug]/toggle-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import UserModel from '@/models/user';
import { ELogSeverity } from '@/types/log.interface';
import { logAction } from '@/app/api/logs/helper';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import { slugIdFilters } from '@/lib/slug';

connectDB();

// POST /api/users/[slug]/toggle-status - Toggle user status
export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const filter = slugIdFilters(params.slug);
        const { status } = await request.json();

        if (!['active', 'inactive', 'suspended'].includes(status)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid status value',
            }, { status: 400 });
        }

        const user = await UserModel.findOne(filter);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
            }, { status: 404 });
        }

        // Prevent deactivating super_admin
        if (user.role === 'super_admin' && session.user?.role !== 'super_admin') {
            return NextResponse.json({
                success: false,
                message: 'Cannot modify super admin status',
            }, { status: 403 });
        }

        const updated = await UserModel.findOneAndUpdate(
            filter,
            { $set: { status } },
            { new: true }
        ).select('-password');

        await logAction({
            title: `User [${user.name}] status changed to ${status}`,
            description: 'User status updated',
            severity: ELogSeverity.CRITICAL,
            meta: { targetUserId: user._id, oldStatus: user.status, newStatus: status },
        });

        return NextResponse.json({
            success: true,
            message: `User status updated to ${status}`,
            data: updated,
        });
    } catch (error) {
        LoggerService.error('Failed to update user status', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update user status'),
        }, { status: 500 });
    }
}
// app/api/users/[slug]/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/user';
import { ELogSeverity } from '@/types/log.interface';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import { slugIdFilters } from '@/lib/slug';
import { logAction } from '@/app/api/logs/helper';

connectDB();

// POST /api/users/[slug]/change-password - Change user password
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
        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({
                success: false,
                message: 'Current password and new password are required',
            }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({
                success: false,
                message: 'New password must be at least 6 characters long',
            }, { status: 400 });
        }

        const user = await UserModel.findOne(filter).select('+password');

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
            }, { status: 404 });
        }

        const isOwnAccount = session.user?.id === user._id.toString();
        const isAdmin = session.user?.role === 'admin' || session.user?.role === 'super_admin';

        if (!isOwnAccount && !isAdmin) {
            return NextResponse.json({
                success: false,
                message: 'Not authorized to change this user\'s password',
            }, { status: 403 });
        }

        if (isOwnAccount) {
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return NextResponse.json({
                    success: false,
                    message: 'Current password is incorrect',
                }, { status: 401 });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await UserModel.findOneAndUpdate(
            filter,
            { $set: { password: hashedPassword } }
        );

        await logAction({
            title: `Password changed for user [${user.name}]`,
            description: `User password was changed`,
            severity: ELogSeverity.CRITICAL,
            meta: { targetUserId: user._id, changedBy: session.user?.id },
        });

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        LoggerService.error('Failed to change password', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to change password'),
        }, { status: 500 });
    }
}
// app/api/fans/register/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import UserModel from '@/models/user';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import { EUserRole } from '@/types/user';

connectDB();

// POST /api/fans/register/[userId] - Register as fan
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const userId=(await params).userId
        const session = await auth();

        if (!session) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const user = await UserModel.findByIdAndUpdate(
          userId,
            {
                isFan: true,
                fanSince: new Date(),
                role: EUserRole.FAN
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully registered as a fan!',
            data: user
        });
    } catch (error) {
        LoggerService.error('Failed to register as fan', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to register as fan'),
        }, { status: 500 });
    }
}
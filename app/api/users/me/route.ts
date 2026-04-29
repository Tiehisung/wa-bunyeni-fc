// app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/users/me - Get current authenticated user
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: 'Not authenticated',
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: session.user,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch current user', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch current user'),
        }, { status: 500 });
    }
}
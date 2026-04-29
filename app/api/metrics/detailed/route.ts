// app/api/metrics/detailed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/metrics/detailed - Get detailed analytics (protected)
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        // This is a placeholder for detailed analytics
        // In practice, you'd combine multiple metrics or create a dedicated controller
        return NextResponse.json({
            success: true,
            message: 'Detailed analytics endpoint - implement as needed',
            data: {
                // Add detailed analytics data here
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch detailed analytics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch detailed analytics'),
        }, { status: 500 });
    }
}
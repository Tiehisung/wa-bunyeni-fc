// app/api/transactions/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';
import { getTransactionsSummary } from '../helpers';

connectDB();

// GET /api/transactions/summary - Get transaction summary
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get('startDate') || '';
        const endDate = searchParams.get('endDate') || '';

        const summary = await getTransactionsSummary(startDate, endDate);

        return NextResponse.json({
            success: true,
            data: summary,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch transaction summary', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch transaction summary'),
        }, { status: 500 });
    }
}
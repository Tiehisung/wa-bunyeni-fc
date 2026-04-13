// app/api/logs/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import LogModel from '@/models/logs';
import { LoggerService } from '@/shared/log.service';
 

connectDB();

// DELETE /api/logs/cleanup - Cleanup old logs (admin only)
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (session?.user?.role !== 'super_admin') {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized - Super admin access required',
            }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const olderThan = parseInt(searchParams.get('olderThan') || '90');
        const days = olderThan;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const result = await LogModel.deleteMany({
            createdAt: { $lt: cutoffDate }
        });

        return NextResponse.json({
            success: true,
            message: `Deleted ${result.deletedCount} logs older than ${days} days`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        LoggerService.error('Failed to cleanup old logs', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to cleanup old logs'),
        }, { status: 500 });
    }
}
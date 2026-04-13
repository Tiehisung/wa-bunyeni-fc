// app/api/logs/severity/[severity]/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
 
import { ELogSeverity } from '@/types/log.interface';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import LogModel from '@/models/logs';
import { LoggerService } from '@/shared/log.service';

connectDB();

// GET /api/logs/severity/[severity] - Get logs by severity
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ severity: string }> }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach', 'player'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const  severity  = (await params).severity;
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const validSeverities = Object.values(ELogSeverity);
        if (!validSeverities.includes(severity as ELogSeverity)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid severity level',
                validSeverities,
            }, { status: 400 });
        }

        const logs = await LogModel.find({ severity })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await LogModel.countDocuments({ severity });

        return NextResponse.json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch logs by severity', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch logs by severity'),
        }, { status: 500 });
    }
}
// app/api/training/upcoming/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import TrainingSessionModel from '@/models/training';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/training/upcoming - Get upcoming training sessions
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '5');

        const sessions = await TrainingSessionModel.find({
            date: { $gte: new Date() }
        })
            .sort({ date: 1 })
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: sessions,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch upcoming training', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch upcoming training'),
        }, { status: 500 });
    }
}
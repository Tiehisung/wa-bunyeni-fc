// app/api/training/player/[playerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import TrainingSessionModel from '@/models/training';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/training/player/[playerId] - Get player training history
export async function GET(
    request: NextRequest,
    { params }: { params: { playerId: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const sessions = await TrainingSessionModel.find({
            'attendance.attendedBy._id': params.playerId
        })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await TrainingSessionModel.countDocuments({
            'attendance.attendedBy._id': params.playerId
        });

        const totalSessions = await TrainingSessionModel.countDocuments({
            date: { $lte: new Date() }
        });

        const attendanceRate = totalSessions > 0
            ? ((total / totalSessions) * 100).toFixed(1)
            : '0';

        return NextResponse.json({
            success: true,
            data: {
                sessions,
                stats: {
                    attended: total,
                    totalSessions,
                    attendanceRate: `${attendanceRate}%`,
                },
            },
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch player training history', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch player training history'),
        }, { status: 500 });
    }
}
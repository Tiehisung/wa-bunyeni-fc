// app/api/training/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import TrainingSessionModel from '@/models/training';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/training/stats - Get training statistics
export async function GET(request: NextRequest) {
    try {
        const sessions = await TrainingSessionModel.find()
            .sort({ date: -1 })
            .lean();

        const stats = {
            totalSessions: sessions.length,
            byLocation: {} as Record<string, number>,
            byMonth: {} as Record<string, number>,
            totalAttendance: 0,
            averageAttendance: 0,
            recentSessions: [] as any[],
        };

        sessions.forEach(session => {
            if (session.location) {
                stats.byLocation[session.location] = (stats.byLocation[session.location] || 0) + 1;
            }

            const monthKey = `${session.date.getFullYear()}-${session.date.getMonth() + 1}`;
            stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1;

            const attendeeCount = session.attendance?.attendedBy?.length || 0;
            stats.totalAttendance += attendeeCount;
        });

        stats.averageAttendance = stats.totalSessions > 0
            ? Math.round((stats.totalAttendance / stats.totalSessions) * 10) / 10
            : 0;

        stats.recentSessions = sessions.slice(0, 10).map(s => ({
            date: s.date,
            location: s.location,
            attendees: s.attendance?.attendedBy?.length || 0,
        }));

        return NextResponse.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch training statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch training statistics'),
        }, { status: 500 });
    }
}
// app/api/training/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import TrainingSessionModel from '@/models/training';
import { IPostTrainingSession } from '@/models/training';
import { formatDate } from '@/lib/timeAndDate';
import { ELogSeverity } from '@/types/log.interface';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';
import { logAction } from '../logs/helper';

connectDB();

// GET /api/training - List all training sessions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const trainingSearch = searchParams.get('training_search');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const location = searchParams.get('location');
    const playerId = searchParams.get('playerId');

    const query: any = {};

    if (trainingSearch) {
      const regex = new RegExp(trainingSearch, 'i');
      query.$or = [
        { location: regex },
        { note: regex },
        { 'attendance.attendedBy.name': regex }
      ];
    }

    if (location) query.location = location;

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    if (playerId) {
      query['attendance.attendedBy._id'] = playerId;
    }

    const [sessions, total] = await Promise.all([
      TrainingSessionModel.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TrainingSessionModel.countDocuments(query)
    ]);

    const enhancedSessions = sessions.map(session => ({
      ...session,
      attendees: session.attendance?.attendedBy?.length || 0,
      totalPlayers: session.attendance?.allPlayers?.length || 0
    }));

    const totalAttendance = enhancedSessions.reduce((sum, s) => sum + s.attendees, 0);
    const sessionsWithAttendance = enhancedSessions.filter(s => s.attendees > 0).length;

    return NextResponse.json({
      success: true,
      data: enhancedSessions,
      summary: {
        totalSessions: total,
        totalAttendance,
        averageAttendance: total ? Number((totalAttendance / total).toFixed(1)) : 0,
        attendanceRate: total ? Math.round((sessionsWithAttendance / total) * 100) : 0
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    LoggerService.error('Failed to fetch training sessions', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch training sessions'),
    }, { status: 500 });
  }
}

// POST /api/training - Create new training session
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { attendance, date, location, note } = await request.json() as IPostTrainingSession;

    if (!date || !location) {
      return NextResponse.json({
        success: false,
        message: 'Date and location are required',
      }, { status: 400 });
    }

    const existingSession = await TrainingSessionModel.findOne({
      date: new Date(date),
      location,
    });

    if (existingSession) {
      return NextResponse.json({
        success: false,
        message: 'A training session already exists at this date and location',
      }, { status: 409 });
    }

    const savedSession = await TrainingSessionModel.create({
      attendance: attendance || [],
      date: new Date(date),
      location,
      note,
      createdAt: new Date(),
      updateCount: 0,
      createdBy: session.user?.id
    });

    if (!savedSession) {
      return NextResponse.json({
        message: 'Failed to record session.',
        success: false,
      }, { status: 500 });
    }

    await logAction({
      title: '🏋️ Training Session Recorded',
      description: `Training session at ${location} on ${formatDate(date)}`,
      severity: ELogSeverity.INFO,
      meta: {
        sessionId: savedSession._id,
        location,
        date,
        attendees: attendance?.attendedBy?.length || 0,
      },
    });

    const populatedSession = await TrainingSessionModel.findById(savedSession._id)
      .populate('attendance.attendedBy', 'name firstName lastName number position')
      .lean();

    return NextResponse.json({
      message: 'Training session recorded successfully!',
      success: true,
      data: populatedSession,
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create training session', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to create training session'),
      success: false,
    }, { status: 500 });
  }
}
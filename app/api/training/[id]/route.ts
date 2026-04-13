// app/api/training/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import TrainingSessionModel from '@/models/training';

import { ELogSeverity } from '@/types/log.interface';
import { formatDate } from '@/lib/timeAndDate';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { logAction } from '../../logs/helper';

connectDB();

// GET /api/training/[id] - Get single training session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await TrainingSessionModel.findById(id).lean();

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Training session not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch training session', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch training session'),
    }, { status: 500 });
  }
}

// PUT /api/training/[id] - Update training session
export async function PUT(
  request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const formData = await request.json();

    const existingSession = await TrainingSessionModel.findById(id);
    if (!existingSession) {
      return NextResponse.json({
        success: false,
        message: 'Training session not found',
      }, { status: 404 });
    }

    if (existingSession.updateCount >= 3) {
      return NextResponse.json({
        message: 'Session update limit reached (max 3 updates)',
        success: false,
      }, { status: 400 });
    }

    delete formData._id;

    const updated = await TrainingSessionModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...formData,
          updatedAt: new Date(),
          updatedBy: session.user?.id,
        },
        $inc: { updateCount: 1 },
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update session',
      }, { status: 500 });
    }

    await logAction({
      title: '🏋️ Training Session Updated',
      description: `Training session at ${updated.location} updated`,
      severity: ELogSeverity.INFO,
      meta: {
        sessionId: id,
        updates: Object.keys(formData),
        updateCount: (existingSession.updateCount || 0) + 1,
      },
    });

    return NextResponse.json({
      message: 'Training session updated successfully',
      success: true,
      data: updated,
    });
  } catch (error) {
    LoggerService.error('Failed to update training session', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to update training session'),
      success: false,
    }, { status: 500 });
  }
}

// DELETE /api/training/[id] - Delete training session
export async function DELETE(
  request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await auth();

    if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const existingSession = await TrainingSessionModel.findById(id);

    if (!existingSession) {
      return NextResponse.json({
        success: false,
        message: 'Training session not found',
      }, { status: 404 });
    }

    await TrainingSessionModel.findByIdAndDelete(id);

    await logAction({
      title: '🏋️ Training Session Deleted',
      description: `Training session at ${existingSession.location} on ${formatDate(existingSession.date)} deleted`,
      severity: ELogSeverity.CRITICAL,
      meta: {
        sessionId: id,
        location: existingSession.location,
        date: existingSession.date,
      },
    });

    return NextResponse.json({
      message: 'Training session deleted successfully',
      success: true,
    });
  } catch (error) {
    LoggerService.error('Failed to delete training session', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to delete training session'),
      success: false,
    }, { status: 500 });
  }
}
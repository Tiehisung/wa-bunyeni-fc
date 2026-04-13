// app/api/squads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import SquadModel from '@/models/squad';
import MatchModel from '@/models/match';

import { EArchivesCollection } from '@/types/archive.interface';

import { ELogSeverity } from '@/types/log.interface';
import { formatDate } from '@/lib/timeAndDate';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { saveToArchive } from '../../archives/helper';
import { logAction } from '../../logs/helper';

connectDB();

// GET /api/squads/[id] - Get single squad
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const squad = await SquadModel.findById(id)
      .populate('match')
      .lean();

    if (!squad) {
      return NextResponse.json({
        success: false,
        message: 'Squad not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: squad,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch squad', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch squad'),
    }, { status: 500 });
  }
}

// PUT /api/squads/[id] - Update squad
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const updates = await request.json();
    delete updates._id;

    const updated = await SquadModel.findByIdAndUpdate(
      id,
      { $set: { ...updates } },
      { new: true, runValidators: true }
    ).populate('match', 'title date competition opponent');

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: 'Squad not found',
      }, { status: 404 });
    }

    await logAction({
      title: '📋 Squad Updated',
      description: `Squad for ${updated.title} updated`,
      severity: ELogSeverity.INFO,
      meta: {
        squadId: id,
        updates: Object.keys(updates),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Squad updated successfully',
      data: updated,
    });
  } catch (error) {
    LoggerService.error('Failed to update squad', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to update squad'),
    }, { status: 500 });
  }
}

// DELETE /api/squads/[id] - Delete squad
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const session = await auth();

    if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const squad = await SquadModel.findById(id);

    if (!squad) {
      return NextResponse.json({
        success: false,
        message: 'Squad not found',
      }, { status: 404 });
    }

    const deleted = await SquadModel.findByIdAndDelete(id);

    if (squad.match) {
      await MatchModel.findByIdAndUpdate(
        squad.match,
        { $unset: { squad: '' } }
      );
    }

    await saveToArchive(squad, EArchivesCollection.SQUADS, '', request);

    await logAction({
      title: '📋 Squad Deleted',
      description: `Squad for ${squad.title} deleted on ${formatDate(new Date().toISOString())}`,
      severity: ELogSeverity.CRITICAL,
      meta: {
        squadId: id,
        matchId: squad.match,
        playerCount: squad.players?.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Squad deleted successfully',
      data: {
        id: deleted?._id,
        title: squad.title,
      },
    });
  } catch (error) {
    LoggerService.error('Failed to delete squad', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to delete squad'),
    }, { status: 500 });
  }
}
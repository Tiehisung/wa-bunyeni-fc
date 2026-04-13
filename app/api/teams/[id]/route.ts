// app/api/teams/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import { EArchivesCollection } from '@/types/archive.interface';
import { ELogSeverity } from '@/types/log.interface';
import { formatDate } from '@/lib/timeAndDate';
import ArchiveModel from '@/models/Archives';
import TeamModel from '@/models/teams';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { logAction } from '../../logs/helper';

connectDB();

// GET /api/teams/[id] - Get single team
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const team = await TeamModel.findById(id).lean();

    if (!team) {
      return NextResponse.json({
        success: false,
        message: 'Team not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch team', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to retrieve team'),
    }, { status: 500 });
  }
}

// PUT /api/teams/[id] - Update team
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await auth();

    // Optional: Uncomment for auth check
    // if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
    //     return NextResponse.json({
    //         success: false,
    //         message: 'Unauthorized',
    //     }, { status: 401 });
    // }

    const teamData = await request.json();
    delete teamData._id;

    const updated = await TeamModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...teamData,
          updatedAt: new Date(),
          updatedBy: session?.user?.id,
        },
      },
      {  runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: 'Team not found',
      }, { status: 404 });
    }

    await logAction({
      title: `Team Updated - ${updated.name}`,
      description: 'Team details updated',
      severity: ELogSeverity.INFO,
      meta: {
        teamId: id,
        updates: Object.keys(teamData),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Team updated successfully',
      data: updated,
    });
  } catch (error) {
    LoggerService.error('Failed to update team', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to update team'),
    }, { status: 500 });
  }
}

// PATCH /api/teams/[id] - Partial update team
export async function PATCH(
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

    const updates = await request.json();

    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined || updates[key] === null) {
        delete updates[key];
      }
    });
    delete updates._id;

    const updated = await TeamModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: session.user?.id,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: 'Team not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Team updated successfully',
      data: updated,
    });
  } catch (error) {
    LoggerService.error('Failed to update team', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to update team'),
    }, { status: 500 });
  }
}

// DELETE /api/teams/[id] - Delete team
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await auth();

    // Optional: Uncomment for auth check
    // if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
    //     return NextResponse.json({
    //         success: false,
    //         message: 'Unauthorized',
    //     }, { status: 401 });
    // }

    const teamToDelete = await TeamModel.findById(id);

    if (!teamToDelete) {
      return NextResponse.json({
        success: false,
        message: 'Team not found',
      }, { status: 404 });
    }

    const deleted = await TeamModel.findByIdAndDelete(id);

    await ArchiveModel.create({
      sourceCollection: EArchivesCollection.TEAMS,
      originalId: id,
      data: teamToDelete,
      archivedAt: new Date(),
      archivedBy: session?.user?.id,
      reason: 'Team deleted',
    });

    await logAction({
      title: `Team Deleted - ${teamToDelete.name}`,
      description: `Team ${teamToDelete.name} deleted on ${formatDate(new Date().toISOString())}`,
      severity: ELogSeverity.CRITICAL,
      meta: {
        teamId: id,
        clubId: teamToDelete.clubId,
        season: teamToDelete.season,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Team deleted successfully',
      data: {
        id: deleted?._id,
        name: teamToDelete.name,
      },
    });
  } catch (error) {
    LoggerService.error('Failed to delete team', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to delete team'),
    }, { status: 500 });
  }
}
// app/api/staff/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import StaffModel from '@/models/staff';
import { EArchivesCollection } from '@/types/archive.interface';
import { ELogSeverity } from '@/types/log.interface';
import { formatDate } from '@/lib/timeAndDate';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { saveToArchive } from '../../archives/helper';
import { logAction } from '../../logs/helper';

connectDB();

// GET /api/staff/[id] - Get single staff
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const staffMember = await StaffModel.findById((await params).id).lean();

    if (!staffMember) {
      return NextResponse.json({
        success: false,
        message: 'Staff not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: staffMember,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch staff', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch staff'),
    }, { status: 500 });
  }
}

// PUT /api/staff/[id] - Update staff
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const updates = await request.json();
    delete updates._id;

    if (updates.email) {
      const existingStaff = await StaffModel.findOne({
        email: updates.email.toLowerCase().trim(),
        _id: { $ne: (await params).id }
      });

      if (existingStaff) {
        return NextResponse.json({
          success: false,
          message: 'Email already in use by another staff member',
        }, { status: 409 });
      }
      updates.email = updates.email.toLowerCase().trim();
    }

    const updated = await StaffModel.findByIdAndUpdate(
      (await params).id,
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
        message: 'Staff not found',
      }, { status: 404 });
    }

    await logAction({
      title: '👔 Staff Updated',
      description: `${updated.fullname}'s record updated`,
      severity: ELogSeverity.INFO,
      meta: {
        staffMemberId: (await params).id,
        updates: Object.keys(updates),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Staff updated successfully',
      data: updated,
    });
  } catch (error) {
    LoggerService.error('Failed to update staff', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to update staff'),
    }, { status: 500 });
  }
}

// DELETE /api/staff/[id] - Delete staff
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const staffMember = await StaffModel.findById((await params).id);

    if (!staffMember) {
      return NextResponse.json({
        success: false,
        message: 'Staff not found',
      }, { status: 404 });
    }

    const deleted = await StaffModel.findByIdAndDelete((await params).id);
    await saveToArchive(staffMember, EArchivesCollection.USERS, '', request);

    await logAction({
      title: '👔 Staff Deleted',
      description: `${staffMember.fullname} (${staffMember.role}) deleted on ${formatDate(new Date().toISOString())}`,
      severity: ELogSeverity.CRITICAL,
      meta: {
        staffMemberId: (await params).id,
        role: staffMember.role,
        email: staffMember.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Staff deleted successfully',
      data: {
        id: deleted?._id,
        fullname: staffMember.fullname,
        role: staffMember.role,
      },
    });
  } catch (error) {
    LoggerService.error('Failed to delete staff', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to delete staff'),
    }, { status: 500 });
  }
}
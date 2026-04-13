// app/api/users/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import UserModel from '@/models/user';
import { EArchivesCollection } from '@/types/archive.interface';
import { ELogSeverity } from '@/types/log.interface';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { slugIdFilters } from '../../../../lib/slug';
import { saveToArchive } from '../../archives/helper';
import { logAction } from '../../logs/helper';
import { hasher } from '../../../../lib/hasher';

connectDB();

// GET /api/users/[slug] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params:Promise< { slug: string } >}
) {
  try {
    const slug=(await params).slug
    const filter = slugIdFilters(slug);

    const user = await UserModel.findOne(filter)
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch user', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch user'),
    }, { status: 500 });
  }
}

// PUT /api/users/[slug] - Update user
export async function PUT(
  request: NextRequest,
   { params }: { params:Promise< { slug: string } >}
) {
  try {
    const slug=(await params).slug
    const session = await auth();

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const filter = slugIdFilters(slug);
    const { password, ...data } = await request.json();

    const existingUser = await UserModel.findOne(filter);
    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    // Prevent role escalation if not authorized
    if (data.role && data.role !== existingUser.role) {
      if (session.user?.role !== 'super_admin' && session.user?.role !== 'admin') {
        return NextResponse.json({
          success: false,
          message: 'Not authorized to change user roles',
        }, { status: 403 });
      }
    }

    const updated = await UserModel.findOneAndUpdate(
      filter,
      { $set: data },
      { new: true }
    ).select('-password');

    if (password) {
      const hashedPassword = await hasher(password);
      await UserModel.findOneAndUpdate(
        filter,
        { $set: { password: hashedPassword } }
      );
      const userWithNewPass = await UserModel.findOne(filter).select('-password');
      Object.assign(updated, userWithNewPass);
    }

    await logAction({
      title: `User [${updated?.name}] updated`,
      description: `User ${updated?.email} was updated`,
      meta: { userId: updated?._id, updates: Object.keys(data) },
      severity: ELogSeverity.INFO,
    });

    return NextResponse.json({
      message: 'User updated successfully',
      success: true,
      data: updated,
    });
  } catch (error) {
    LoggerService.error('Failed to update user', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to update user'),
    }, { status: 500 });
  }
}

// DELETE /api/users/[slug] - Delete user
export async function DELETE(
  request: NextRequest,
   { params }: { params:Promise< { slug: string } >}
) {
  try {
    const slug=(await params).slug
    const session = await auth();

    const filter = slugIdFilters(slug);

    const userToDelete = await UserModel.findOne(filter);
    if (!userToDelete) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    // Prevent self-deletion
    if (session?.user?.id === userToDelete._id.toString()) {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete your own account',
      }, { status: 400 });
    }

    // Prevent deletion of super_admin by non-super_admin
    if (userToDelete.role === 'super_admin' && session?.user?.role !== 'super_admin') {
      return NextResponse.json({
        success: false,
        message: 'Cannot delete super admin account',
      }, { status: 403 });
    }

    const deleted = await UserModel.findOneAndDelete(filter).select('-password');

    await saveToArchive(deleted, EArchivesCollection.USERS, '', request);

    await logAction({
      title: `User [${deleted?.name}] deleted`,
      description: `User ${deleted?.email} was deleted`,
      meta: {
        userId: deleted?._id,
        deletedBy: session?.user?.id,
        deletedByEmail: session?.user?.email
      },
      severity: ELogSeverity.CRITICAL,
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      success: true,
      data: {
        id: deleted?._id,
        email: deleted?.email,
        name: deleted?.name,
      },
    });
  } catch (error) {
    LoggerService.error('Failed to delete user', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to delete user'),
    }, { status: 500 });
  }
}
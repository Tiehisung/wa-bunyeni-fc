// app/api/logs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import LogModel from '@/models/logs';
import { LoggerService } from '@/shared/log.service';
 

connectDB();

// GET /api/logs/[id] - Get single log
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach', 'player'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const log = await LogModel.findById(id).lean();

    if (!log) {
      return NextResponse.json({
        success: false,
        message: 'Log not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: log,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch log', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch log'),
    }, { status: 500 });
  }
}

// DELETE /api/logs/[id] - Delete specific log (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await auth();

    if (session?.user?.role !== 'super_admin') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Super admin access required',
      }, { status: 401 });
    }

    const log = await LogModel.findByIdAndDelete(id);

    if (!log) {
      return NextResponse.json({
        success: false,
        message: 'Log not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Log deleted successfully',
    });
  } catch (error) {
    LoggerService.error('Failed to delete log', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to delete log'),
    }, { status: 500 });
  }
}
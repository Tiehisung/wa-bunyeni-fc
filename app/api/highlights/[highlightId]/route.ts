// app/api/highlights/[highlightId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import HighlightModel from '@/models/highlight';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';
import { logAction } from '../../logs/helper';


connectDB();

// GET /api/highlights/[highlightId] - Get single highlight
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ highlightId: string }> }
) {
  try {
    const highlightId = (await params).highlightId
    const highlight = await HighlightModel.findById(highlightId)
      .populate('match')
      .populate('createdBy', 'name role')
      .lean();

    if (!highlight) {
      return NextResponse.json({
        success: false,
        message: 'Highlight not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: highlight,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch highlight', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch highlight'),
    }, { status: 500 });
  }
}

// PUT /api/highlights/[highlightId] - Update highlight
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ highlightId: string }> }
) {
  try {
    const highlightId = (await params).highlightId
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const updates = await request.json();

    const existingHighlight = await HighlightModel.findById(highlightId);
    if (!existingHighlight) {
      return NextResponse.json({
        success: false,
        message: 'Highlight not found',
      }, { status: 404 });
    }

    const updatedHighlight = await HighlightModel.findByIdAndUpdate(
      highlightId,
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: session.user?._id,
        },
      },
      { new: true, runValidators: true }
    ).populate('match');

    await logAction({
      title: `Highlight updated - [${updates.title || existingHighlight.title}]`,
      description: 'Highlight was updated',
      meta: {
        highlightId: highlightId,
        changes: Object.keys(updates),
      },
    });

    return NextResponse.json({
      message: 'Highlight updated successfully',
      success: true,
      data: updatedHighlight,
    });
  } catch (error) {
    LoggerService.error('Failed to update highlight', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to update highlight'),
      success: false,
    }, { status: 500 });
  }
}

// PATCH /api/highlights/[highlightId] - Partial update highlight
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ highlightId: string }> }
) {
  try {
    const highlightId = (await params).highlightId
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

    const updatedHighlight = await HighlightModel.findByIdAndUpdate(
      highlightId,
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: session.user?._id,
        },
      },
      { new: true, runValidators: true }
    ).populate('match');

    if (!updatedHighlight) {
      return NextResponse.json({
        success: false,
        message: 'Highlight not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Highlight updated successfully',
      success: true,
      data: updatedHighlight,
    });
  } catch (error) {
    LoggerService.error('Failed to update highlight', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to update highlight'),
      success: false,
    }, { status: 500 });
  }
}

// DELETE /api/highlights/[highlightId] - Delete highlight
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ highlightId: string }> }
) {
  try {
    const highlightId = (await params).highlightId
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const deletedHighlight = await HighlightModel.findByIdAndDelete(highlightId);

    if (!deletedHighlight) {
      return NextResponse.json({
        success: false,
        message: 'Highlight not found',
      }, { status: 404 });
    }

    await logAction({
      title: `Highlight deleted - [${deletedHighlight.title}]`,
      description: 'Highlight was deleted',
      meta: {
        highlightId: highlightId,
        matchId: deletedHighlight.match,
        title: deletedHighlight.title,
      },
    });

    return NextResponse.json({
      message: 'Highlight deleted successfully',
      success: true,
      data: deletedHighlight,
    });
  } catch (error) {
    LoggerService.error('Failed to delete highlight', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to delete highlight'),
      success: false,
    }, { status: 500 });
  }
}
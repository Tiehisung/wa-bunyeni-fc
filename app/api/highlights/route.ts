// app/api/highlights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import HighlightModel from '@/models/highlight';
import { IPostHighlight } from '@/models/highlight';
import { formatDate } from '@/lib/timeAndDate';
import connectDB from '@/config/db.config';
import { removeEmptyKeys } from '@/lib';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';
import { logAction } from '../logs/helper';
import { getOptimizedThumbnail } from '@/utils/cloudinary.util';

connectDB();

// GET /api/highlights - List all highlights
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const search = searchParams.get('highlight_search') || '';
    const tagsParam = searchParams.get('tags') || '';
    const matchId = searchParams.get('matchId') || '';
    const status = searchParams.get('status') || '';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';

    const tags = tagsParam.split(',').map(t => t.trim()).filter(Boolean);
    const regex = new RegExp(search, 'i');

    const query: Record<string, any> = {};

    if (tags.length > 0) query.tags = { $in: tags };
    if (matchId) query.match = matchId;
    if (status) query.status = status;

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    if (search) {
      query.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    const cleaned = removeEmptyKeys(query);

    const highlights = await HighlightModel.find(cleaned)
      .populate('match', 'homeTeam awayTeam date competition')
      .populate('createdBy', 'name role')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await HighlightModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: highlights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    LoggerService.error('Failed to fetch highlights', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch highlights'),
    }, { status: 500 });
  }
}

// POST /api/highlights - Create new highlight
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { match, ...others } = await request.json() as IPostHighlight;

    if (!match) {
      return NextResponse.json({
        success: false,
        message: 'Match ID is required',
      }, { status: 400 });
    }

    if (!others.title) {
      return NextResponse.json({
        success: false,
        message: 'Highlight title is required',
      }, { status: 400 });
    }

    const savedHighlight = await HighlightModel.create({
      match,
      ...others,
      thumbnail_url: getOptimizedThumbnail(others.public_id as string, {
        resourceType: others.resource_type as 'image' | 'video',
        width: 400,
        height: 225,
        crop: 'fill'
      }),
      createdBy: session.user?._id
    });

    const populatedHighlight = await HighlightModel.findById(savedHighlight._id)
      .populate('match')
      .lean();

    await logAction({
      title: `Match highlight created - [${others.title}]`,
      description: `A match highlight (${others.title}) created on ${formatDate(new Date().toISOString())}.`,
      meta: {
        highlightId: savedHighlight._id,
        matchId: match,
        title: others.title,
      },
    });

    return NextResponse.json({
      message: 'Highlight created successfully',
      success: true,
      data: populatedHighlight,
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create highlight', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to save highlight'),
      success: false,
    }, { status: 500 });
  }
}
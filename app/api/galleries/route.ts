// app/api/galleries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import FileModel from '@/models/file';
import { IGallery } from '@/types/file.interface';
import { removeEmptyKeys } from '@/lib';
import GalleryModel from '@/models/galleries';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';

connectDB();

// GET /api/galleries - List all galleries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('gallery_search') || '';
    const tagsParam = searchParams.get('tags') || '';
    const tags = tagsParam.split(',').map(t => t.trim()).filter(Boolean);

    const skip = (page - 1) * limit;
    const regex = new RegExp(search, 'i');

    const query: Record<string, unknown> = {};

    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (search) {
      query.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    const cleaned = removeEmptyKeys(query);

    const galleries = await GalleryModel.find(cleaned)
      .populate('files')
      .populate('createdBy', 'name role')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await GalleryModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: galleries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    LoggerService.error('Failed to fetch galleries', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch galleries'),
    }, { status: 500 });
  }
}

// POST /api/galleries - Create new gallery
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { files, tags, title, description } = await request.json() as IGallery;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'At least one file is required',
      }, { status: 400 });
    }

    const savedFiles = await FileModel.insertMany(files);
    const fileIds = savedFiles.map(file => file._id);

    const savedGallery = await GalleryModel.create({
      files: fileIds,
      tags: tags || [],
      title: title || 'Untitled Gallery',
      description: description || '',
      timestamp: Date.now(),
      createdBy: session.user?.id
    });

    return NextResponse.json({
      message: 'Gallery created successfully',
      success: true,
      data: { ...savedGallery.toObject(), files: savedFiles },
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create gallery', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to save gallery'),
      success: false,
    }, { status: 500 });
  }
}
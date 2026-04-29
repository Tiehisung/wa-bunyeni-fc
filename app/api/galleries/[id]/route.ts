// app/api/galleries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import FileModel from '@/models/file';
import GalleryModel from '@/models/galleries';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';


connectDB();

// GET /api/galleries/[id] - Get single gallery
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const gallery = await GalleryModel.findById(id)
      .populate('files')
      .populate('createdBy', 'name role')
      .lean();

    if (!gallery) {
      return NextResponse.json({
        success: false,
        message: 'Gallery not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch gallery', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch gallery'),
    }, { status: 500 });
  }
}

// PUT /api/galleries/[id] - Update gallery
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await auth(); 

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { files, tags, title, description } = await request.json();

    const existingGallery = await GalleryModel.findById(id);
    if (!existingGallery) {
      return NextResponse.json({
        success: false,
        message: 'Gallery not found',
      }, { status: 404 });
    }
 

    const updatedGallery = await GalleryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          files: files?.map((f: { _id: string; })=>f?._id),
          tags: tags || existingGallery.tags,
          title: title || existingGallery.title,
          description: description !== undefined ? description : existingGallery.description,
          updatedAt: new Date(),
          updatedBy: session.user?._id,
        },
      },
      { new: true, runValidators: true }
    ).populate('files');

    return NextResponse.json({
      message: 'Gallery updated successfully',
      success: true,
      data: updatedGallery,
    });
  } catch (error) {
    LoggerService.error('Failed to update gallery', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to update gallery'),
      success: false,
    }, { status: 500 });
  }
}

// PATCH /api/galleries/[id] - Partial update gallery
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await auth();

    if (!session) {
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

    delete updates.files;

    const updatedGallery = await GalleryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: session.user?._id,
        },
      },
      { new: true, runValidators: true }
    ).populate('files');

    if (!updatedGallery) {
      return NextResponse.json({
        success: false,
        message: 'Gallery not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Gallery updated successfully',
      success: true,
      data: updatedGallery,
    });
  } catch (error) {
    LoggerService.error('Failed to update gallery', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to update gallery'),
      success: false,
    }, { status: 500 });
  }
}

// DELETE /api/galleries/[id] - Delete gallery
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id =(await params).id
    const session = await auth();

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const gallery = await GalleryModel.findById(id);
    if (!gallery) {
      return NextResponse.json({
        success: false,
        message: 'Gallery not found',
      }, { status: 404 });
    }

    if (gallery.files && gallery.files.length > 0) {
      await FileModel.deleteMany({ _id: { $in: gallery.files } });
    }

    await GalleryModel.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Gallery deleted successfully',
      success: true,
    });
  } catch (error) {
    LoggerService.error('Failed to delete gallery', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to delete gallery'),
      success: false,
    }, { status: 500 });
  }
}
// app/api/galleries/[id]/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';

import FileModel from '@/models/file';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import GalleryModel from '@/models/galleries';

connectDB();

// POST /api/galleries/[id]/files - Add files to gallery
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const session = await auth();

        if (!session) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { files } = await request.json();

        if (!files || !Array.isArray(files) || files.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'At least one file is required',
            }, { status: 400 });
        }

        const savedFiles = await FileModel.insertMany(files);
        const fileIds = savedFiles.map(file => file._id);

        const updatedGallery = await GalleryModel.findByIdAndUpdate(
            id,
            {
                $push: { files: { $each: fileIds } },
                $set: { updatedAt: new Date(), updatedBy: session.user?.id },
            },
            { new: true }
        ).populate('files');

        if (!updatedGallery) {
            return NextResponse.json({
                success: false,
                message: 'Gallery not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Files added to gallery successfully',
            success: true,
            data: updatedGallery,
        });
    } catch (error) {
        LoggerService.error('Failed to add files to gallery', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to add files to gallery'),
            success: false,
        }, { status: 500 });
    }
}
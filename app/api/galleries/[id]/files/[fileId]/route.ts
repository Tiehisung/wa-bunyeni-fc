// app/api/galleries/[id]/files/[fileId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import FileModel from '@/models/file';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import { auth } from '@/auth';
import GalleryModel from '@/models/galleries';

connectDB();

// DELETE /api/galleries/[id]/files/[fileId] - Remove file from gallery
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; fileId: string }> }
) {
    try {
        const id = (await params).id
        const fileId = (await params).fileId

        const session = await auth();

        if (!session) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const updatedGallery = await GalleryModel.findByIdAndUpdate(
            id,
            {
                $pull: { files: fileId },
                $set: { updatedAt: new Date(), updatedBy: session.user?._id },
            },
            { new: true }
        ).populate('files');

        if (!updatedGallery) {
            return NextResponse.json({
                success: false,
                message: 'Gallery not found',
            }, { status: 404 });
        }

        await FileModel.findByIdAndDelete(fileId);

        return NextResponse.json({
            message: 'File removed from gallery successfully',
            success: true,
            data: updatedGallery,
        });
    } catch (error) {
        LoggerService.error('Failed to remove file from gallery', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to remove file from gallery'),
            success: false,
        }, { status: 500 });
    }
}
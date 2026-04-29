// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { LoggerService } from '../../../shared/log.service';
import { cloudinary } from '../../../lib/cloudinary';
import { getApiErrorMessage } from '../../../lib/error-api';


// DELETE /api/upload - Delete file from Cloudinary
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const body = await request.json();
        const { public_id, resource_type } = body;

        if (!public_id) {
            return NextResponse.json({
                success: false,
                message: 'Public ID is required',
            }, { status: 400 });
        }

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: resource_type as string || 'image'
        });

        if (result.result === 'ok') {
            return NextResponse.json({
                success: true,
                message: 'File deleted successfully',
                data: result,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Failed to delete file',
            }, { status: 400 });
        }
    } catch (error) {
        LoggerService.error('Delete failed', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'File deletion failed'),
        }, { status: 500 });
    }
}
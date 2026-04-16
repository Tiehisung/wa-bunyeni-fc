// app/api/upload/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { LoggerService } from '../../../../shared/log.service';
import { cloudinary, formatCloudinaryResponse } from '../../../../lib/cloudinary';
import { getApiErrorMessage } from '../../../../lib/error-api';

// POST /api/upload/image - Upload single image
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({
                success: false,
                message: 'No image uploaded',
            }, { status: 400 });
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'images',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        const result: any = await uploadPromise;
        const formattedFile = formatCloudinaryResponse(result);

        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            data: result,
        });
    } catch (error) {
        LoggerService.error('Image upload failed', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Image upload failed'),
        }, { status: 500 });
    }
}
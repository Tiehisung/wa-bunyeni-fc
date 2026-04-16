// app/api/upload/video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { LoggerService } from '../../../../shared/log.service';
import { cloudinary, formatCloudinaryResponse } from '../../../../lib/cloudinary';
import { getApiErrorMessage } from '../../../../lib/error-api';


// POST /api/upload/video - Upload video
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
        const file = formData.get('video') as File;

        if (!file) {
            return NextResponse.json({
                success: false,
                message: 'No video uploaded',
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'bunyeni-fc/videos',
                    resource_type: 'video',
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
            message: 'Video uploaded successfully',
            data: formattedFile,
        });
    } catch (error) {
        LoggerService.error('Video upload failed', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Video upload failed'),
        }, { status: 500 });
    }
}
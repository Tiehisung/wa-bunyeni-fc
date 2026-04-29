// app/api/upload/mixed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cloudinary, formatCloudinaryResponse } from '../../../../lib/cloudinary';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';


// POST /api/upload/mixed - Upload mixed file types
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
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No files uploaded',
            }, { status: 400 });
        }

        const uploadPromises = files.map(async (file) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Determine resource type based on file MIME type
            let resourceType: 'image' | 'video' | 'raw' = 'raw';
            let folder = 'bunyeni-fc/mixed';

            if (file.type.startsWith('image/')) {
                resourceType = 'image';
                folder = 'bunyeni-fc/images';
            } else if (file.type.startsWith('video/')) {
                resourceType = 'video';
                folder = 'bunyeni-fc/videos';
            }

            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: resourceType,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
        });

        const results = await Promise.all(uploadPromises);
        const formattedFiles = results.map((result: any) => formatCloudinaryResponse(result));

        return NextResponse.json({
            success: true,
            data: formattedFiles,
        });
    } catch (error) {
        LoggerService.error('Mixed upload failed', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Upload failed'),
        }, { status: 500 });
    }
}
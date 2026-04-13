// app/api/upload/gallery/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { LoggerService } from '../../../../shared/log.service';
import { cloudinary, formatCloudinaryResponse } from '../../../../lib/cloudinary';
import { getApiErrorMessage } from '../../../../lib/error-api';


// POST /api/upload/gallery - Upload multiple images
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
                message: 'No images uploaded',
            }, { status: 400 });
        }

        const uploadPromises = files.map(async (file) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'bunyeni-fc/gallery',
                        resource_type: 'image',
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
            message: `${formattedFiles.length} images uploaded successfully`,
            data: formattedFiles,
        });
    } catch (error) {
        LoggerService.error('Gallery upload failed', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Gallery upload failed'),
        }, { status: 500 });
    }
}
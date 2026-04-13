// app/api/upload/document/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { LoggerService } from '../../../../shared/log.service';
import { cloudinary } from '../../../../lib/cloudinary';
import { getApiErrorMessage } from '../../../../lib/error-api';


// POST /api/upload/document - Upload document (PDF, etc)
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
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({
                success: false,
                message: 'No document uploaded',
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'bunyeni-fc/documents',
                    resource_type: 'raw',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        const result: any = await uploadPromise;


        return NextResponse.json({
            success: true,
            message: 'Document uploaded successfully',
            data: result,
        });
    } catch (error) {
        LoggerService.error('Document upload failed', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Document upload failed'),
        }, { status: 500 });
    }
}
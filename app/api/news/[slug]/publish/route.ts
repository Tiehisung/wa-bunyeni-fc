// app/api/news/[newsId]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import NewsModel from '@/models/news';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
 
import { LoggerService } from '@/shared/log.service';

connectDB();


// PATCH /api/news/[newsId]/publish - Toggle publish status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ newsId: string }> }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { newsId } = await params;
        const { isPublished } = await request.json();

        const updated = await NewsModel.findByIdAndUpdate(
            newsId,
            {
                $set: {
                    isPublished,
                    publishedAt: isPublished ? new Date() : null,
                    updatedAt: new Date(),
                    updatedBy: session.user?.id,
                },
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'News not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `News ${isPublished ? 'published' : 'unpublished'} successfully`,
            data: updated,
        });
    } catch (error) {
        LoggerService.error('Failed to update publish status', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update publish status'),
        }, { status: 500 });
    }
}
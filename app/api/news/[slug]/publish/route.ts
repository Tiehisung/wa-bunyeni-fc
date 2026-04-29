import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import NewsModel from '@/models/news';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import { slugIdFilters } from '@/lib/slug';
import { authorizeOrResponse } from '@/app/api/auth/authorization';
import { EUserRole } from '@/types/user';
 
connectDB();
 
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();

        authorizeOrResponse(session?.user?.role, EUserRole.ADMIN);

        const { slug } = await params;
         const filter = slugIdFilters(slug);
        const { isPublished } = await request.json();

        const updated = await NewsModel.findOneAndUpdate(
            filter,
            {
                $set: {
                    isPublished,
                    publishedAt: isPublished ? new Date() : null,
                },
            },
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
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update publish status'),
        }, { status: 500 });
    }
}
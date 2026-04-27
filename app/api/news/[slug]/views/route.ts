// app/api/news/[slug]/views/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';

import NewsModel from '@/models/news';

import { slugIdFilters } from '@/lib/slug';
import { updateFanPoints } from '@/lib/fan';
import { auth } from '@/auth';
import { getOrCreateVisitorId } from '@/lib/visitor';

connectDB();

// PATCH /api/news/[slug]/views - Update news views
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        const { slug } = await params;
        const filter = slugIdFilters(slug);

      
        const visitorId = await getOrCreateVisitorId();

        const news = await NewsModel.findOne(filter);
        if (!news) {
            return NextResponse.json({
                success: false,
                message: 'News not found',
            }, { status: 404 });
        }

        const alreadyViewed = news.views?.some(
            (view: { visitorId: string; user: any }) => view.visitorId === visitorId || view.user?._id === session?.user?._id
        );

        if (!alreadyViewed) {
            const newView = {
                user: session?.user,
                visitorId: visitorId,
            };

            news.views = [...(news.views || []), newView];
            await news.save();

            if (session?.user) {
                await updateFanPoints(session?.user?._id as string, 'newsView');
            }

            return NextResponse.json({
                success: true,
                message: 'View recorded',
                data: { views: news.views.length }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Already viewed',
            data: { views: news.views.length }
        });
    } catch (error) {
        LoggerService.error('Failed to update views', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update views'),
        }, { status: 500 });
    }
}
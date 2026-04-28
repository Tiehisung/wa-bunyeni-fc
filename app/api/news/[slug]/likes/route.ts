// app/api/news/[slug]/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import NewsModel from '@/models/news';
import { updateFanPoints } from '@/lib/fan';
import { slugIdFilters } from '@/lib/slug';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import { getOrCreateVisitorId } from '@/lib/visitor';

connectDB();

// PATCH /api/news/[slug]/likes - Update news likes
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        const user = session?.user
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

        const existingLike = news.likes?.find(
            (like: { visitorId: string; user: any }) => like.visitorId === visitorId || (like.user?._id === user?._id)
        );

        if (existingLike) {
            await NewsModel.findOneAndUpdate(
                filter,
                {
                    $pull: { likes: {_id: existingLike._id} },
                    $inc: { 'stats.likeCount': -1 },
                    $set: { 'stats.lastTrendingUpdate': new Date() }
                }
            );

            if (session?.user) {
                await updateFanPoints(session?.user?._id as string, 'reaction');
            }

            return NextResponse.json({
                success: true,
                message: 'Unliked successfully',
                data: { liked: false, likes: news.likes.length }
            });

        } else {
            const newLike = {
                user: session?.user,
                visitorId: visitorId,
            };
            await NewsModel.findOneAndUpdate(
                filter,
                {
                    $push: { likes: newLike },
                    $inc: { 'stats.likeCount': 1 },
                    $set: { 'stats.lastTrendingUpdate': new Date() }
                }
            );

            if (session?.user) {
                await updateFanPoints(session?.user?._id as string, 'reaction');
            }

            return NextResponse.json({
                success: true,
                message: 'Liked successfully',
                data: { liked: false, likes: news.likes.length }
            });
        }
    } catch (error) {
        LoggerService.error('Failed to update like', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update like'),
        }, { status: 500 });
    }
}
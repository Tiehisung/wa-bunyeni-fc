import { NextRequest, NextResponse } from 'next/server';
import NewsModel from '@/models/news';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import { slugIdFilters } from '@/lib/slug';
import { auth } from '@/auth';
import { getOrCreateVisitorId } from '@/lib/visitor';
import { updateFanPoints } from '@/app/api/fans/helpers';

connectDB();

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

        const newShare = {
            user: session?.user,
            visitorId: visitorId,
        };

        await NewsModel.findOneAndUpdate(
            filter,
            {
                $push: { shares: newShare },
                $inc: { 'stats.shareCount': 1 },
                $set: { 'stats.lastTrendingUpdate': new Date() }
            }
        );

        if (session?.user) {
            await updateFanPoints(session?.user as IMiniUser, 'share');
        }

        return NextResponse.json({
            success: true,
            message: 'Share recorded',
            data: { shares: news.shares.length }
        });
    } catch (error) {
        LoggerService.error('Failed to record share', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to record share'),
        }, { status: 500 });
    }
}
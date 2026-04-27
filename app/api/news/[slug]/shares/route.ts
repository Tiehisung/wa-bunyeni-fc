import { NextRequest, NextResponse } from 'next/server';
import NewsModel from '@/models/news';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import { updateFanPoints } from '@/lib/fan';
import { slugIdFilters } from '@/lib/slug';
import { auth } from '@/auth';
import { getOrCreateVisitorId } from '@/lib/visitor';

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

        news.shares = [...(news.shares || []), newShare];
        await news.save();

        if (session?.user) {
            await updateFanPoints(session?.user?._id as string, 'share');
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
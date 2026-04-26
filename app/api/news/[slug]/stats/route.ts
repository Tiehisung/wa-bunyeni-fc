
import connectDB from '@/config/db.config';
import { NextRequest, NextResponse } from 'next/server';
import { slugIdFilters } from "@/lib/slug";
import NewsModel from '@/models/news';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
connectDB();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const filter = slugIdFilters(slug);

        const news = await NewsModel.findOne(filter)
            .select("views comments shares likes")

        return NextResponse.json({
            success: true,
            data: {
                views: news.views?.length || 0,
                comments: news.comments?.map((c: { _id: any; comment: any; date: any; user: any; name: any; }) => ({
                    _id: c._id,
                    comment: c.comment,
                    date: c.date,
                    user: c.user,
                    name: c.name
                })) || [],
                shares: news.shares?.length || 0,
                likes: news.likes?.length || 0,
            }
        });
    } catch (error) {
        LoggerService.error('Failed to fetch news statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch news statistics'),
        }, { status: 500 });
    }
}
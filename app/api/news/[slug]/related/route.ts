// app/api/news/[slug]/related/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import { slugIdFilters } from '@/lib/slug';
import NewsModel from '@/models/news';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const filter = slugIdFilters(slug);
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '5');

        await connectDB();

        // Get the current news item
        const currentNews = await NewsModel.findOne(filter).lean();

        if (!currentNews) {
            return NextResponse.json(
                { success: false, message: 'News not found' },
                { status: 404 }
            );
        }

        // Extract tags from current news (if any)
        const tags = currentNews.tags || [];
        const category = currentNews.category;
        const currentId = currentNews._id;

        // Build query for related news
        const query: any = {
            _id: { $ne: currentId }, // Exclude current news
            isPublished: true,
        };

        // Prioritize by tags, then category, then latest
        if (tags.length > 0) {
            query.tags = { $in: tags };
        } else if (category) {
            query.category = category;
        }

        // Find related news
        let relatedNews = await NewsModel.find(query)
            .sort({
                'stats.trendingScore': -1,  // First by trending score
                createdAt: -1               // Then by date
            })
            .limit(limit)
            .select('headline slug stats.trendingScore stats.viewCount createdAt')
            .lean();

        // If not enough related news by tags/category, fill with latest news
        if (relatedNews.length < limit) {
            const remainingCount = limit - relatedNews.length;
            const existingIds = relatedNews.map((n: { _id: any; }) => n._id);
            existingIds.push(currentId);

            const fallbackNews = await NewsModel.find({
                _id: { $nin: existingIds },
                isPublished: true,
            })
                .sort({ createdAt: -1 })
                .limit(remainingCount)
                .select('headline slug stats.trendingScore stats.viewCount createdAt')
                .lean();

            relatedNews = [...relatedNews, ...fallbackNews];
        }

        return NextResponse.json({
            success: true,
            data: relatedNews,
            count: relatedNews.length,
        });
    } catch (error:any) {
        return NextResponse.json(
            { success: false, message: getApiErrorMessage(error) },
            { status: 500 }
        );
    }
}
// app/api/news/[slug]/views/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';

import NewsModel from '@/models/news';

import mongoose from 'mongoose';
import { slugIdFilters } from '@/lib/slug';
import { updateFanPoints } from '@/lib/fan';

connectDB();

// PATCH /api/news/[slug]/views - Update news views
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const filter = slugIdFilters(slug);
        const { deviceId, userId } = await request.json();

        const news = await NewsModel.findOne(filter);
        if (!news) {
            return NextResponse.json({
                success: false,
                message: 'News not found',
            }, { status: 404 });
        }

        const alreadyViewed = news.views?.some(
            (view: { device: string; user: string }) => view.device === deviceId && view.user === userId
        );

        if (!alreadyViewed) {
            const newView = {
                user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
                date: new Date().toISOString(),
                device: deviceId,
            };

            news.views = [...(news.views || []), newView];
            await news.save();

            if (userId) {
                await updateFanPoints(userId, 'newsView');
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
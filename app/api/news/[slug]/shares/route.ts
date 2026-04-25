// app/api/news/[slug]/shares/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import NewsModel from '@/models/news';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import { updateFanPoints } from '@/lib/fan';
import { slugIdFilters } from '@/lib/slug';

connectDB();

 

// PATCH /api/news/[slug]/shares - Update news shares
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const filter = slugIdFilters(slug);
        const { userId, deviceId } = await request.json();

        const news = await NewsModel.findOne(filter);
        if (!news) {
            return NextResponse.json({
                success: false,
                message: 'News not found',
            }, { status: 404 });
        }

        const newShare = {
            user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
            date: new Date().toISOString(),
            device: deviceId,
        };

        news.shares = [...(news.shares || []), newShare];
        await news.save();

        if (userId) {
            await updateFanPoints(userId, 'share');
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
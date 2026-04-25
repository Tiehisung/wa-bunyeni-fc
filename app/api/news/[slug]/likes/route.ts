// app/api/news/[slug]/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import NewsModel from '@/models/news';
import mongoose from 'mongoose';
import { updateFanPoints } from '@/lib/fan';
import { slugIdFilters } from '@/lib/slug';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';

connectDB();

// PATCH /api/news/[slug]/likes - Update news likes
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const filter = slugIdFilters(slug);
        const { userId, name, deviceId, isLike } = await request.json();

        const news = await NewsModel.findOne(filter);
        if (!news) {
            return NextResponse.json({
                success: false,
                message: 'News not found',
            }, { status: 404 });
        }

        const existingLikeIndex = news.likes?.findIndex(
            (like: { device: string; user: string }) => like.device === deviceId && (userId && like.user === userId)
        );

        if (isLike) {
            if (existingLikeIndex === -1) {
                const newLike = {
                    user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
                    name: name,
                    date: new Date().toISOString(),
                    device: deviceId,
                };

                news.likes = [...(news.likes || []), newLike];
                await news.save();

                if (userId) {
                    await updateFanPoints(userId, 'reaction');
                }

                return NextResponse.json({
                    success: true,
                    message: 'Liked successfully',
                    data: { liked: true, likes: news.likes.length }
                });
            } else {
                return NextResponse.json({
                    success: true,
                    message: 'Already liked',
                    data: { liked: true, likes: news.likes.length }
                });
            }
        } else {
            if (existingLikeIndex !== -1 && existingLikeIndex !== undefined) {
                news.likes.splice(existingLikeIndex, 1);
                await news.save();
            }

            return NextResponse.json({
                success: true,
                message: 'Unliked successfully',
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
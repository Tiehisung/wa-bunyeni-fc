// app/api/news/[slug]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import NewsModel from '@/models/news';
import { slugIdFilters } from '@/lib/slug';
import { updateFanPoints } from '@/lib/fan';
 

connectDB();
 

// PATCH /api/news/[slug]/comments - Add comment
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        const { slug } = await params;
        const filter = slugIdFilters(slug);
        const { comment } = await request.json();

        if (!comment || !comment.trim()) {
            return NextResponse.json({
                success: false,
                message: 'Comment cannot be empty',
            }, { status: 400 });
        }

        const news = await NewsModel.findOne(filter);
        if (!news) {
            return NextResponse.json({
                success: false,
                message: 'News not found',
            }, { status: 404 });
        }

        const newComment = {
            user: session?.user?.id,
            date: new Date().toISOString(),
            comment: comment.trim(),
            name: session?.user?.name,
        };

        await NewsModel.findByIdAndUpdate(news._id, {
            $set: { comments: [newComment, ...(news.comments || [])] }
        });

        if (session?.user?.id) {
            await updateFanPoints(session.user.id, 'comment');
        }

        const populatedNews = await NewsModel.findById(news._id)
            .populate('comments.user', 'name image')
            .lean();

        const addedComment = populatedNews?.comments?.[0];

        return NextResponse.json({
            success: true,
            message: 'Comment added successfully',
            data: {
                comment: addedComment,
                totalComments: news.comments.length
            }
        });
    } catch (error) {
        LoggerService.error('Failed to add comment', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to add comment'),
        }, { status: 500 });
    }
}

// DELETE /api/news/[slug]/comments - Delete comment
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        const { slug } = await params;
        const filter = slugIdFilters(slug);
        const { commentId } = await request.json();

        const news = await NewsModel.findOne(filter);
        if (!news) {
            return NextResponse.json({
                success: false,
                message: 'News not found',
            }, { status: 404 });
        }

        const comment = news.comments.find((c: { _id: string }) => c._id == commentId);
        const isAdmin = session?.user?.role?.includes('admin');

        if (!isAdmin && comment?.user?.toString() !== session?.user?.id) {
            return NextResponse.json({
                success: false,
                message: 'Not authorized to delete this comment',
            }, { status: 403 });
        }

        const commentIndex = news.comments.findIndex((c: { _id: string }) => c._id == commentId);
        news.comments.splice(commentIndex, 1);
        await news.save();

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully',
            data: { totalComments: news.comments.length }
        });
    } catch (error) {
        LoggerService.error('Failed to delete comment', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to delete comment'),
        }, { status: 500 });
    }
}
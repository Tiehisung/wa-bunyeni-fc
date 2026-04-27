
import { NextRequest, NextResponse } from 'next/server';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import NewsModel from '@/models/news';
import { slugIdFilters } from '@/lib/slug';
import { updateFanPoints } from '@/lib/fan';
import { getOrCreateVisitorId } from '@/lib/visitor';

connectDB();

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        const { slug } = await params;
        const filter = slugIdFilters(slug);
        const { comment } = await request.json();

        const visitorId = await getOrCreateVisitorId();

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
            user: session?.user,
            comment: comment.trim(),
            visitorId: visitorId,
        };

        await NewsModel.findByIdAndUpdate(news._id, {
            $set: { comments: [newComment, ...(news.comments || [])] }
        });

        if (session?.user?._id) {
            await updateFanPoints(session?.user?._id as string, 'comment');
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
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth();
        const { slug } = await params;
        const { commentId, comment } = await request.json();

        if (!comment?.trim()) {
            return NextResponse.json({
                success: false,
                message: "Comment is required",
            }, { status: 400 });
        }

        const filter = slugIdFilters(slug);

        const news = await NewsModel.findOne(filter);
        if (!news) {
            return NextResponse.json({
                success: false,
                message: "News not found",
            }, { status: 404 });
        }

        const foundComment = news.comments.find(
            (c: any) => c._id.toString() === commentId
        );

        if (!foundComment) {
            return NextResponse.json({
                success: false,
                message: "Comment not found",
            }, { status: 404 });
        }

        const isAdmin = session?.user?.role?.includes("admin");

        if (!isAdmin && foundComment.user?._id?.toString() !== session?.user?._id) {
            return NextResponse.json({
                success: false,
                message: "Not authorized",
            }, { status: 403 });
        }

        // 🔥 Atomic update
        const updated = await NewsModel.findOneAndUpdate(
            {
                ...filter,
                "comments._id": commentId,
            },
            {
                $set: {
                    "comments.$.comment": comment,
                    "comments.$.updatedAt": new Date(),
                },
            },
       
        );

        return NextResponse.json({
            success: true,
            message: "Comment updated successfully",
            data: updated,
        });

    } catch (error) {
        LoggerService.error("Failed to edit comment", error);

        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, "Failed to edit comment"),
        }, { status: 500 });
    }
}
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

        const comment = news.comments.find((c: { _id: string }) => c._id.toString() == commentId);
        
        if (!comment) {
            return NextResponse.json({
                success: false,
                message: "Comment not found",
            }, { status: 404 });
        }

        const isAdmin = session?.user?.role?.includes('admin');

        if (!isAdmin && comment?.user?._id?.toString() !== session?.user?._id) {
            return NextResponse.json({
                success: false,
                message: 'Not authorized to delete this comment',
            }, { status: 403 });
        }
 
        const updated =await NewsModel.findOneAndUpdate(filter, 
            {
                $pull: {
                    comments: { _id: commentId }
                }
            }
        )

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully',
            data: { totalComments: updated.comments.length ,}
        });
    } catch (error) {
        LoggerService.error('Failed to delete comment', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to delete comment'),
        }, { status: 500 });
    }
}
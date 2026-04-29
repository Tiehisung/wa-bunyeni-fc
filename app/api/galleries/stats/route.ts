// app/api/galleries/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import GalleryModel from '@/models/galleries';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';


connectDB();

// GET /api/galleries/stats - Get gallery statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await GalleryModel.aggregate([
            {
                $lookup: {
                    from: 'files',
                    localField: 'files',
                    foreignField: '_id',
                    as: 'fileDetails',
                },
            },
            {
                $addFields: {
                    fileCount: { $size: '$files' },
                    totalSize: { $sum: '$fileDetails.size' },
                },
            },
            {
                $group: {
                    _id: null,
                    totalGalleries: { $sum: 1 },
                    totalFiles: { $sum: '$fileCount' },
                    totalSize: { $sum: '$totalSize' },
                    avgFilesPerGallery: { $avg: '$fileCount' },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalGalleries: 1,
                    totalFiles: 1,
                    totalSize: 1,
                    avgFilesPerGallery: { $round: ['$avgFilesPerGallery', 2] },
                },
            },
        ]);

        const tagStats = await GalleryModel.aggregate([
            { $unwind: '$tags' },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 20 },
            {
                $project: {
                    tag: '$_id',
                    count: 1,
                    _id: 0,
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                summary: stats[0] || { totalGalleries: 0, totalFiles: 0, totalSize: 0, avgFilesPerGallery: 0 },
                topTags: tagStats,
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch gallery statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch gallery statistics'),
        }, { status: 500 });
    }
}
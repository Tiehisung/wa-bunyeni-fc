// app/api/highlights/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import HighlightModel from '@/models/highlight';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';
import connectDB from '@/config/db.config';

connectDB();

// GET /api/highlights/stats - Get highlight statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await HighlightModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalHighlights: { $sum: 1 },
                    avgViews: { $avg: '$views' },
                    totalViews: { $sum: '$views' },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalHighlights: 1,
                    avgViews: { $round: ['$avgViews', 0] },
                    totalViews: 1,
                },
            },
        ]);

        const tagStats = await HighlightModel.aggregate([
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

        const matchStats = await HighlightModel.aggregate([
            {
                $group: {
                    _id: '$match',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'matches',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'matchDetails',
                },
            },
            {
                $project: {
                    matchId: '$_id',
                    count: 1,
                    matchDetails: { $arrayElemAt: ['$matchDetails', 0] },
                    _id: 0,
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                summary: stats[0] || { totalHighlights: 0, avgViews: 0, totalViews: 0 },
                topTags: tagStats,
                topMatches: matchStats,
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch highlight statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch highlight statistics'),
        }, { status: 500 });
    }
}
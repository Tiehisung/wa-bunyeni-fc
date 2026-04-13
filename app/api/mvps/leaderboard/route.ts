// app/api/mvps/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import MvPModel from '@/models/mpv';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';


connectDB();

// GET /api/mvps/leaderboard - Get MVP leaderboard
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '20');
        const season = searchParams.get('season') || '';

        const matchFilter: any = {};
        if (season) {
            matchFilter.season = season;
        }

        const leaderboard = await MvPModel.aggregate([
            {
                $lookup: {
                    from: 'matches',
                    localField: 'match',
                    foreignField: '_id',
                    as: 'matchDetails',
                },
            },
            {
                $match: season ? { 'matchDetails.season': season } : {},
            },
            {
                $group: {
                    _id: '$player',
                    count: { $sum: 1 },
                    recentAwards: { $push: { match: '$match', date: '$createdAt' } },
                },
            },
            { $sort: { count: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'players',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'playerDetails',
                },
            },
            {
                $project: {
                    playerId: '$_id',
                    awardCount: '$count',
                    playerName: { $arrayElemAt: ['$playerDetails.name', 0] },
                    playerNumber: { $arrayElemAt: ['$playerDetails.number', 0] },
                    playerPosition: { $arrayElemAt: ['$playerDetails.position', 0] },
                    playerAvatar: { $arrayElemAt: ['$playerDetails.avatar', 0] },
                    recentAwards: { $slice: ['$recentAwards', 5] },
                    _id: 0,
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: leaderboard,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch MVP leaderboard', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch MVP leaderboard'),
        }, { status: 500 });
    }
}
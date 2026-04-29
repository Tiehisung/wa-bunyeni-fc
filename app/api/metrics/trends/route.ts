// app/api/metrics/trends/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import MatchModel from '@/models/match';
import { IMatch } from '@/types/match.interface';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/metrics/trends - Get metric trends
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const months = parseInt(searchParams.get('months') || '6');
        const numMonths = months;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - numMonths);

        const matches = await MatchModel.find({
            status: 'FT',
            date: { $gte: startDate }
        })
            .populate('goals')
            .sort({ date: 1 }) as IMatch[];

        const monthlyTrends = matches.reduce((acc: any, match) => {
            const date = new Date(match.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!acc[monthYear]) {
                acc[monthYear] = {
                    month: monthYear,
                    matches: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsScored: 0,
                    goalsConceded: 0
                };
            }

            acc[monthYear].matches++;
            if (match.computed?.result === 'win') acc[monthYear].wins++;
            if (match.computed?.result === 'draw') acc[monthYear].draws++;
            if (match.computed?.result === 'loss') acc[monthYear].losses++;
            acc[monthYear].goalsScored += match.computed?.teamScore || 0;
            acc[monthYear].goalsConceded += match.computed?.opponentScore || 0;

            return acc;
        }, {});

        return NextResponse.json({
            success: true,
            data: {
                trends: Object.values(monthlyTrends),
                period: `${numMonths} months`,
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch metric trends', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch metric trends'),
        }, { status: 500 });
    }
}
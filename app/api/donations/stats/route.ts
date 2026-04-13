// app/api/donations/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import DonationModel from '@/models/donation';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/donations/stats - Get donation statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await DonationModel.aggregate([
            {
                $facet: {
                    totalDonations: [{ $count: 'count' }],
                    totalValue: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$value' },
                            },
                        },
                    ],
                    byCategory: [
                        {
                            $group: {
                                _id: '$category',
                                count: { $sum: 1 },
                                totalValue: { $sum: '$value' },
                            },
                        },
                    ],
                    byMonth: [
                        {
                            $group: {
                                _id: {
                                    year: { $year: '$date' },
                                    month: { $month: '$date' },
                                },
                                count: { $sum: 1 },
                                totalValue: { $sum: '$value' },
                            },
                        },
                        { $sort: { '_id.year': -1, '_id.month': -1 } },
                        { $limit: 12 },
                    ],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalDonations: stats[0]?.totalDonations[0]?.count || 0,
                totalValue: stats[0]?.totalValue[0]?.total || 0,
                byCategory: stats[0]?.byCategory || [],
                byMonth: stats[0]?.byMonth || [],
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch donation statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch donation statistics'),
        }, { status: 500 });
    }
}
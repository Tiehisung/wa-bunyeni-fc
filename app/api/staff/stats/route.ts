// app/api/staff/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import StaffModel from '@/models/staff';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/staff/stats - Get staff statistics
export async function GET(request: NextRequest) {
    try {
        const stats = await StaffModel.aggregate([
            {
                $facet: {
                    totalStaff: [{ $count: 'count' }],
                    byRole: [
                        {
                            $group: {
                                _id: '$role',
                                count: { $sum: 1 },
                                active: {
                                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                                },
                            },
                        },
                        { $sort: { count: -1 } },
                    ],
                    byDepartment: [
                        {
                            $group: {
                                _id: '$department',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { count: -1 } },
                    ],
                    byContractType: [
                        {
                            $group: {
                                _id: '$contractType',
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    activeStats: [
                        {
                            $group: {
                                _id: null,
                                active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
                                inactive: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
                            },
                        },
                    ],
                    recentHires: [
                        { $match: { isActive: true } },
                        { $sort: { startDate: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                fullname: 1,
                                role: 1,
                                startDate: 1,
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalStaff: stats[0]?.totalStaff[0]?.count || 0,
                byRole: stats[0]?.byRole || [],
                byDepartment: stats[0]?.byDepartment || [],
                byContractType: stats[0]?.byContractType || [],
                activeStats: stats[0]?.activeStats[0] || { active: 0, inactive: 0 },
                recentHires: stats[0]?.recentHires || [],
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch staff statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch staff statistics'),
        }, { status: 500 });
    }
}
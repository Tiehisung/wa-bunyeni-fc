// app/api/sponsors/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
 
import { auth } from '@/auth';
import SponsorModel from '@/models/sponsor';
 
import { formatDate } from '@/lib/timeAndDate';
import connectDB from '@/config/db.config';
import { removeEmptyKeys } from '@/lib';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';

connectDB();

// GET /api/sponsors - List all sponsors
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const search = searchParams.get('sponsor_search') || '';
        const tier = searchParams.get('tier') || '';
        const category = searchParams.get('category') || '';
        const isActive = searchParams.get('isActive') === 'true';

        const regex = new RegExp(search, 'i');
        const query: any = {};

        if (search) {
            query.$or = [
                { name: regex },
                { businessName: regex },
                { businessDescription: regex },
                { community: regex },
                { category: regex },
                { tier: regex },
            ];
        }

        if (tier) query.tier = tier;
        if (category) query.category = category;
        if (searchParams.has('isActive')) query.isActive = isActive;

        const cleaned = removeEmptyKeys(query);

        const sponsors = await SponsorModel.find(cleaned)
            .populate({ path: 'donations', populate: { path: 'files' } })
            .populate('logo')
            .populate('badges')
            .populate('createdBy', 'name role')
            .limit(limit)
            .skip(skip)
            .lean()
            .sort({ updatedAt: 'desc' });

        const total = await SponsorModel.countDocuments(cleaned);

        return NextResponse.json({
            success: true,
            data: sponsors,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch sponsors', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch sponsors'),
        }, { status: 500 });
    }
}

// POST /api/sponsors - Create new sponsor
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        // Optional: Uncomment for auth check
        // if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
        //     return NextResponse.json({
        //         success: false,
        //         message: 'Unauthorized',
        //     }, { status: 401 });
        // }

        const sponsorData = await request.json();

        const existingSponsor = await SponsorModel.findOne({
            businessName: sponsorData.businessName
        });

        if (existingSponsor) {
            return NextResponse.json({
                success: false,
                message: 'Sponsor with this business name already exists',
            }, { status: 409 });
        }

        const created = await SponsorModel.create({
            ...sponsorData,
            badge: 0,
            totalDonations: 0,
            createdBy: session?.user?.id
        });

        if (!created) {
            return NextResponse.json({
                success: false,
                message: 'Failed to create sponsor',
            }, { status: 500 });
        }

        LoggerService.info('🤝 Sponsor Created', `New sponsor ${created.name || created.businessName} added`, request);

        return NextResponse.json({
            message: 'Sponsor created successfully',
            success: true,
            data: created,
        }, { status: 201 });
    } catch (error) {
        LoggerService.error('Failed to create sponsor', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to create sponsor'),
            success: false,
        }, { status: 500 });
    }
}
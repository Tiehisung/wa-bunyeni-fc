// app/api/sponsors/[id]/donations/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import DonationModel from '@/models/donation';
import SponsorModel from '@/models/sponsor';
import connectDB from '@/config/db.config';
import { removeEmptyKeys } from '@/lib';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';

connectDB();

// ✅ CORRECT
export async function GET(
    request: NextRequest,

) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }


        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const search = searchParams.get('donation_search') || '';
        const regex = new RegExp(search, 'i');

        const query: any = {};

        if (search) {
            query.$or = [
                { item: regex },
                { description: regex },
                { date: regex },
            ];
        }

        const cleaned = removeEmptyKeys(query);

        const donations = await DonationModel.find(cleaned)
            .populate({ path: 'sponsor' })
            .populate('createdBy', 'name role avatar')
            .limit(limit)
            .skip(skip)
            .lean()
            .sort({ createdAt: 'desc' });

        const total = await DonationModel.countDocuments(cleaned);

        return NextResponse.json({
            success: true,
            data: donations,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {

        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch sponsor donations'),
        }, { status: 500 });
    }
}

// ✅ CORRECT - POST with params Promise
export async function POST(
    request: NextRequest,
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { item, description, files, date, value, category, sponsorId } = await request.json();

        if (!item) {
            return NextResponse.json({
                success: false,
                message: 'Item is required',
            }, { status: 400 });
        }

        const donated = await DonationModel.create({
            item,
            description,
            files,
            date: date || new Date(),
            sponsor: sponsorId,
            value,
            category: category || 'general',
            createdBy: session.user?._id
        });

        await SponsorModel.findByIdAndUpdate(sponsorId, {
            $push: { donations: donated._id },
            $inc: {
                badge: 1,
                totalDonations: 1,
                totalValue: value || 0,
            }
        });

        const populatedDonation = await DonationModel.findById(donated._id)
            .populate('sponsor')
            .lean();

        return NextResponse.json({
            message: 'Donation recorded successfully',
            success: true,
            data: populatedDonation,
        }, { status: 201 });
    } catch (error) {
        LoggerService.error('Failed to create donation', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to create donation'),
            success: false,
        }, { status: 500 });
    }
}
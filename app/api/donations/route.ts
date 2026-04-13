// app/api/donations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import DonationModel from '@/models/donation';
import SponsorModel from '@/models/sponsor';
import { removeEmptyKeys } from '@/lib';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';
import { createGallery } from '../highlights/helper';

connectDB();

// GET /api/donations - List all donations
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const search = searchParams.get('donation_search') || '';
        const sponsorId = searchParams.get('sponsorId') || '';
        const fromDate = searchParams.get('fromDate') || '';
        const toDate = searchParams.get('toDate') || '';

        const regex = new RegExp(search, 'i');
        const query: any = {};

        if (search) {
            query.$or = [
                { item: regex },
                { description: regex },
                { date: regex },
                { category: regex },
            ];
        }

        if (sponsorId) {
            query.sponsor = sponsorId;
        }

        if (fromDate || toDate) {
            query.date = {};
            if (fromDate) query.date.$gte = new Date(fromDate);
            if (toDate) query.date.$lte = new Date(toDate);
        }

        const cleaned = removeEmptyKeys(query);

        const donations = await DonationModel.find(cleaned)
            .populate({ path: 'sponsor', select: 'name businessName logo' })
            .populate('files')
            .populate('createdBy', 'name role')
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
        LoggerService.error('Failed to fetch donations', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch donations'),
        }, { status: 500 });
    }
}

// POST /api/donations - Create new donation
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { sponsorId, item, description, files, date, value, category } = await request.json();

        if (!sponsorId || !item) {
            return NextResponse.json({
                success: false,
                message: 'Sponsor ID and item are required',
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
            createdBy: session.user?.id
        });

        // Update sponsor
        await SponsorModel.findByIdAndUpdate(sponsorId, {
            $push: { donations: donated._id },
            $inc: {
                badge: 1,
                totalDonations: 1,
                totalValue: value || 0,
            }
        });

        // Create gallery if files exist
        if (files?.length > 0) {
            const sponsor = await SponsorModel.findById(sponsorId);
            await createGallery({
                title: item,
                description: description || `Donation from ${sponsor?.name || sponsor?.businessName}`,
                files,
                tags: [sponsor?.name, sponsor?.businessName, category].filter(Boolean),
            });
        }

        const populatedDonation = await DonationModel.findById(donated._id)
            .populate('sponsor')
            .populate('files')
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
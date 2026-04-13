// app/api/captains/route.ts
import { auth } from '@/auth';
import { removeEmptyKeys } from '@/lib';
import connectDB from '@/config/db.config';

import CaptaincyModel from '@/models/captain';
import PlayerModel from '@/models/player';
import { NextRequest, NextResponse } from 'next/server';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';

connectDB();
// GET /api/captains - List all captains
export async function GET(request: NextRequest) {
  try {


    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const search = searchParams.get('captain_search') || '';
    const isActive = searchParams.get('isActive') === 'true';
    const role = searchParams.get('role') || '';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';

    const regex = new RegExp(search, 'i');

    const query: any = {};

    if (search) {
      query.$or = [
        { 'player.firstName': regex },
        { 'player.lastName': regex },
        { 'player.name': regex },
        { role: regex },
      ];
    }

    if (searchParams.has('isActive')) {
      query.isActive = isActive;
    }

    if (role) {
      query.role = role;
    }

    if (fromDate || toDate) {
      query.startDate = {};
      if (fromDate) query.startDate.$gte = new Date(fromDate);
      if (toDate) query.startDate.$lte = new Date(toDate);
    }

    const cleaned = removeEmptyKeys(query);

    const captains = await CaptaincyModel.find(cleaned)
      .sort({ createdAt: -1, startDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await CaptaincyModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: captains,
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
      message: getApiErrorMessage(error, 'Failed to fetch captains'),
    }, { status: 500 });
  }
}

// POST /api/captains - Assign new captain
export async function POST(request: NextRequest) {
  try {


    const session = await auth();

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { player, role } = await request.json();

    if (!player || !role) {
      return NextResponse.json({
        success: false,
        message: 'Player and role are required',
      }, { status: 400 });
    }

    const playerExists = await PlayerModel.findById(player._id);
    if (!playerExists) {
      return NextResponse.json({
        success: false,
        message: 'Player not found',
      }, { status: 404 });
    }

    // End current captain's reign for this role
    await CaptaincyModel.updateMany(
      { isActive: true, role: role },
      { $set: { isActive: false, endDate: new Date() } }
    );

    const newCaptain = await CaptaincyModel.create({
      player,
      role,
      isActive: true,
      startDate: new Date(),
      createdBy: session.user?.id,
    });

    const populatedCaptain = await CaptaincyModel.findById(newCaptain._id).lean();

    LoggerService.info('👑 Captain Assigned', `${player.name} appointed as ${role}`);

    return NextResponse.json({
      message: 'Captain assigned successfully.',
      success: true,
      data: populatedCaptain,
    }, { status: 201 });
  } catch (error) {

    return NextResponse.json({
      message: getApiErrorMessage(error),
      success: false,
    }, { status: 500 });
  }
}
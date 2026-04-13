// app/api/matches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';

import { EMatchStatus } from '@/types/match.interface';
import { removeEmptyKeys } from '@/lib';
import MatchModel, { IPostMatch } from '@/models/match';
import { logAction } from '../logs/helper';
import { slugify } from '@/lib/slugging';
import { formatDate } from '@/lib/timeAndDate';
import { getApiErrorMessage } from '../../../lib/error-api';

connectDB();

// GET /api/matches - List all matches
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const status = searchParams.get('status') as EMatchStatus;
    const search = searchParams.get('match_search') || '';
    const fixtureType = searchParams.get('fixture') || '';
    const competition = searchParams.get('competition') || '';
    const season = searchParams.get('season') || '';
    const teamId = searchParams.get('teamId') || '';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';

    const regex = new RegExp(search, 'i');
    const query: Record<string, any> = {};

    if (fixtureType === 'home') query.isHome = true;
    if (fixtureType === 'away') query.isHome = false;
    if (status) query.status = status;
    if (competition) query.competition = competition;
    if (season) query.season = season;

    if (teamId) {
      query.$or = [
        { opponent: teamId },
        { 'squad.team': teamId }
      ];
    }

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    if (search) {
      query.$or = [
        ...(query.$or || []),
        { title: regex },
        { competition: regex },
        { venue: regex },
      ];
    }

    const cleanedFilters = removeEmptyKeys(query);

    const matches = await MatchModel.find(cleanedFilters)
      .populate('opponent')
      .populate('squad')
      .populate('goals')
      .populate('cards')
      .populate('injuries')
      .populate('mvp')
      .limit(limit)
      .skip(skip)
      .sort({ date: 'desc' });

    const total = await MatchModel.countDocuments(cleanedFilters);

    return NextResponse.json({
      success: true,
      data: matches,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {

    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch matches'),
    }, { status: 500 });
  }
}

// POST /api/matches - Create new match
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const formdata: IPostMatch = await request.json();
    const slug = slugify(`${formdata.title}-${formdata.date}`, false);

    const saved = await MatchModel.create({
      ...formdata,
      slug,
      createdBy: session.user?.id
    });

    await logAction({
      title: `Match created - [${saved.title}]`,
      description: `A match item (${saved.title}) created on ${formatDate(new Date().toISOString())}.`,
      meta: {
        slug: saved._id,
        title: saved.title,
        date: saved.date,
        opponent: saved.opponent,
      },
    });

    return NextResponse.json({
      message: 'Fixture created successfully',
      success: true,
      data: saved,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to create match'),
      success: false,
    }, { status: 500 });
  }
}
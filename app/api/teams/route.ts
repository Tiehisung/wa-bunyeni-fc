// app/api/teams/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';

import { ELogSeverity } from '@/types/log.interface';
import { IPostTeam } from '@/app/admin/teams/TeamForm';
import { removeEmptyKeys } from '@/lib';
import TeamModel from '@/models/teams';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';
import { logAction } from '../logs/helper';

connectDB();

// GET /api/teams - List all teams
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const search = searchParams.get('team_search') || '';
    const clubId = searchParams.get('clubId') || '';
    const season = searchParams.get('season') || '';
    const league = searchParams.get('league') || '';
    const status = searchParams.get('status') || '';

    const regex = new RegExp(search, 'i');
    const query: any = {};

    if (search) {
      query.$or = [
        { name: regex },
        { alias: regex },
        { community: regex },
        { league: regex },
        { division: regex },
      ];
    }

    if (clubId) query.clubId = clubId;
    if (season) query.season = season;
    if (league) query.league = league;
    if (status) query.status = status;

    const cleaned = removeEmptyKeys(query);

    const teams = await TeamModel.find(cleaned)
      .limit(limit)
      .skip(skip)
      .lean()
      .sort({ createdAt: 'desc' });

    const total = await TeamModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    LoggerService.error('Failed to fetch teams', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to retrieve teams'),
      data: [],
    }, { status: 500 });
  }
}

// POST /api/teams - Create new team
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Optional: Uncomment for auth check
    // if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
    //     return NextResponse.json({
    //         success: false,
    //         message: 'Unauthorized',
    //     }, { status: 401 });
    // }

    const teamData = await request.json() as IPostTeam;

    const existingTeam = await TeamModel.findOne({
      name: teamData.name,
    });

    if (existingTeam) {
      return NextResponse.json({
        success: false,
        message: 'Team with this name already exists for this season',
      }, { status: 409 });
    }

    const createdTeam = await TeamModel.create({
      ...teamData,
      createdBy: session?.user?._id
    });

    if (!createdTeam) {
      return NextResponse.json({
        success: false,
        message: 'Team creation failed',
      }, { status: 500 });
    }

    await logAction({
      title: `Team Created - ${createdTeam.name}`,
      description: `New team ${createdTeam.name} created for season ${createdTeam.season}`,
      severity: ELogSeverity.INFO,
      meta: {
        teamId: createdTeam._id,
        clubId: createdTeam.clubId,
        season: createdTeam.season,
      },
    });

    const populatedTeam = await TeamModel.findById(createdTeam._id).lean();

    return NextResponse.json({
      success: true,
      message: 'Team created successfully',
      data: populatedTeam,
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create team', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to create team'),
    }, { status: 500 });
  }
}
// app/api/squads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import SquadModel from '@/models/squad';
import MatchModel from '@/models/match';
import PlayerModel from '@/models/player';
import { ISquad } from '@/types/squad.interface';
import { formatDate } from '@/lib/timeAndDate';
import { removeEmptyKeys } from '@/lib';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';

connectDB();

// GET /api/squads - List all squads
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const search = searchParams.get('squad_search') || '';
    const matchId = searchParams.get('matchId') || '';
    const season = searchParams.get('season') || '';

    const regex = new RegExp(search, 'i');
    const query: any = {};

    if (search) {
      query.$or = [
        { title: regex },
        { description: regex },
        { 'coach.name': regex },
        { 'assistant.name': regex },
        { 'match.title': regex },
      ];
    }

    if (matchId) query.match = matchId;
    if (season) query.season = season;

    const cleaned = removeEmptyKeys(query);

    const squads = await SquadModel.find(cleaned)
      .populate('match')
      .limit(limit)
      .skip(skip)
      .lean()
      .sort({ createdAt: 'desc' });

    const total = await SquadModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: squads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    LoggerService.error('Failed to fetch squads', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch squads'),
    }, { status: 500 });
  }
}

// POST /api/squads - Create new squad
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { match, players, assistant, coach, description, formation } = await request.json() as ISquad;

    if (!match) {
      return NextResponse.json({
        success: false,
        message: 'Match is required',
      }, { status: 400 });
    }

    if (!players || !players.length) {
      return NextResponse.json({
        success: false,
        message: 'Players are required',
      }, { status: 400 });
    }

    const existingSquad = await SquadModel.findOne({ match: match._id || match });
    if (existingSquad) {
      return NextResponse.json({
        success: false,
        message: 'Squad already exists for this match',
      }, { status: 409 });
    }

    const matchDetails = await MatchModel.findById(match._id || match);
    if (!matchDetails) {
      return NextResponse.json({
        success: false,
        message: 'Match not found',
      }, { status: 404 });
    }

    const savedSquad = await SquadModel.create({
      players,
      assistant,
      coach,
      description,
      formation: formation || '4-4-2',
      title: matchDetails.title,
      match: match._id || match,
      season: matchDetails.season,
      createdBy: session.user?._id
    });

    if (!savedSquad) {
      return NextResponse.json({
        message: 'Failed to create squad.',
        success: false,
      }, { status: 500 });
    }

    await MatchModel.findByIdAndUpdate(
      match._id || match,
      { $set: { squad: savedSquad._id } }
    );

    for (const player of players) {
      await PlayerModel.findByIdAndUpdate(
        player._id,
        { $inc: { 'stats.squadAppearances': 1 } }
      );
    }

    LoggerService.critical(
      '📋 Squad Created',
      description || `Squad for ${matchDetails.title} on ${formatDate(matchDetails.date)}`,
      request
    );

    return NextResponse.json({
      message: 'Squad created successfully!',
      success: true,
      data: savedSquad,
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create squad', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to create squad'),
      success: false,
    }, { status: 500 });
  }
}
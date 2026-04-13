// app/api/mvps/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import PlayerModel from '@/models/player';
import MatchModel from '@/models/match';

import { ELogSeverity } from '@/types/log.interface';
import MvPModel, { IPostMvp } from '@/models/mpv';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';
import { logAction } from '../logs/helper';
import { updateMatchEvent } from '../matches/helpers';

connectDB();

// GET /api/mvps - List all MVPs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const skip = (page - 1) * limit;

    const search = searchParams.get('mvp_search') || '';
    const playerId = searchParams.get('playerId') || '';
    const matchId = searchParams.get('matchId') || '';
    const season = searchParams.get('season') || '';

    const regex = new RegExp(search, 'i');
    const query: any = {};

    if (search) {
      query.$or = [
        { 'player.name': regex },
        { 'match.title': regex },
        { description: regex },
        { positionPlayed: regex },
      ];
    }

    if (playerId) query.player = playerId;
    if (matchId) query.match = matchId;
    if (season) query.season = season;

    const mvps = await MvPModel.find(query)
      .populate('player', 'name number position avatar')
      .populate('match', 'title date competition opponent')
      .limit(limit)
      .skip(skip)
      .lean()
      .sort({ createdAt: 'desc' });

    const total = await MvPModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: mvps,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // LoggerService.error('Failed to fetch MVPs', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch MVPs'),
    }, { status: 500 });
  }
}

// POST /api/mvps - Create new MVP
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { match, player, description, positionPlayed, season } = await request.json() as IPostMvp;

    if (!match || !player) {
      return NextResponse.json({
        success: false,
        message: 'Match ID and player ID are required',
      }, { status: 400 });
    }

    // Check if match already has an MVP
    const existingMatch = await MatchModel.findById(match).populate('mvp');

    if (existingMatch?.mvp) {
      return NextResponse.json({
        message: 'Match already assigned Man of the Match.',
        success: false,
      }, { status: 409 });
    }

    const savedMVP = await MvPModel.create({
      match,
      player,
      description,
      positionPlayed,
      season: season || existingMatch?.season,
      createdBy: session.user?.id
    });

    if (!savedMVP) {
      return NextResponse.json({
        message: 'Failed to create MVP.',
        success: false,
      }, { status: 500 });
    }

    // Update Match - add MVP reference
    await MatchModel.findByIdAndUpdate(
      match,
      {
        $set: { mvp: savedMVP._id },
        $push: { mvps: savedMVP._id }
      }
    );

    // Update Player - add MVP reference
    const playerId = typeof player === 'object' ? player._id : player;
    await PlayerModel.findByIdAndUpdate(
      playerId,
      { $push: { mvps: savedMVP._id } }
    );

    // Update match events
    await updateMatchEvent(match?.toString(), {
      type: 'general',
      minute: 'FT',
      title: `🏆 ${typeof player === 'object' ? player.name : 'Player'} awarded Man of the Match`,
      description: description || `Outstanding performance${positionPlayed ? ` playing as ${positionPlayed}` : ''}`,
      timestamp: new Date(),
    });

    await logAction({
      title: '🏆 MVP Awarded',
      description: `${typeof player === 'object' ? player.name : 'Player'} declared Man of the Match. ${description || ''}`,
      severity: ELogSeverity.INFO,
      meta: {
        mvpId: savedMVP._id,
        matchId: match,
        playerId: playerId,
      },
    });

    const populatedMVP = await MvPModel.findById(savedMVP._id)
      .populate('player', 'name number position avatar')
      .populate('match', 'title date competition opponent')
      .lean();

    return NextResponse.json({
      message: 'Man of the Match awarded successfully!',
      success: true,
      data: populatedMVP,
    }, { status: 201 });
  } catch (error) {
    // LoggerService.error('Failed to create MVP', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to create MVP'),
      success: false,
    }, { status: 500 });
  }
}
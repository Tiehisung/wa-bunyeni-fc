// app/api/matches/live/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import { EMatchStatus } from '@/types/match.interface';
import MatchModel from '@/models/match';
import PlayerModel from '@/models/player';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/matches/live - Get live match
export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const match = await MatchModel.findOne({
      $or: [
        { date: today },
        { date: new Date().toISOString() },
        { status: 'LIVE' }
      ]
    }).populate('opponent').populate('squad').populate('goals');

    return NextResponse.json({
      success: true,
      data: match,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch live match'),
    }, { status: 500 });
  }
}

// POST /api/matches/live - Go live with match
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { _id, playerIds } = await request.json();

    await MatchModel.findByIdAndUpdate(_id, {
      $set: { status: EMatchStatus.LIVE },
    });

    for (const id of playerIds) {
      await PlayerModel.findByIdAndUpdate(id, { $push: { matches: id } });
    }

    return NextResponse.json({
      message: 'Match is live now',
      success: true
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to set match live'),
    }, { status: 500 });
  }
}

// PUT /api/matches/live - Update live match events
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { matchId, event } = await request.json();

    await MatchModel.findByIdAndUpdate(matchId, {
      $push: { events: event },
    });

    return NextResponse.json({
      message: 'Match Event updated',
      success: true
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to update match event'),
    }, { status: 500 });
  }
}
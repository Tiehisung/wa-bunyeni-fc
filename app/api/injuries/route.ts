// app/api/injuries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import InjuryModel from '@/models/injury';
import PlayerModel from '@/models/player';
import MatchModel from '@/models/match';
import { IInjury } from '@/types/injury.interface';
import { EInjurySeverity } from '@/types/injury.interface';
import { ELogSeverity } from '@/types/log.interface';
import { removeEmptyKeys } from '@/lib';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';
import { logAction } from '../logs/helper';

connectDB();

// GET /api/injuries - List all injuries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const search = searchParams.get('injury_search') || '';
    const matchId = searchParams.get('matchId') || '';
    const playerId = searchParams.get('playerId') || '';
    const severity = searchParams.get('severity') || '';
    const status = searchParams.get('status') || '';

    const regex = new RegExp(search, 'i');
    const query: any = {};

    if (search) {
      query.$or = [
        { title: regex },
        { description: regex },
        { severity: regex },
        { 'player.name': regex },
        { minute: regex },
        { 'match.title': regex },
      ];
    }

    if (matchId) query.match = matchId;
    if (playerId) query.player = playerId;
    if (severity) query.severity = severity;
    if (status) query.status = status;

    const cleaned = removeEmptyKeys(query);

    const injuries = await InjuryModel.find(cleaned)
      .limit(limit)
      .skip(skip)
      .lean()
      .sort({ createdAt: 'desc' });

    const total = await InjuryModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: injuries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // LoggerService.error('Failed to fetch injuries', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch injuries'),
    }, { status: 500 });
  }
}

// POST /api/injuries - Create new injury
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { match, minute, player, description, severity, title, status } = await request.json() as IInjury;

    const savedInjury = await InjuryModel.create({
      minute,
      description,
      severity: severity || 'minor',
      match,
      player,
      title: title || `${player.name} Injury`,
      status: status || 'active',
      createdBy: session.user?._id
    });

    if (!savedInjury) {
      return NextResponse.json({
        message: 'Failed to create injury.',
        success: false,
      }, { status: 500 });
    }

    // Update Player - add injury reference
    await PlayerModel.findByIdAndUpdate(
      player._id || player,
      { $push: { injuries: savedInjury._id } }
    );

    // Update Match - add injury reference if match exists
    if (match) {
      await MatchModel.findByIdAndUpdate(
        match,
        { $push: { injuries: savedInjury._id } }
      );
    }

    await logAction({
      title: `🤕 Injury Created - ${title || player.name}`,
      description: description || `${player.name} injured at ${minute}'`,
      severity: (severity === EInjurySeverity.MAJOR || severity === EInjurySeverity.SEVERE) ? ELogSeverity.CRITICAL : ELogSeverity.INFO,
      meta: {
        injuryId: savedInjury._id,
        playerId: player._id || player,
        matchId: match,
        minute,
        severity,
      },
    });

    const populatedInjury = await InjuryModel.findById(savedInjury._id).lean();

    return NextResponse.json({
      message: 'Injury recorded successfully!',
      success: true,
      data: populatedInjury,
    }, { status: 201 });
  } catch (error) {
    // LoggerService.error('Failed to create injury', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to create injury'),
      success: false,
    }, { status: 500 });
  }
}
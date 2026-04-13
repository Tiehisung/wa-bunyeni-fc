// app/api/cards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import CardModel from '@/models/card';
import PlayerModel from '@/models/player';
import MatchModel from '@/models/match';
import { IPostCard } from '@/models/card';
import { ECardType } from '@/types/card.interface';
import { ELogSeverity } from '@/types/log.interface';
import { getApiErrorMessage } from '../../../lib/error-api';
import { logAction } from '../logs/helper';
import { updateMatchEvent } from '../matches/helpers';


connectDB();

// GET /api/cards - List all cards
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const skip = (page - 1) * limit;

    const search = searchParams.get('card_search') || '';
    const matchId = searchParams.get('matchId') || '';
    const playerId = searchParams.get('playerId') || '';
    const type = searchParams.get('type') || '';

    const regex = new RegExp(search, 'i');
    const query: any = {};

    if (search) {
      query.$or = [
        { type: regex },
        { 'player?.name': regex },
        { 'match.title': regex },
        { description: regex },
        { minute: regex },
      ];
    }

    if (matchId) query.match = matchId;
    if (playerId) query.player = playerId;
    if (type) query.type = type;

    const cards = await CardModel.find(query)
      .populate('player', 'name number position avatar')
      .populate('match', 'title date competition opponent')
      .limit(limit)
      .skip(skip)
      .lean()
      .sort({ createdAt: 'desc' });

    const total = await CardModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: cards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // LoggerService.error('Failed to fetch cards', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch cards'),
    }, { status: 500 });
  }
}

// POST /api/cards - Create new card
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { match, minute, player, type, description } = await request.json() as IPostCard;

    if (![...Object.values(ECardType)].includes(type)) {
      return NextResponse.json({
        success: false,
        message: `Card type must be one of ${Object.values(ECardType).join(', ')}`,
      }, { status: 400 });
    }

    // Check if player already has a red card in this match
    if (type === 'red') {
      const existingRed = await CardModel.findOne({
        match: match?._id,
        player: player?._id,
        type: 'red'
      });

      if (existingRed) {
        return NextResponse.json({
          success: false,
          message: 'Player already has a red card in this match',
        }, { status: 409 });
      }
    }

    const savedCard = await CardModel.create({
      match,
      minute,
      player,
      type,
      description,
      createdBy: session.user?.id
    });

    if (!savedCard) {
      return NextResponse.json({
        message: 'Failed to create card.',
        success: false,
      }, { status: 500 });
    }

    // Update Player - add card reference
    await PlayerModel.findByIdAndUpdate(
      player?._id,
      { $push: { cards: savedCard._id } }
    );

    // Update Match - add card reference
    const matchId = match._id;
    await MatchModel.findByIdAndUpdate(
      matchId,
      { $push: { cards: savedCard._id } }
    );

    // Update match events
    const emoji = type === 'red' ? '🟥' : '🟨';
    await updateMatchEvent(matchId, {
      type: 'card',
      minute: String(minute),
      title: `${emoji} ${minute}' - ${player?.number || ''} ${player?.name || 'Player'}`,
      description: description || `${type.toUpperCase()} card`,
      timestamp: new Date(),
    });

    await logAction({
      title: `${emoji} ${type.toUpperCase()} Card Issued`,
      description: description || `${type} card for ${player?.name}`,
      severity: type === 'red' ? ELogSeverity.WARNING : ELogSeverity.INFO,
      meta: {
        cardId: savedCard._id,
        matchId,
        playerId: player?._id,
        type,
        minute,
      },
    });

    return NextResponse.json({
      message: 'Card recorded successfully!',
      success: true,
      data: savedCard,
    }, { status: 201 });
  } catch (error) {
    // LoggerService.error('Failed to create card', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to create card'),
      success: false,
    }, { status: 500 });
  }
}
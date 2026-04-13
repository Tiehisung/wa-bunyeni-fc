// app/api/goals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import PlayerModel from '@/models/player';
import MatchModel from '@/models/match';
import GoalModel, { IPostGoal } from '@/models/goals';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';

connectDB();

// GET /api/goals - List all goals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const search = searchParams.get('goal_search') || '';
    const matchId = searchParams.get('matchId') || '';
    const playerId = searchParams.get('playerId') || '';
    const forKFC = searchParams.get('forKFC') === 'true';

    const regex = new RegExp(search, 'i');
    const query: any = {};

    if (search) {
      query.$or = [
        { 'scorer._id': regex },
        { 'scorer.name': regex },
        { 'assist.name': regex },
        { 'assist._id': regex },
        { description: regex },
        { 'opponent.name': regex },
        { 'opponent._id': regex },
        { modeOfScore: regex },
      ];
    }

    if (matchId) {
      query.match = matchId;
    }

    if (playerId) {
      query.$or = [
        ...(query.$or || []),
        { 'scorer._id': playerId },
        { 'assist._id': playerId },
      ];
    }

    if (searchParams.has('forKFC')) {
      query.forKFC = forKFC;
    }

    const goals = await GoalModel.find(query)
      .populate('match', 'title date competition')
      .limit(limit)
      .skip(skip)
      .lean()
      .sort({ createdAt: 'desc' });

    const total = await GoalModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: goals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    LoggerService.error('Failed to fetch goals', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch goals'),
    }, { status: 500 });
  }
}

// POST /api/goals - Create new goal
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const { match, description, minute, scorer, assist, modeOfScore, teamId } = await request.json() as IPostGoal;

    if (!match || !minute) {
      return NextResponse.json({
        success: false,
        message: 'Match ID and minute are required',
      }, { status: 400 });
    }

    const savedGoal = await GoalModel.create({
      match,
      description,
      minute,
      scorer,
      assist,
      modeOfScore,
      teamId,
      createdBy: session.user?.id
    });

    if (!savedGoal) {
      return NextResponse.json({
        message: 'Failed to create goal.',
        success: false,
      }, { status: 500 });
    }

    // Update Match - add goal reference
    const updatedMatch = await MatchModel.findByIdAndUpdate(
      match,
      { $push: { goals: savedGoal._id } },
      { new: true }
    );

    // Update Player statistics
    if (scorer) {
      await PlayerModel.findByIdAndUpdate(
        scorer._id,
        { $push: { goals: savedGoal._id } }
      );

      if (assist) {
        await PlayerModel.findByIdAndUpdate(
          assist._id,
          { $push: { assists: savedGoal._id } }
        );
      }
    }

    LoggerService.info(
      `Goal Created - ${updatedMatch?.title || 'Match'}`,
      description || `Goal scored at ${minute}'`,
      request
    );

    const populatedGoal = await GoalModel.findById(savedGoal._id)
      .lean();

    return NextResponse.json({
      message: 'Goal created successfully!',
      success: true,
      data: populatedGoal,
    }, { status: 201 });
  } catch (error) {
    LoggerService.error('Failed to create goal', error);
    return NextResponse.json({
      message: getApiErrorMessage(error, 'Failed to create goal'),
      success: false,
    }, { status: 500 });
  }
}
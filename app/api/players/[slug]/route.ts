import "@/models/file";
import "@/models/galleries";
import "@/models/match";
import "@/models/mpv";
import "@/models/injury";
import "@/models/card";
import "@/models/goals";

// app/api/players/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import PlayerModel from '@/models/player';
import UserModel from '@/models/user';
import { generatePlayerID } from '../route';
import { ELogSeverity } from '@/types/log.interface';
import { getInitials } from "@/lib";
import ArchiveModel from "@/models/Archives";
import { LoggerService } from "../../../../shared/log.service";
import { getApiErrorMessage } from "../../../../lib/error-api";
import { slugIdFilters } from "../../../../lib/slug";
import { logAction } from "../../logs/helper";

connectDB();

// GET /api/players/[slug] - Get single player
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const filter = slugIdFilters(params.slug);

    const player = await PlayerModel.findOne(filter)
      .populate({ path: 'galleries', populate: { path: 'files' } })
      .populate('matches')
      .populate('mvps')
      .populate('cards')
      .populate('injuries')
      .populate('goals')
      .populate('assists')
      .populate('createdBy', 'name role')
      .lean();

    if (!player) {
      return NextResponse.json({
        success: false,
        message: 'Player not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: player,
    });
  } catch (error) {
    LoggerService.error('Failed to fetch player', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to fetch player'),
    }, { status: 500 });
  }
}

// PUT /api/players/[slug] - Update player
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'player'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const filter = slugIdFilters(params.slug);
    const formData = await request.json();
    const updates = { ...formData };

    const updatedPlayer = await PlayerModel.findOneAndUpdate(
      filter,
      { $set: updates },
      { new: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json({
        success: false,
        message: 'Player not found',
      }, { status: 404 });
    }

    // Add code to existing players if missing
    let playerCode = generatePlayerID(
      updatedPlayer.firstName,
      updatedPlayer.lastName,
      updatedPlayer.dob
    );

    if (!updatedPlayer.code) {
      const existingPlayerByCode = await PlayerModel.findOne({ code: playerCode });

      if (!existingPlayerByCode) {
        await PlayerModel.findOneAndUpdate(
          filter,
          { $set: { code: playerCode } }
        );
        updatedPlayer.code = playerCode;
      } else {
        playerCode = getInitials([updatedPlayer.firstName, updatedPlayer.lastName], 2) + Date.now();
        await PlayerModel.findOneAndUpdate(
          filter,
          { $set: { code: playerCode } }
        );
        updatedPlayer.code = playerCode;
      }
    }

    return NextResponse.json({
      message: 'Update success',
      success: true,
      data: updatedPlayer,
    });
  } catch (error) {
    LoggerService.error('Failed to update player', error);
    return NextResponse.json({
      message: `Update failed. ${getApiErrorMessage(error)}`,
      success: false,
    }, { status: 500 });
  }
}

// PATCH /api/players/[slug] - Partial update player
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();

    if (!session || !['admin', 'super_admin', 'player'].includes(session.user?.role || '')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
      }, { status: 401 });
    }

    const filter = slugIdFilters(params.slug);
    const updates = await request.json();

    // Remove undefined or null values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined || updates[key] === null) {
        delete updates[key];
      }
    });

    const updatedPlayer = await PlayerModel.findOneAndUpdate(
      filter,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate({ path: 'galleries', populate: { path: 'files' } });

    if (!updatedPlayer) {
      return NextResponse.json({
        success: false,
        message: 'Player not found',
      }, { status: 404 });
    }

    await logAction({
      title: 'Player Updated',
      description: `Player [${updatedPlayer.firstName} ${updatedPlayer.lastName}] updated`,
      severity: ELogSeverity.INFO,
      meta: { updates, playerId: updatedPlayer._id },
    });

    return NextResponse.json({
      success: true,
      message: 'Player updated successfully',
      data: updatedPlayer,
    });
  } catch (error) {
    LoggerService.error('Failed to update player', error);
    return NextResponse.json({
      success: false,
      message: getApiErrorMessage(error, 'Failed to update player'),
    }, { status: 500 });
  }
}

// DELETE /api/players/[slug] - Delete player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();

    // Only super admin can delete players
    if (session?.user?.role !== 'super_admin') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Only super admins can delete players.',
      }, { status: 403 });
    }

    const filter = slugIdFilters((await params).slug);

    const player = await PlayerModel.findOne(filter);

    if (!player) {
      return NextResponse.json({
        success: false,
        message: 'Player not found',
      }, { status: 404 });
    }

    // Archive the player
    await ArchiveModel.updateOne(
      { sourceCollection: 'players' },
      { $push: { data: player } },
      { upsert: true }
    );

    const deleted = await PlayerModel.findOneAndDelete(filter);

    // Delete associated user account
    if (deleted?.email) {
      await UserModel.findOneAndDelete({ email: deleted.email });
    }

    await logAction({
      title: 'Player Deleted',
      description: `Player with id [${(await params).slug}] deleted on ${new Date().toLocaleString()}`,
      severity: ELogSeverity.CRITICAL,
      meta: deleted,
    });

    return NextResponse.json({
      message: 'Deleted successfully',
      success: true,
    });
  } catch (error) {
    LoggerService.error('Failed to delete player', error);
    return NextResponse.json({
      message: `Delete failed. ${getApiErrorMessage(error)}`,
      success: false,
    }, { status: 500 });
  }
}
// app/api/cards/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import CardModel from '@/models/card';
import PlayerModel from '@/models/player';
import MatchModel from '@/models/match';

import { ELogSeverity } from '@/types/log.interface';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { logAction } from '../../logs/helper';
import { updateMatchEvent } from '../../matches/helpers';

connectDB();

// GET /api/cards/[id] - Get single card
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const card = await CardModel.findById(params.id)
            .populate('player', 'name number position avatar')
            .populate('match', 'title date competition opponent')
            .lean();

        if (!card) {
            return NextResponse.json({
                success: false,
                message: 'Card not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: card,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch card', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch card'),
        }, { status: 500 });
    }
}

// PUT /api/cards/[id] - Update card
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const updates = await request.json();
        delete updates._id;

        const updatedCard = await CardModel.findByIdAndUpdate(
            params.id,
            {
                $set: {
                    ...updates,
                    updatedAt: new Date(),
                    updatedBy: session.user?.id,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedCard) {
            return NextResponse.json({
                success: false,
                message: 'Card not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Card updated successfully',
            data: updatedCard,
        });
    } catch (error) {
        // LoggerService.error('Failed to update card', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update card'),
        }, { status: 500 });
    }
}

// DELETE /api/cards/[id] - Delete card
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const cardToDelete = await CardModel.findById(params.id);

        if (!cardToDelete) {
            return NextResponse.json({
                success: false,
                message: 'Card not found',
            }, { status: 404 });
        }

        const deleted = await CardModel.findByIdAndDelete(params.id);

        // Update Player - remove card reference
        if (cardToDelete.player) {
            await PlayerModel.findByIdAndUpdate(
                cardToDelete.player._id,
                { $pull: { cards: params.id } }
            );
        }

        // Update Match - remove card reference
        if (cardToDelete.match) {
            await MatchModel.findByIdAndUpdate(
                cardToDelete.match._id,
                { $pull: { cards: params.id } }
            );
        }

        // Update match events
        await updateMatchEvent(cardToDelete.match?._id as string, {
            type: 'card',
            minute: cardToDelete.minute,
            title: 'Card revoked',
            description: `${cardToDelete.type.toUpperCase()} card reviewed and revoked`,
            timestamp: new Date(),
        });

        await logAction({
            title: 'Card Revoked',
            description: `${cardToDelete.type} card for ${cardToDelete.player?.name} revoked`,
            severity: ELogSeverity.WARNING,
            meta: {
                cardId: params.id,
                matchId: cardToDelete.match?._id,
                playerId: cardToDelete.player?._id,
                type: cardToDelete.type,
            },
        });

        return NextResponse.json({
            message: 'Card deleted successfully!',
            success: true,
            data: deleted,
        });
    } catch (error) {
        // LoggerService.error('Failed to delete card', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to delete card'),
            success: false,
        }, { status: 500 });
    }
}
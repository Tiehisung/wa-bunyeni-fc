// app/api/goals/[goalId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';

import PlayerModel from '@/models/player';
import MatchModel from '@/models/match';
import GoalModel from '@/models/goals';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/goals/[goalId] - Get single goal
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ goalId: string }> }
) {
    try {
        const goal = await GoalModel.findById((await params).goalId)
            .populate('match', 'title date competition')
            .populate('scorer', 'name number position')
            .populate('assist', 'name number position')
            .lean();

        if (!goal) {
            return NextResponse.json({
                success: false,
                message: 'Goal not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: goal,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch goal', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch goal'),
        }, { status: 500 });
    }
}

// PUT /api/goals/[goalId] - Update goal
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ goalId: string }> }
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

        const updatedGoal = await GoalModel.findByIdAndUpdate(
            (await params).goalId,
            {
                $set: {
                    ...updates,
                    updatedAt: new Date(),
                    updatedBy: session.user?.id,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedGoal) {
            return NextResponse.json({
                success: false,
                message: 'Goal not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Goal updated successfully',
            data: updatedGoal,
        });
    } catch (error) {
        LoggerService.error('Failed to update goal', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update goal'),
        }, { status: 500 });
    }
}

// DELETE /api/goals/[goalId] - Delete goal
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ goalId: string }> }
) {
    try {
        const goalId = (await params).goalId
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const goalToDelete = await GoalModel.findById(goalId).lean();

        if (!goalToDelete) {
            return NextResponse.json({
                message: 'Goal not found',
                success: false,
            }, { status: 404 });
        }

        const { forKFC, match, scorer, assist } = goalToDelete;

        const deletedGoal = await GoalModel.findByIdAndDelete(goalId);

        if (!deletedGoal) {
            return NextResponse.json({
                message: 'Failed to delete goal.',
                success: false,
            }, { status: 500 });
        }

        // Update Match - remove goal reference
        const updatedMatch = await MatchModel.findByIdAndUpdate(
            match,
            { $pull: { goals: goalId } },
            { new: true }
        );

        // Update Player statistics
        if (forKFC && scorer) {
            await PlayerModel.findByIdAndUpdate(
                scorer._id,
                { $pull: { goals: goalId } }
            );

            if (assist) {
                await PlayerModel.findByIdAndUpdate(
                    assist._id,
                    { $pull: { assists: goalId } }
                );
            }
        }

        LoggerService.critical(
            `Goal Deleted - ${updatedMatch?.title || 'Match'}`,
            deletedGoal?.description || 'Goal deleted',
            request
        );

        return NextResponse.json({
            message: 'Goal deleted successfully!',
            success: true,
            data: deletedGoal,
        });
    } catch (error) {
        // LoggerService.error('Failed to delete goal', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to delete goal'),
            success: false,
        }, { status: 500 });
    }
}
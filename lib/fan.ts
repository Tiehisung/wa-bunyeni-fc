// lib/fan-utils.ts

import connectDB from '@/config/db.config';
import UserModel from '@/models/user';
import { IFan } from '@/types/user';

connectDB();

// Update fan points
export const updateFanPoints = async (userId: string, action: string) => {


    const pointsMap = {
        comment: 10,
        share: 15,
        reaction: 5,
        matchAttendance: 50,
        galleryUpload: 20,
        newsView: 2
    };

    const points = pointsMap[action as keyof typeof pointsMap] || 0;

    const user = await UserModel.findByIdAndUpdate(
        userId,
        {
            $inc: {
                fanPoints: points,
                [`contributions.${action}s`]: 1
            },
            $set: { lastActive: new Date() }
        },
        { new: true }
    );

    if (user) {
        const engagementScore = calculateEngagementScore(user);
        await UserModel.findByIdAndUpdate(userId, { engagementScore });
    }

    await checkAndAwardBadges(userId);

    return user;
};

// Calculate engagement score
export const calculateEngagementScore = (user: IFan): number => {
    const { contributions } = user;
    const maxScore = 100;

    const weights = {
        comments: 0.3,
        shares: 0.25,
        reactions: 0.2,
        matchAttendance: 0.15,
        galleries: 0.1
    };

    let score = 0;
    if (contributions.comments > 50) score += weights.comments * maxScore;
    else if (contributions.comments > 20) score += weights.comments * maxScore * 0.6;
    else if (contributions.comments > 5) score += weights.comments * maxScore * 0.3;

    if (contributions.shares > 50) score += weights.shares * maxScore;
    else if (contributions.shares > 20) score += weights.shares * maxScore * 0.6;
    else if (contributions.shares > 5) score += weights.shares * maxScore * 0.3;

    if (contributions.reactions > 100) score += weights.reactions * maxScore;
    else if (contributions.reactions > 50) score += weights.reactions * maxScore * 0.6;
    else if (contributions.reactions > 20) score += weights.reactions * maxScore * 0.3;

    if (contributions.matchAttendance > 10) score += weights.matchAttendance * maxScore;
    else if (contributions.matchAttendance > 5) score += weights.matchAttendance * maxScore * 0.6;
    else if (contributions.matchAttendance > 2) score += weights.matchAttendance * maxScore * 0.3;

    if (contributions.galleries > 5) score += weights.galleries * maxScore;
    else if (contributions.galleries > 2) score += weights.galleries * maxScore * 0.6;
    else if (contributions.galleries > 0) score += weights.galleries * maxScore * 0.3;

    return Math.min(maxScore, Math.round(score));
};

// Check and award badges
export const checkAndAwardBadges = async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) return;

    const newBadges: string[] = [];

    // Super Fan badge (100+ points)
    if (user.fanPoints >= 100 && !user.fanBadges.includes('Super Fan')) {
        newBadges.push('Super Fan');
    }

    // Comment Champion badge (50+ comments)
    if (user.contributions.comments >= 50 && !user.fanBadges.includes('Comment Champion')) {
        newBadges.push('Comment Champion');
    }

    // Match Day Regular badge (10+ matches)
    if (user.contributions.matchAttendance >= 10 && !user.fanBadges.includes('Match Day Regular')) {
        newBadges.push('Match Day Regular');
    }

    // Social Butterfly badge (20+ shares)
    if (user.contributions.shares >= 20 && !user.fanBadges.includes('Social Butterfly')) {
        newBadges.push('Social Butterfly');
    }

    if (newBadges.length > 0) {
        await UserModel.findByIdAndUpdate(userId, {
            $addToSet: { fanBadges: { $each: newBadges } }
        });
    }
};
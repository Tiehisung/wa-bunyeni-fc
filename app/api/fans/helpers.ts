// lib/fan.service.ts
import connectDB from "@/config/db.config";
import { slugIdFilters } from "@/lib/slug";
import UserModel from "@/models/user";
import  FanModel  from "@/models/fans";
import { IFanLeaderboardEntry } from "@/services/fans.endpoints";

import { EFanBadge, IFan } from "@/types/fan.interface";

// Points mapping for different actions
export const POINTS_MAP = {
  comment: 10,
  share: 15,
  reaction: 5,
  matchAttendance: 50,
  galleryUpload: 20,
  newsView: 2,
} as const;

export type FanAction = keyof typeof POINTS_MAP;

// Badge thresholds
export const BADGE_THRESHOLDS = {
  [EFanBadge.SUPER_FAN]: 1000,
  [EFanBadge.COMMENT_CHAMPION]: 100,
  [EFanBadge.MATCH_DAY_REGULAR]: 10,
  [EFanBadge.SOCIAL_BUTTERFLY]: 50,
  [EFanBadge.REACTION_MASTER]: 200,
  [EFanBadge.GALLERY_CONTRIBUTOR]: 5,
  [EFanBadge.EARLY_BIRD]: 30, // days
  [EFanBadge.DEDICATED_FAN]: 365, // days
};

// Contribution weights for engagement score
const ENGAGEMENT_WEIGHTS = {
  comments: 0.3,
  shares: 0.25,
  reactions: 0.2,
  matchAttendance: 0.15,
  galleries: 0.1,
};

/**
 * Get or create fan profile for a user
 */
export async function getOrCreateFanProfile(emailOrId: string): Promise<IFan> {
  await connectDB();

  const filter = slugIdFilters(emailOrId);

  const user = await UserModel.findOne(filter);

  let fan = await FanModel.findOne({ user: user._id.toString() }).populate(
    "user",
    "name email avatar",
  );

  console.log(fan)
  if (!fan) {
    // Create new fan profile
    fan = await FanModel.create({
      user: user._id,
      points: 0,
      badges: [],
      engagementScore: 0,
      contributions: {
        comments: 0,
        shares: 0,
        reactions: 0,
        matchAttendance: 0,
        galleries: 0,
        newsViews: 0,
      },
      fanSince: new Date(),
      lastActive: new Date(),
      isActive: true,
      preferences: {
        notifications: true,
      },
    });

    // Link fan profile to user
    await UserModel.findByIdAndUpdate(user._id, { fanProfile: fan._id });
  }

  return fan;
}

/**
 * Get fan profile by fan ID
 */
export async function getFanById(fanId: string): Promise<IFan | null> {
  await connectDB();
  return FanModel.findById(fanId)
    .populate("user", "name email avatar role ")
    .lean();
}

/**
 * Update fan points based on action
 */
export async function updateFanPoints(
  emailOrId: string,
  action: FanAction,
  isRemoval: boolean = false,
): Promise<IFan | null> {
  await connectDB();

  const fan = await getOrCreateFanProfile(emailOrId);
  const points = POINTS_MAP[action];
  const pointsChange = isRemoval ? -points : points;

  // Build update object
  const updateData: any = {
    $inc: {
      points: pointsChange,
      [`contributions.${action}s`]: isRemoval ? -1 : 1,
    },
    $set: { lastActive: new Date() },
  };

  // Ensure points never go negative
  if (pointsChange < 0) {
    updateData.$max = { points: 0 };
  }

  const updatedFan = await FanModel.findByIdAndUpdate(fan._id, updateData, {
    new: true,
  });

  if (updatedFan) {
    // Update engagement score
    await updateEngagementScore(fan._id.toString());

    // Check and award badges
    await checkAndAwardBadges(fan._id.toString());

    // Update user rank
    await updateUserRank(fan._id.toString());
  }

  return updatedFan;
}

/**
 * Update engagement score based on contributions
 */
export async function updateEngagementScore(fanId: string): Promise<void> {
  const fan = await FanModel.findById(fanId);
  if (!fan) return;

  const { contributions } = fan;
  let score = 0;

  // Comments scoring
  if (contributions.comments >= 200) {
    score += ENGAGEMENT_WEIGHTS.comments * 100;
  } else if (contributions.comments >= 100) {
    score += ENGAGEMENT_WEIGHTS.comments * 85;
  } else if (contributions.comments >= 50) {
    score += ENGAGEMENT_WEIGHTS.comments * 70;
  } else if (contributions.comments >= 20) {
    score += ENGAGEMENT_WEIGHTS.comments * 50;
  } else if (contributions.comments >= 10) {
    score += ENGAGEMENT_WEIGHTS.comments * 30;
  } else if (contributions.comments >= 5) {
    score += ENGAGEMENT_WEIGHTS.comments * 15;
  } else if (contributions.comments >= 1) {
    score += ENGAGEMENT_WEIGHTS.comments * 5;
  }

  // Shares scoring
  if (contributions.shares >= 100) {
    score += ENGAGEMENT_WEIGHTS.shares * 100;
  } else if (contributions.shares >= 50) {
    score += ENGAGEMENT_WEIGHTS.shares * 85;
  } else if (contributions.shares >= 25) {
    score += ENGAGEMENT_WEIGHTS.shares * 70;
  } else if (contributions.shares >= 10) {
    score += ENGAGEMENT_WEIGHTS.shares * 50;
  } else if (contributions.shares >= 5) {
    score += ENGAGEMENT_WEIGHTS.shares * 30;
  } else if (contributions.shares >= 2) {
    score += ENGAGEMENT_WEIGHTS.shares * 15;
  } else if (contributions.shares >= 1) {
    score += ENGAGEMENT_WEIGHTS.shares * 5;
  }

  // Reactions scoring
  if (contributions.reactions >= 500) {
    score += ENGAGEMENT_WEIGHTS.reactions * 100;
  } else if (contributions.reactions >= 200) {
    score += ENGAGEMENT_WEIGHTS.reactions * 85;
  } else if (contributions.reactions >= 100) {
    score += ENGAGEMENT_WEIGHTS.reactions * 70;
  } else if (contributions.reactions >= 50) {
    score += ENGAGEMENT_WEIGHTS.reactions * 50;
  } else if (contributions.reactions >= 25) {
    score += ENGAGEMENT_WEIGHTS.reactions * 30;
  } else if (contributions.reactions >= 10) {
    score += ENGAGEMENT_WEIGHTS.reactions * 15;
  } else if (contributions.reactions >= 1) {
    score += ENGAGEMENT_WEIGHTS.reactions * 5;
  }

  // Match attendance scoring
  if (contributions.matchAttendance >= 30) {
    score += ENGAGEMENT_WEIGHTS.matchAttendance * 100;
  } else if (contributions.matchAttendance >= 20) {
    score += ENGAGEMENT_WEIGHTS.matchAttendance * 85;
  } else if (contributions.matchAttendance >= 15) {
    score += ENGAGEMENT_WEIGHTS.matchAttendance * 70;
  } else if (contributions.matchAttendance >= 10) {
    score += ENGAGEMENT_WEIGHTS.matchAttendance * 50;
  } else if (contributions.matchAttendance >= 5) {
    score += ENGAGEMENT_WEIGHTS.matchAttendance * 30;
  } else if (contributions.matchAttendance >= 3) {
    score += ENGAGEMENT_WEIGHTS.matchAttendance * 15;
  } else if (contributions.matchAttendance >= 1) {
    score += ENGAGEMENT_WEIGHTS.matchAttendance * 5;
  }

  // Galleries scoring
  if (contributions.galleries >= 20) {
    score += ENGAGEMENT_WEIGHTS.galleries * 100;
  } else if (contributions.galleries >= 10) {
    score += ENGAGEMENT_WEIGHTS.galleries * 85;
  } else if (contributions.galleries >= 5) {
    score += ENGAGEMENT_WEIGHTS.galleries * 70;
  } else if (contributions.galleries >= 3) {
    score += ENGAGEMENT_WEIGHTS.galleries * 50;
  } else if (contributions.galleries >= 2) {
    score += ENGAGEMENT_WEIGHTS.galleries * 30;
  } else if (contributions.galleries >= 1) {
    score += ENGAGEMENT_WEIGHTS.galleries * 15;
  }

  // Round to 2 decimal places and ensure within 0-100
  const finalScore = Math.min(100, Math.max(0, Math.round(score * 10) / 10));

  await FanModel.findByIdAndUpdate(fanId, {
    engagementScore: finalScore,
  });
}

/**
 * Check and award badges based on achievements
 */
export async function checkAndAwardBadges(fanId: string): Promise<EFanBadge[]> {
  const fan = await FanModel.findById(fanId);
  if (!fan) return [];

  const newBadges: EFanBadge[] = [];
  const currentBadges = new Set(fan.badges);
  const daysSinceJoin = Math.floor(
    (Date.now() - new Date(fan.fanSince).getTime()) / (1000 * 60 * 60 * 24),
  );

  // Super Fan badge (1000+ points)
  if (
    fan.points >= BADGE_THRESHOLDS[EFanBadge.SUPER_FAN] &&
    !currentBadges.has(EFanBadge.SUPER_FAN)
  ) {
    newBadges.push(EFanBadge.SUPER_FAN);
  }

  // Comment Champion badge (100+ comments)
  if (
    fan.contributions.comments >=
      BADGE_THRESHOLDS[EFanBadge.COMMENT_CHAMPION] &&
    !currentBadges.has(EFanBadge.COMMENT_CHAMPION)
  ) {
    newBadges.push(EFanBadge.COMMENT_CHAMPION);
  }

  // Match Day Regular badge (10+ matches)
  if (
    fan.contributions.matchAttendance >=
      BADGE_THRESHOLDS[EFanBadge.MATCH_DAY_REGULAR] &&
    !currentBadges.has(EFanBadge.MATCH_DAY_REGULAR)
  ) {
    newBadges.push(EFanBadge.MATCH_DAY_REGULAR);
  }

  // Social Butterfly badge (50+ shares)
  if (
    fan.contributions.shares >= BADGE_THRESHOLDS[EFanBadge.SOCIAL_BUTTERFLY] &&
    !currentBadges.has(EFanBadge.SOCIAL_BUTTERFLY)
  ) {
    newBadges.push(EFanBadge.SOCIAL_BUTTERFLY);
  }

  // Reaction Master badge (200+ reactions)
  if (
    fan.contributions.reactions >=
      BADGE_THRESHOLDS[EFanBadge.REACTION_MASTER] &&
    !currentBadges.has(EFanBadge.REACTION_MASTER)
  ) {
    newBadges.push(EFanBadge.REACTION_MASTER);
  }

  // Gallery Contributor badge (5+ galleries)
  if (
    fan.contributions.galleries >=
      BADGE_THRESHOLDS[EFanBadge.GALLERY_CONTRIBUTOR] &&
    !currentBadges.has(EFanBadge.GALLERY_CONTRIBUTOR)
  ) {
    newBadges.push(EFanBadge.GALLERY_CONTRIBUTOR);
  }

  // Early Bird badge (joined within first 30 days)
  if (
    daysSinceJoin <= BADGE_THRESHOLDS[EFanBadge.EARLY_BIRD] &&
    !currentBadges.has(EFanBadge.EARLY_BIRD)
  ) {
    newBadges.push(EFanBadge.EARLY_BIRD);
  }

  // Dedicated Fan badge (active for 1+ year)
  if (
    daysSinceJoin >= BADGE_THRESHOLDS[EFanBadge.DEDICATED_FAN] &&
    !currentBadges.has(EFanBadge.DEDICATED_FAN)
  ) {
    newBadges.push(EFanBadge.DEDICATED_FAN);
  }

  if (newBadges.length > 0) {
    await FanModel.findByIdAndUpdate(fanId, {
      $addToSet: { badges: { $each: newBadges } },
    });
  }

  return newBadges;
}

/**
 * Update user's global rank based on points
 */
export async function updateUserRank(fanId: string): Promise<number | null> {
  const fan = await FanModel.findById(fanId);
  if (!fan) return null;

  // Count how many fans have more points
  const higherRankCount = await FanModel.countDocuments({
    points: { $gt: fan.points },
    isActive: true,
  });

  const rank = higherRankCount + 1;

  await FanModel.findByIdAndUpdate(fanId, { rank });

  return rank;
}

/**
 * Get fan leaderboard
 */
export async function getFanLeaderboard(
  limit: number = 50,
  sortBy: "points" | "engagementScore" = "points",
): Promise<Array<IFanLeaderboardEntry>> {
  await connectDB();

  const fans = await FanModel.find({ isActive: true })
    .sort({ [sortBy]: -1 })
    .limit(limit)
    .populate("user", "name email avatar")
    .lean();

  return fans.map((fan, index) => ({
    rank: index + 1,
    user: fan.user as any,
    points: fan.points,
    engagementScore: fan.engagementScore,
    badges: fan.badges as EFanBadge[],
    contributions: fan.contributions,
    fanSince: fan.fanSince,
  }));
}

/**
 * Get fan statistics
 */
export async function getFanStats(): Promise<{
  totalFans: number;
  totalPoints: number;
  averagePoints: number;
  averageEngagement: number;
  topFans: Array<{
    _id: string;
    userId: {
      name: string;
      avatar?: string;
    };
    points: number;
    badges: EFanBadge[];
  }>;
  badgeDistribution: Record<EFanBadge, number>;
}> {
  await connectDB();

  const [totalFans, totalPointsAgg, avgEngagementAgg, topFans, allFans] =
    await Promise.all([
      FanModel.countDocuments({ isActive: true }),
      FanModel.aggregate([
        { $group: { _id: null, total: { $sum: "$points" } } },
      ]),
      FanModel.aggregate([
        { $group: { _id: null, avg: { $avg: "$engagementScore" } } },
      ]),
      FanModel.find({ isActive: true })
        .sort({ points: -1 })
        .limit(5)
        .populate("user", "name avatar email")
        .lean(),
      FanModel.find({ isActive: true }).lean(),
    ]);

  // Calculate badge distribution
  const badgeDistribution: Record<EFanBadge, number> = {
    [EFanBadge.SUPER_FAN]: 0,
    [EFanBadge.COMMENT_CHAMPION]: 0,
    [EFanBadge.MATCH_DAY_REGULAR]: 0,
    [EFanBadge.SOCIAL_BUTTERFLY]: 0,
    [EFanBadge.REACTION_MASTER]: 0,
    [EFanBadge.GALLERY_CONTRIBUTOR]: 0,
    [EFanBadge.EARLY_BIRD]: 0,
    [EFanBadge.DEDICATED_FAN]: 0,
  };

  for (const fan of allFans) {
    for (const badge of fan.badges) {
      badgeDistribution[badge as EFanBadge]++;
    }
  }

  const totalPoints = totalPointsAgg[0]?.total || 0;
  const totalFansCount = totalFans || 1;

  return {
    totalFans,
    totalPoints,
    averagePoints: Math.round(totalPoints / totalFansCount),
    averageEngagement: Math.round(avgEngagementAgg[0]?.avg || 0),
    topFans: topFans.map((fan) => ({
      _id: fan._id,
      userId: fan.userId as any,
      points: fan.points,
      badges: fan.badges as EFanBadge[],
    })),
    badgeDistribution,
  };
}

/**
 * Get fan points history (activity feed)
 */
export async function getFanPointsHistory(
  userId: string,
  limit: number = 20,
): Promise<
  Array<{
    action: FanAction;
    points: number;
    date: Date;
    newsId?: string;
    matchId?: string;
  }>
> {
  await connectDB();

  // This would typically come from a separate collection that logs all point transactions
  // For now, we'll return an empty array - you can implement this later
  // You would need a FanTransaction model to track individual point changes

  return [];
}

/**
 * Get user's fan rank and progress to next badge
 */
export async function getUserFanProgress(userEmailOrId: string): Promise<{
  currentPoints: number;
  currentRank: number;
  nextBadge: EFanBadge | null;
  pointsToNextBadge: number;
  progressPercentage: number;
  badges: EFanBadge[];
}> {
  await connectDB();

  const fan = await getOrCreateFanProfile(userEmailOrId);

  // Get user rank
  const higherRankCount = await FanModel.countDocuments({
    points: { $gt: fan.points },
    isActive: true,
  });
  const currentRank = higherRankCount + 1;

  // Find next badge to achieve
  let nextBadge: EFanBadge | null = null;
  let pointsToNextBadge = Infinity;

  // Sort badges by threshold (lowest to highest)
  const sortedBadges = Object.entries(BADGE_THRESHOLDS).sort(
    ([, a], [, b]) => (a as number) - (b as number),
  );

  for (const [badge, threshold] of sortedBadges) {
    if (
      !fan.badges.includes(badge as EFanBadge) &&
      fan.points < (threshold as number)
    ) {
      nextBadge = badge as EFanBadge;
      pointsToNextBadge = (threshold as number) - fan.points;
      break;
    }
  }

  const progressPercentage = nextBadge
    ? (fan.points / (fan.points + pointsToNextBadge)) * 100
    : 100;

  return {
    currentPoints: fan.points,
    currentRank,
    nextBadge,
    pointsToNextBadge: Math.max(0, pointsToNextBadge),
    progressPercentage: Math.min(100, progressPercentage),
    badges: fan.badges as EFanBadge[],
  };
}

/**
 * Bulk update points for multiple users (e.g., after a match)
 */
export async function bulkUpdateFanPoints(
  updates: Array<{ userEmailOrId: string; action: FanAction }>,
): Promise<{ successful: number; failed: number }> {
  let successful = 0;
  let failed = 0;

  for (const update of updates) {
    try {
      await updateFanPoints(update.userEmailOrId, update.action);
      successful++;
    } catch (error) {
      console.error(
        `Failed to update points for user ${update.userEmailOrId}:`,
        error,
      );
      failed++;
    }
  }

  return { successful, failed };
}

/**
 * Remove inactive fans (optional cleanup job)
 */
export async function deactivateInactiveFans(
  daysInactive: number = 90,
): Promise<number> {
  await connectDB();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

  const result = await FanModel.updateMany(
    {
      lastActive: { $lt: cutoffDate },
      isActive: true,
    },
    { $set: { isActive: false } },
  );

  return result.modifiedCount;
}

/**
 * Reset fan points (admin only - use with caution)
 */
export async function resetFanPoints(emailOrId: string): Promise<IFan | null> {
  await connectDB();

  const filter = slugIdFilters(emailOrId);

  const user = await UserModel.findOne(filter);

  const fan = await FanModel.findOneAndUpdate(
    { user: user?._id },
    {
      $set: {
        points: 0,
        badges: [],
        engagementScore: 0,
        contributions: {
          comments: 0,
          shares: 0,
          reactions: 0,
          matchAttendance: 0,
          galleries: 0,
          newsViews: 0,
        },
      },
      $setOnInsert: {
        fanSince: new Date(),
        lastActive: new Date(),
        isActive: true,
      },
    },
    { new: true, upsert: true },
  );

  return fan;
}

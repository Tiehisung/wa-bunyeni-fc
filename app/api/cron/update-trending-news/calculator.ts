import connectDB from "@/config/db.config";
import NewsModel from "@/models/news";

interface TrendingScoreConfig {
    viewWeight: number;
    likeWeight: number;
    commentWeight: number;
    shareWeight: number;
    timeDecayFactor: number;
    hoursToConsider: number;
}

const DEFAULT_CONFIG: TrendingScoreConfig = {
    viewWeight: 0.5,
    likeWeight: 2,
    commentWeight: 3,
    shareWeight: 4,
    timeDecayFactor: 0.5,
    hoursToConsider: 72,
    
};

/**
 * Calculate trending score for a single news item
 */
export function calculateTrendingScore(
    stats: { viewCount: number; likeCount: number; commentCount: number; shareCount: number },
    createdAt: Date,
    config: TrendingScoreConfig = DEFAULT_CONFIG
): number {
    const { viewWeight, likeWeight, commentWeight, shareWeight, timeDecayFactor, hoursToConsider } = config;

    // 1. Raw engagement score
    const engagementScore =
        (stats.viewCount * viewWeight) +
        (stats.likeCount * likeWeight) +
        (stats.commentCount * commentWeight) +
        (stats.shareCount * shareWeight);

    // 2. Time decay (newer content gets higher score)
    const ageInHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    let timeDecay = 1;

    if (ageInHours > hoursToConsider) {
        timeDecay = Math.max(0, 1 - (ageInHours - hoursToConsider) * timeDecayFactor / 100);
    } else {
        timeDecay = 1 + (hoursToConsider - ageInHours) * 0.02;
    }

    // 3. Velocity bonus
    const velocityBonus = Math.min(2, (stats.likeCount + stats.commentCount) / 50);

    // Final score
    const trendingScore = engagementScore * timeDecay * (1 + velocityBonus);

    return Math.round(trendingScore * 100) / 100;
}

/**
 * Update trending scores for all news items
 */
export async function updateAllTrendingScores(config: TrendingScoreConfig = DEFAULT_CONFIG) {
    await connectDB();

    const newsItems = await NewsModel.find({ isPublished: true }).lean();

    const updates = newsItems.map(item => {
        const trendingScore = calculateTrendingScore(
            {
                viewCount: item.stats?.viewCount || 0,
                likeCount: item.stats?.likeCount || 0,
                commentCount: item.stats?.commentCount || 0,
                shareCount: item.stats?.shareCount || 0,
            },
            item.createdAt || new Date(),
            config
        );

        return {
            updateOne: {
                filter: { _id: item._id },
                update: {
                    $set: {
                        'stats.trendingScore': trendingScore,
                        'stats.lastTrendingUpdate': new Date(),
                    }
                }
            }
        };
    });

    if (updates.length > 0) {
        await NewsModel.bulkWrite(updates);
        console.log(`✅ Updated trending scores for ${updates.length} news items`);
    }

    return updates.length;
}

/**
 * Get trending news
 */
export async function getTrendingNews(limit: number = 10) {
    await connectDB();

    const trendingNews = await NewsModel.find({
        isPublished: true,
        'stats.trendingScore': { $gt: 0 }
    })
        .sort({ 'stats.trendingScore': -1 })
        .limit(limit)
 

    return trendingNews;
}
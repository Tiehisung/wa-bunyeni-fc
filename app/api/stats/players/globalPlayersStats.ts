import { IPlayer } from "@/types/player.interface";
import PlayerModel from "@/models/player";

export async function getGlobalPlayersStats() {
    // Fetch all players once (best performance)
    const players = await PlayerModel.find({ isCurrentPlayer: true }).lean() as unknown as IPlayer[];

    const totalPlayers = players.length;
    const activePlayers = players.filter(p => p.isCurrentPlayer).length;
    const inactivePlayers = totalPlayers - activePlayers;

    // Injuries
    const totalInjuries = players.reduce(
        (sum, p) => sum + (p.injuries?.length || 0),
        0
    );

    const playersWithInjuries = players.filter(p => (p.injuries?.length || 0) > 0)
        .length;

    // Goals, Assists, Matches
    const totalGoals = players.reduce(
        (sum, p) => sum + (p.goals?.length || 0),
        0
    );

    const totalAssists = players.reduce(
        (sum, p) => sum + (p.assists?.length || 0),
        0
    );

    const totalMatchesPlayed = players.reduce(
        (sum, p) => sum + (p.matches?.length || 0),
        0
    );

    // Averages
    const avgGoals = totalPlayers ? totalGoals / totalPlayers : 0;
    const avgAssists = totalPlayers ? totalAssists / totalPlayers : 0;
    const avgMatches = totalPlayers ? totalMatchesPlayed / totalPlayers : 0;

    // Player performance ranking
    const ranked = players
        .map((p) => {
            const g = p.goals?.length || 0;
            const a = p.assists?.length || 0;
            const ratings = p.ratings?.map(r => r.rating) || [];
            const ratingAvg =
                ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0;

            const score = g * 4 + a * 3 + ratingAvg * 2;

            return {
                _id: p._id,
                name: `${p.firstName} ${p.lastName}`,
                avatar: p.avatar,
                number: p.number,
                position: p.position,
                goals: g,
                assists: a,
                matches: p.matches?.length || 0,
                ratingAvg,
                performanceScore: score,
            };
        })
        .sort((a, b) => b.performanceScore - a.performanceScore);

    const topPerformers = ranked.slice(0, 10);

    // Insights
    const insights = {
        averagePerformanceScore: ranked.length
            ? ranked.reduce((s, p) => s + p.performanceScore, 0) / ranked.length
            : 0,

        mostInjuredPlayer: players
            .map(p => ({ name: `${p.firstName} ${p.lastName}`, injuries: p.injuries?.length || 0 }))
            .sort((a, b) => b.injuries - a.injuries)[0] ?? null,

        highestScorer: ranked.sort((a, b) => b.goals - a.goals)[0] ?? null,
        topAssist: ranked.sort((a, b) => b.assists - a.assists)[0] ?? null,
        mostActive: ranked.sort((a, b) => b.matches - a.matches)[0] ?? null,
    };

    return {
        totals: {
            totalPlayers,
            activePlayers,
            inactivePlayers,
            totalInjuries,
            playersWithInjuries,
        },
        averages: {
            avgGoals,
            avgAssists,
            avgMatches,
        },
        topPerformers,
        insights,
    };
}

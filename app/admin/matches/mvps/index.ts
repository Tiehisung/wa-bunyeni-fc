import { IMVP } from "@/types/mvp.interface";

interface IPlayerStats {
    player: IMVP['player'];
    total: number;
    mvps: IMVP[];
}

interface IComputeResult {
    total: number;
    leaderboard: IPlayerStats[];
    playersWithMost: IPlayerStats[];
    playersWithLeast: IPlayerStats[];
}

export const computeMVPs = (mvpsData?: IMVP[]): IComputeResult => {
    // Guard clause for empty or invalid data
    if (!mvpsData?.length) {
        return {
            total: 0,
            leaderboard: [],
            playersWithMost: [],
            playersWithLeast: []
        };
    }

    // 1. Group MVPs by player using Map for O(1) lookups
    const playerMap = new Map<string, IMVP[]>();

    for (const mvp of mvpsData) {
        const playerId = mvp.player._id;
        if (!playerMap.has(playerId)) {
            playerMap.set(playerId, []);
        }
        playerMap.get(playerId)!.push(mvp);
    }

    // 2. Convert to stats array
    const stats: IPlayerStats[] = Array.from(playerMap.entries()).map(([_, mvps]) => ({
        player: mvps[0].player,
        total: mvps.length,
        mvps
    }));

    // 3. Sort stats by total (descending for leaderboard)
    const sortedStats = [...stats].sort((a, b) => b.total - a.total);
    const sortedStatsAsc = [...stats].sort((a, b) => a.total - b.total);

    // 5. Identify players with most/least MVPs
    const maxMvpCount = sortedStats[0]?.total || 0;
    const minMvpCount = sortedStatsAsc[0]?.total || 0;

    const playersWithMost = sortedStats.filter(player => player.total === maxMvpCount);
    const playersWithLeast = sortedStatsAsc.filter(player => player.total === minMvpCount);




    return {
        total: mvpsData.length,
        leaderboard: sortedStats,
        playersWithMost,
        playersWithLeast
    };
};


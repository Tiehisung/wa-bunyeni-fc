
import { EMatchResult, IGoal, ITeam } from "./match.interface"
import { IPlayerMini } from "./player.interface";
export interface IPlayersOverviewMetrics {
    total: number;
    byPosition: {
        _id: string;      // e.g., "forward", "midfielder", "defender"
        count: number;
    }[];
    topScorers: {
        _id: string;
        number: string;   // jersey number as string
        position: string;
        goalCount?: number;    // for topScorers
        assistCount?: number;  // for topAssists
        name: string;
    }[];
    topAssists: {
        _id: string;
        number: string;   // jersey number as string
        position: string;
        goalCount?: number;    // for topScorers
        assistCount?: number;  // for topAssists
        name: string;
    }[];

};

export interface IDashboardMetrics {
    activePlayers: number

    matchStats: {
        wins: number;
        draws: number;
        losses: number;
        totalMatches: number;
        winRate: string;
        goalsScored: number;
        goalsConceded: number;
        goalDifference: number;
        recentForm: {
            result: EMatchResult
            scoreline: string;
            opponent: ITeam;
        }[];
    }
}
export interface ISeasonMetrics {
    [key: string]: any
}
export interface IHeadToHeadMetrics {
    opponent: ITeam
    totalMatches: number,
    wins: number,
    draws: number,
    losses: number,
    winRate: string,
    goalsScored: number,
    goalsConceded: number,
    goalDifference: number,
    matches: {
        teamGoals: IGoal[],
        opponentGoals: IGoal[]
        teamScore: number,
        opponentScore: number,
        scoreline: string //"1 - 1",
        result: EMatchResult,
        date: string,
        isHome: true
    }[]
}

export interface IPlayerMetrics {
    player: IPlayerMini
    stats: {
        goals: number,
        assists: number,
        goalContributions: number,
        cards: {
            yellow: number,
            red: number,
            total: number
        },
        injuries: number,
        mvps: number,
        appearances: number
    }
}
export interface ITrendMetrics {
    [key: string]: any
}


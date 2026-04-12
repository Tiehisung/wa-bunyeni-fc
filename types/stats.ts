import { ICard } from "./card.interface";
import { IInjury } from "./injury.interface";
import { IGoal, IMatch } from "./match.interface";

export interface IPlayerStats {
    _id: string;
    name: string;
    avatar: string;
    number: string;
    goals: IGoal[];
    assists: IGoal[];
    matches: IMatch[];
    ratingAvg: number;
    performanceScore: number;
    position?: string;

    injuries: IInjury[];
    cards: ICard[];
    ratings: {
        match: string;
        rating: number;
    }[];
}

export interface IMatchStats {
    wins: number,
    draws: number,
    losses: number,
    goalsFor: number,
    goalsAgainst: number,
    goalDifference: number,
    totalMatches: number,
    winRate: number,
}

export interface IPlayerPerformanceStatsItem {
    _id: string;
    name: string;
    avatar: string;
    number: string;
    goals: number;
    assists: number;
    matches: number;
    ratingAvg: number;
    performanceScore: number;
    position?: string;
}

export interface IPlayInsights {
    averagePerformanceScore: number;

    mostInjuredPlayer: {
        name: string;
        injuries: number;
    };

    highestScorer: IPlayerPerformanceStatsItem;

    topAssist: IPlayerPerformanceStatsItem;

    mostActive: IPlayerPerformanceStatsItem;
}

export interface IPlayersStats {
    totals: {
        totalPlayers: number;
        activePlayers: number;
        inactivePlayers: number;
        totalInjuries: number;
        playersWithInjuries: number;
    };

    averages: {
        avgGoals: number;
        avgAssists: number;
        avgMatches: number;
    };

    topPerformers: IPlayerPerformanceStatsItem[];

    insights: IPlayInsights;
}

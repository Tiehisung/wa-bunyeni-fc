

import { TEAM } from "@/data/team";
import { IGoal, IMatch, IMatchMetrics } from "@/types/match.interface";

export const checkTeams = (match?: IMatch) => {

    if (match?.isHome) {
        return { home: TEAM, away: match?.opponent }
    }
    return {
        home: match?.opponent,
        away: TEAM,
    }
};
export const splitGoals = (goals: IGoal[]) => {
    return {
        teamGoals: goals.filter(g => g.teamId == TEAM._id),
        opponentGoals: goals.filter(g => g.teamId !== TEAM._id),
    };
};
export const checkMatchMetrics = (match?: IMatch ): IMatchMetrics => {
    const { teamGoals, opponentGoals } = splitGoals(match?.goals||[]);
 
    const status = teamGoals?.length < opponentGoals?.length ? 'loss' : teamGoals?.length > opponentGoals.length ? 'win' : 'draw'
    const { home, away } = checkTeams(match)

    const goals = match?.isHome
        ? { home: teamGoals.length, away: opponentGoals.length }
        : { home: opponentGoals.length, away: teamGoals.length }

    return {
        goals: { teamGoals, opponentGoals, ...goals },
        winStatus: status,
        teams: { home, away }
    }
};


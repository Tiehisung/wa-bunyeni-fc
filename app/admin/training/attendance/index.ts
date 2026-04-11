 
import { IPlayerMini } from "@/types/player.interface";
import { ITrainingSession } from "./page";


export interface IPlayerStanding extends IPlayerMini {
    attendedCount: number;
    totalSessions: number;
    attendancePercentage: number;
}

/**
 * Transforms an array of training sessions into player attendance standings.
 */
export function computeAttendanceStandings(
    sessions: ITrainingSession[]
): IPlayerStanding[] {
    if (!sessions || sessions.length === 0) return [];

    const playerStats = new Map<string, IPlayerStanding>();
    const totalSessions = sessions.length;

    for (const session of sessions) {
        // Ensure attendance data exists
        const { allPlayers = [], attendedBy = [] } = session.attendance || {};

        // Register all players (ensures every player gets a record even if absent)
        for (const player of allPlayers) {
            if (!playerStats.has(player._id)) {
                playerStats.set(player._id, {
                    ...player,
                    attendedCount: 0,
                    totalSessions,
                    attendancePercentage: 0,
                });
            }
        }

        // Mark attended players
        for (const attendee of attendedBy) {
            const record = playerStats.get(attendee._id);
            if (record) record.attendedCount += 1;
        }
    }

    // Compute attendance percentages
    for (const record of playerStats.values()) {
        record.attendancePercentage = parseFloat(
            ((record.attendedCount / record.totalSessions) * 100).toFixed(2)
        );
    }

    // Return sorted standings
    return Array.from(playerStats.values()).sort(
        (a, b) => b.attendancePercentage - a.attendancePercentage
    );
}

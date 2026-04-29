// match.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { EMatchStatus, IMatch, IMatchEvent } from "@/types/match.interface";
import type { IMatchStats } from "@/types/stats";

const matchApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all matches with filtering, pagination
        getMatches: builder.query<IQueryResponse<IMatch[]>, {
            page?: number;
            limit?: number;
            season?: string;
            team?: string;
            status?: EMatchStatus
            fromDate?: string;
            toDate?: string;
            venue?: string;
            sortBy?: string;
        }>({
            query: (params) => ({
                url: "/matches",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    season: params?.season,
                    team: params?.team,
                    status: params?.status,
                    fromDate: params?.fromDate,
                    toDate: params?.toDate,
                    venue: params?.venue,
                    sortBy: params?.sortBy || '-date',
                },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Matches' as const, id: _id })),
                        { type: 'Matches', id: 'LIST' },
                    ]
                    : [{ type: 'Matches', id: 'LIST' }],
        }),

        // GET match by slug or ID
        getMatch: builder.query<IQueryResponse<IMatch>, string>({
            query: (slugOrId) => `/matches/${slugOrId}`,
            providesTags: (_result, _error, slugOrId) => [{ type: 'Matches', id: slugOrId }],
        }),

        // GET upcoming matches
        getUpcomingMatches: builder.query<IQueryResponse<IMatch[]>, {
            limit?: number;
            team?: string;
            tournament?: string;
            days?: number; // Next X days
        }>({
            query: (params) => ({
                url: "/matches/upcoming",
                params: {
                    limit: params?.limit || 10,
                    team: params?.team,
                    tournament: params?.tournament,
                    days: params?.days || 30,
                },
            }),
            providesTags: [{ type: 'Matches', id: 'UPCOMING' }],
        }),

        // GET recent matches
        getRecentMatches: builder.query<IQueryResponse<IMatch[]>, {
            limit?: number;
            team?: string;
            tournament?: string;
        }>({
            query: (params) => ({
                url: "/matches/recent",
                params: {
                    limit: params?.limit || 10,
                    team: params?.team,
                    tournament: params?.tournament,
                },
            }),
            providesTags: [{ type: 'Matches', id: 'RECENT' }],
        }),



        // GET matches by team
        getMatchesByTeam: builder.query<IQueryResponse<IMatch[]>, {
            teamId: string;
            page?: number;
            limit?: number;
            season?: string;
            status?: string;
        }>({
            query: ({ teamId, page, limit, season, status }) => ({
                url: `/matches/team/${teamId}`,
                params: { page, limit, season, status },
            }),
            providesTags: (result, _error, data) => {
                const tags = [];

                // Add individual match tags
                if (result?.data) {
                    tags.push(
                        ...result.data.map(({ _id }) => ({
                            type: 'Matches' as const,
                            id: _id
                        }))
                    );
                }

                // Add team-specific tag
                tags.push({
                    type: 'Matches' as const,
                    id: `TEAM_${data.teamId}`
                });

                return tags;
            }
        }),

        // GET live match (current live match if any)
        getLiveMatch: builder.query<IQueryResponse<IMatch | null>, {
            tournament?: string;
            team?: string;
        }>({
            query: (params) => ({
                url: "/matches/live",
                params,
            }),
            providesTags: [{ type: 'Matches', id: 'LIVE' }],
            // Polling for live updates (can be set in component)
        }),

        // GET match statistics
        getMatchStats: builder.query<IQueryResponse<IMatchStats>, string>({
            query: (matchId) => `/matches/${matchId}/stats`,
            providesTags: (_result, _error, matchId) => [
                { type: 'Matches', id: `STATS_${matchId}` },
            ],
        }),

        // GET match timeline/events
        getMatchTimeline: builder.query<IQueryResponse<IMatchEvent[]>, string>({
            query: (matchId) => `/matches/${matchId}/timeline`,
            providesTags: (_result, _error, matchId) => [
                { type: 'Matches', id: `TIMELINE_${matchId}` },
            ],
        }),

        // GET head-to-head stats between two teams
        getHeadToHead: builder.query<IQueryResponse<{
            totalMatches: number;
            team1Wins: number;
            team2Wins: number;
            draws: number;
            team1Goals: number;
            team2Goals: number;
            recentMatches: IMatch[];
        }>, { team1Id: string; team2Id: string; limit?: number }>({
            query: ({ team1Id, team2Id, limit }) => ({
                url: `/matches/h2h/${team1Id}/${team2Id}`,
                params: { limit: limit || 5 },
            }),
            providesTags: (_result, _error, { team1Id, team2Id }) => [
                { type: 'Matches', id: `H2H_${team1Id}_${team2Id}` },
            ],
        }),

        // CREATE match
        createMatch: builder.mutation<IQueryResponse<IMatch>, Partial<IMatch>>({
            query: (body) => ({
                url: "/matches",
                method: "POST",
                body,
            }),
            invalidatesTags: [
                { type: 'Matches', id: 'LIST' },// Tag the list itself
                { type: 'Matches', id: 'UPCOMING' },

            ],
        }),

        // UPDATE match (full update - PUT)
        updateMatch: builder.mutation<IQueryResponse<IMatch>, Partial<IMatch>>({
            query: ({ _id, ...body }) => ({
                url: `/matches/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ['Matches'],
        }),

        // PATCH match (partial update)
        patchMatch: builder.mutation<IQueryResponse<IMatch>, { id: string; body: Partial<IMatch> }>({
            query: ({ id, body }) => ({
                url: `/matches/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Matches', id: 'LIST' },
                { type: 'Matches', id },
                { type: 'Matches', id: 'UPCOMING' },
                { type: 'Matches', id: 'RECENT' },
                { type: 'Matches', id: `STATS_${id}` },
                { type: 'Matches', id: `TIMELINE_${id}` },
            ],
        }),

        // UPDATE match status (scheduled, live, completed, cancelled)
        updateMatchStatus: builder.mutation<IQueryResponse<IMatch>, {
            _id: string;
            status: EMatchStatus;
        }>({
            query: ({ _id, status, }) => ({
                url: `/matches/${_id}/status`,
                method: "PATCH",
                body: { status, },
            }),
            invalidatesTags: (_result, _error, { _id }) => [
                { type: 'Matches', id: 'LIST' },
                { type: 'Matches', id: _id },
                { type: 'Matches', id: 'UPCOMING' },
                { type: 'Matches', id: 'LIVE' },
            ],
        }),

        // UPDATE match result
        updateMatchResult: builder.mutation<IQueryResponse<IMatch>, {
            id: string;
            result: {
                homeScore: number;
                awayScore: number;
                homePenalty?: number;
                awayPenalty?: number;
                winner?: 'home' | 'away' | 'draw';
                method?: 'regular' | 'extra_time' | 'penalties';
            };
        }>({
            query: ({ id, result }) => ({
                url: `/matches/${id}/result`,
                method: "PATCH",
                body: result,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Matches', id: 'LIST' },
                { type: 'Matches', id },
                { type: 'Matches', id: 'RECENT' },
                { type: 'Matches', id: `STATS_${id}` },
                { type: 'Matches', id: `TIMELINE_${id}` },
                // Invalidate team and tournament stats
                { type: 'Teams', id: 'LIST' },
            ],
        }),

        // GO LIVE - start live match coverage
        goLiveMatch: builder.mutation<IQueryResponse<IMatch>, {
            matchId: string;
            commentators?: string[];
            venue?: string;
            weather?: {
                condition: string;
                temperature: number;
                humidity?: number;
            };
        }>({
            query: ({ matchId, ...body }) => ({
                url: `/matches/${matchId}/go-live`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { matchId }) => [
                { type: 'Matches', id: matchId },
                { type: 'Matches', id: 'LIVE' },
                { type: 'Matches', id: 'UPCOMING' },
                { type: 'Matches', id: `TIMELINE_${matchId}` },
            ],
        }),

        // UPDATE live match events (goals, cards, substitutions, etc.)
        updateLiveMatchEvents: builder.mutation<IQueryResponse<IMatch>, {
            matchId: string;
            event: {
                type: 'goal' | 'penalty' | 'own-goal' | 'yellow-card' | 'red-card' | 'substitution' | 'injury' | 'var' | 'half-start' | 'half-end' | 'full-time';
                minute: number;
                addedTime?: number;
                playerId?: string;
                playerName?: string;
                assistedBy?: string;
                team: 'home' | 'away';
                description?: string;
                varDecision?: string;
                inPlayer?: string; // Player substituted in
                outPlayer?: string; // Player substituted out
            };
        }>({
            query: ({ matchId, event }) => ({
                url: `/matches/${matchId}/live/events`,
                method: "POST",
                body: event,
            }),
            invalidatesTags: (_result, _error, { matchId }) => [
                { type: 'Matches', id: matchId },
                { type: 'Matches', id: 'LIVE' },
                { type: 'Matches', id: `TIMELINE_${matchId}` },
                { type: 'Matches', id: `STATS_${matchId}` },
            ],
        }),

        // BULK update live match events (for multiple events at once)
        bulkUpdateLiveEvents: builder.mutation<IQueryResponse<IMatch>, {
            matchId: string;
            events: Array<{
                type: string;
                minute: number;
                team: 'home' | 'away';
                // ... other event fields
            }>;
        }>({
            query: ({ matchId, events }) => ({
                url: `/matches/${matchId}/live/events/bulk`,
                method: "POST",
                body: { events },
            }),
            invalidatesTags: (_result, _error, { matchId }) => [
                { type: 'Matches', id: matchId },
                { type: 'Matches', id: 'LIVE' },
                { type: 'Matches', id: `TIMELINE_${matchId}` },
                { type: 'Matches', id: `STATS_${matchId}` },
            ],
        }),

        // UPDATE match minute (for live matches)
        updateMatchMinute: builder.mutation<IQueryResponse<IMatch>, {
            matchId: string;
            minute: number;
            addedTime?: number;
            status: 'first-half' | 'half-time' | 'second-half' | 'extra-time' | 'full-time';
        }>({
            query: ({ matchId, ...body }) => ({
                url: `/matches/${matchId}/live/minute`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { matchId }) => [
                { type: 'Matches', id: matchId },
                { type: 'Matches', id: 'LIVE' },
            ],
        }),

        // DELETE match
        deleteMatch: builder.mutation<IQueryResponse<IMatch>, string>({
            query: (matchId) => ({
                url: `/matches/${matchId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, matchId) => [
                { type: 'Matches', id: 'LIST' },
                { type: 'Matches', id: matchId },
                { type: 'Matches', id: 'UPCOMING' },
                { type: 'Matches', id: 'RECENT' },
                { type: 'Matches', id: 'SEASON_' },
                { type: 'Matches', id: 'TOURNAMENT_' },
                { type: 'Matches', id: 'TEAM_' },
            ],
        }),

        // BULK delete matches
        bulkDeleteMatches: builder.mutation<IQueryResponse<{ deletedCount: number }>, string[]>({
            query: (matchIds) => ({
                url: "/matches/bulk/delete",
                method: "POST",
                body: { matchIds },
            }),
            invalidatesTags: [
                { type: 'Matches', id: 'LIST' },
                { type: 'Matches', id: 'UPCOMING' },
                { type: 'Matches', id: 'RECENT' },
                { type: 'Matches', id: 'SEASON_' },
                { type: 'Matches', id: 'TOURNAMENT_' },
                { type: 'Matches', id: 'TEAM_' },
            ],
        }),
    }),
});

export const {
    // Queries
    useGetMatchesQuery,
    useGetMatchQuery,
    useGetUpcomingMatchesQuery,
    useGetRecentMatchesQuery,
    useGetMatchesByTeamQuery,
    useGetLiveMatchQuery,
    useGetMatchStatsQuery,
    useGetMatchTimelineQuery,
    useGetHeadToHeadQuery,

    // Mutations
    useCreateMatchMutation,
    useUpdateMatchMutation,
    usePatchMatchMutation,
    useUpdateMatchStatusMutation,
    useUpdateMatchResultMutation,
    useDeleteMatchMutation,
    useBulkDeleteMatchesMutation,
    useGoLiveMatchMutation,
    useUpdateLiveMatchEventsMutation,
    useBulkUpdateLiveEventsMutation,
    useUpdateMatchMinuteMutation,

    // Lazy queries
    useLazyGetMatchesQuery,
    useLazyGetMatchQuery,
    useLazyGetLiveMatchQuery,
    useLazyGetMatchStatsQuery,
    useLazyGetHeadToHeadQuery,
} = matchApi;

export default matchApi;
// goal.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { IGoal } from "@/types/match.interface";

const goalApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all goals
        getGoals: builder.query<IQueryResponse<IGoal[]>, void>({
            query: () => "/goals",
            providesTags: ["Goals"],
        }),

        // GET goal by ID
        getGoalById: builder.query<IQueryResponse<IGoal>, string>({
            query: (id) => `/goals/${id}`,
            providesTags: ["Goals"],
        }),

        // GET goals by match
        getGoalsByMatch: builder.query<IQueryResponse<IGoal[]>, string>({
            query: (matchId) => `/goals/match/${matchId}`,
            providesTags: ["Goals"],
        }),

        // GET goals by player
        getGoalsByPlayer: builder.query<IQueryResponse<IGoal[]>, string>({
            query: (playerId) => `/goals/player/${playerId}`,
            providesTags: ["Goals"],
        }),

        // GET goal statistics
        getGoalStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/goals/stats",
            providesTags: ["Goals"],
        }),

        // CREATE goal
        createGoal: builder.mutation<IQueryResponse<IGoal>, Partial<IGoal>>({
            query: (body) => ({
                url: "/goals",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Goals",'Matches', 'Players'],
        }),

        // UPDATE goal
        updateGoal: builder.mutation<IQueryResponse<IGoal>, { id: string; body: Partial<IGoal> }>({
            query: ({ id, body }) => ({
                url: `/goals/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Goals",'Matches', 'Players'],
        }),

        // DELETE goal
        deleteGoal: builder.mutation<IQueryResponse<IGoal>, string>({
            query: (id) => ({
                url: `/goals/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Goals",'Matches', 'Players'],
        }),

        // BULK DELETE goals
        bulkDeleteGoals: builder.mutation<IQueryResponse<{ deletedCount: number }>, string[]>({
            query: (goalIds) => ({
                url: "/goals/bulk/delete",
                method: "POST",
                body: { goalIds },
            }),
            invalidatesTags: ["Goals",'Matches', 'Players'],
        }),

    }),
});

export const {
    useGetGoalsQuery,
    useGetGoalByIdQuery,
    useGetGoalsByMatchQuery,
    useGetGoalsByPlayerQuery,
    useGetGoalStatsQuery,
    useCreateGoalMutation,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
    useBulkDeleteGoalsMutation,
} = goalApi;

export default goalApi;
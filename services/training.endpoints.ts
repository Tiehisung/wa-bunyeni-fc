// services/training.endpoints.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import { IPlayerMini } from "@/types/player.interface";
import { ITrainingSession } from "@/app/admin/training/attendance/page";

export interface IPostTrainingSession {
    date: string;
    location: string;
    note?: string;
    recordedBy?: {
        _id: string;
        name: string;
        email: string;
    };
    attendance: {
        allPlayers: Array<IPlayerMini>;
        attendedBy: Array<IPlayerMini>;
    };
}

const trainingApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get all training sessions with pagination/filtering
        getTrainingSessions: builder.query<IQueryResponse<ITrainingSession[]>, string | void>({
            query: (params) => `/training${params ? `?${params}` : ""}`,
            providesTags: ["Training"],
        }),

        // Get upcoming training sessions
        getUpcomingTraining: builder.query<IQueryResponse<ITrainingSession[]>, void>({
            query: () => "/training/upcoming",
            providesTags: ["Training"],
        }),

        // Get recent training sessions
        getRecentTraining: builder.query<IQueryResponse<ITrainingSession[]>, void>({
            query: () => "/training/recent",
            providesTags: ["Training"],
        }),

        // Get training history for a specific player
        getPlayerTrainingHistory: builder.query<IQueryResponse<ITrainingSession[]>, string>({
            query: (playerId) => `/training/player/${playerId}`,
            providesTags: (_result, _error, playerId) => [
                { type: "Training", id: `PLAYER-${playerId}` },
                "Training",
            ],
        }),

        // Get single training session by ID
        getTrainingSessionById: builder.query<IQueryResponse<ITrainingSession>, string>({
            query: (sessionId) => `/training/${sessionId}`,
            providesTags: (_result, _error, id) => [{ type: "Training", id }],
        }),

        // Create new training session
        createTrainingSession: builder.mutation<IQueryResponse<ITrainingSession>, IPostTrainingSession>({
            query: (body) => ({
                url: "/training",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Training"],
        }),

        // Update entire training session
        updateTrainingSession: builder.mutation<
            IQueryResponse<ITrainingSession>,
            Partial<ITrainingSession>
        >({
            query: ({ _id, ...body }) => ({
                url: `/training/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { _id }) => [
                { type: "Training", id: _id },
                "Training",
            ],
        }),

        // Update only attendance (increment updateCount)
        updateAttendance: builder.mutation<
            IQueryResponse<ITrainingSession>,
            { id: string; attendedBy: Array<IPlayerMini> }
        >({
            query: ({ id, attendedBy }) => ({
                url: `/training/${id}/attendance`,
                method: "PATCH",
                body: { attendedBy },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Training", id },
                "Training",
            ],
        }),

        // Update only session note
        updateSessionNote: builder.mutation<
            IQueryResponse<ITrainingSession>,
            { id: string; note: string }
        >({
            query: ({ id, note }) => ({
                url: `/training/${id}/note`,
                method: "PATCH",
                body: { note },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Training", id },
                "Training",
            ],
        }),

        // Delete training session
        deleteTrainingSession: builder.mutation<IQueryResponse<null>, string>({
            query: (sessionId) => ({
                url: `/training/${sessionId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Training"],
        }),

        // Get training statistics
        getTrainingStats: builder.query<
            IQueryResponse<{
                totalSessions: number;
                averageAttendance: number;
                mostAttended: ITrainingSession[];
                attendanceByPlayer: Array<{
                    player: IPlayerMini;
                    attendanceCount: number;
                }>;
                recentSessions: ITrainingSession[];
            }>,
            void
        >({
            query: () => "/training/stats",
            providesTags: ["Training"],
        }),
    }),
});

export const {
    // Query hooks
    useGetTrainingSessionsQuery,
    useGetUpcomingTrainingQuery,
    useGetRecentTrainingQuery,
    useGetPlayerTrainingHistoryQuery,
    useGetTrainingSessionByIdQuery,
    useGetTrainingStatsQuery,

    // Mutation hooks
    useCreateTrainingSessionMutation,
    useUpdateTrainingSessionMutation,
    useUpdateAttendanceMutation,
    useUpdateSessionNoteMutation,
    useDeleteTrainingSessionMutation,
} = trainingApi;
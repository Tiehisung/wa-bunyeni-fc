// log.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { ILog } from "@/types/log.interface";

const logApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all logs with filters
        getLogs: builder.query<IQueryResponse<ILog[]>, {
            page?: number;
            limit?: number;
            fromDate?: string;
            toDate?: string;
            severity?: string;
            source?: string;
            userId?: string;
        }>({
            query: (params) => ({
                url: "/logs",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 50,
                    fromDate: params?.fromDate,
                    toDate: params?.toDate,
                    severity: params?.severity,
                    source: params?.source,
                    userId: params?.userId,
                },
            }),
            providesTags: ["Logs"],
        }),

        // GET log by ID
        getLogById: builder.query<IQueryResponse<ILog>, string>({
            query: (id) => `/logs/${id}`,
            providesTags: ["Logs"],
        }),

        // GET logs by user
        getLogsByUser: builder.query<IQueryResponse<ILog[]>, {
            userId: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ userId, page, limit }) => ({
                url: `/logs/user/${userId}`,
                params: { page, limit },
            }),
            providesTags: ["Logs"],
        }),

        // GET logs by severity (info, warn, error, debug)
        getLogsBySeverity: builder.query<IQueryResponse<ILog[]>, {
            severity: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ severity, page, limit }) => ({
                url: `/logs/severity/${severity}`,
                params: { page, limit },
            }),
            providesTags: ["Logs"],
        }),

        // GET log statistics
        getLogStats: builder.query<IQueryResponse<any>, {
            fromDate?: string;
            toDate?: string;
        }>({
            query: (params) => ({
                url: "/logs/stats",
                params,
            }),
            providesTags: ["Logs"],
        }),

        // SEARCH logs by text/content
        searchLogs: builder.query<IQueryResponse<ILog[]>, {
            query: string;
            page?: number;
            limit?: number;
            severity?: string;
        }>({
            query: (params) => ({
                url: "/logs/search",
                params: {
                    q: params.query,
                    page: params?.page || 1,
                    limit: params?.limit || 50,
                    severity: params?.severity,
                },
            }),
            providesTags: ["Logs"],
        }),

        // CLEANUP old logs (admin only)
        cleanupOldLogs: builder.mutation<IQueryResponse<{ deletedCount: number }>, {
            olderThan: string; // ISO date string
            severity?: string;
        }>({
            query: (params) => ({
                url: "/logs/cleanup",
                method: "DELETE",
                params: {
                    olderThan: params.olderThan,
                    severity: params.severity,
                },
            }),
            invalidatesTags: ["Logs"],
        }),

        // DELETE log by ID
        deleteLog: builder.mutation<IQueryResponse<ILog>, string>({
            query: (id) => ({
                url: `/logs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Logs"],
        }),

    }),
});

export const {
    useGetLogsQuery,
    useGetLogByIdQuery,
    useGetLogsByUserQuery,
    useGetLogsBySeverityQuery,
    useGetLogStatsQuery,
    useSearchLogsQuery,
    useCleanupOldLogsMutation,
    useDeleteLogMutation,

    // Lazy queries
    useLazySearchLogsQuery,
} = logApi;

export default logApi;
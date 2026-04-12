// transaction.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import { ITransaction, ITransactionsSummary } from "@/types/finance.interface";

const transactionApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all transactions with optional filters
        getTransactions: builder.query<IQueryResponse<ITransaction[]>, {
            page?: number;
            limit?: number;
            type?: string;
            category?: string;
            fromDate?: string;
            toDate?: string;
            sortBy?: string;
        }>({
            query: (params) => ({
                url: "/transactions",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                    type: params?.type,
                    category: params?.category,
                    fromDate: params?.fromDate,
                    toDate: params?.toDate,
                    sortBy: params?.sortBy || '-createdAt',
                },
            }),
            providesTags: ["Transactions"],
        }),

        // GET transaction by ID
        getTransactionById: builder.query<IQueryResponse<any>, string>({
            query: (id) => `/transactions/${id}`,
            providesTags: ["Transactions"],
        }),

        // GET transactions by type (income, expense, transfer, etc)
        getTransactionsByType: builder.query<IQueryResponse<any[]>, {
            type: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ type, page, limit }) => ({
                url: `/transactions/type/${type}`,
                params: { page, limit },
            }),
            providesTags: ["Transactions"],
        }),

        // GET transactions by category
        getTransactionsByCategory: builder.query<IQueryResponse<any[]>, {
            category: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ category, page, limit }) => ({
                url: `/transactions/category/${category}`,
                params: { page, limit },
            }),
            providesTags: ["Transactions"],
        }),

        // GET transaction statistics
        getTransactionStats: builder.query<IQueryResponse<any>, {
            fromDate?: string;
            toDate?: string;
            type?: string;
        }>({
            query: (params) => ({
                url: "/transactions/stats",
                params,
            }),
            providesTags: ["Transactions"],
        }),

        // GET transaction summary (grouped by type/category)
        getTransactionsSummary: builder.query<IQueryResponse<ITransactionsSummary>, {
            groupBy: 'type' | 'category' | 'date';
            fromDate?: string;
            toDate?: string;
        }>({
            query: (params) => ({
                url: "/transactions/summary",
                params,
            }),
            providesTags: ["Transactions"],
        }),

        // EXPORT transactions to CSV/Excel
        exportTransactions: builder.query<IQueryResponse<{ downloadUrl: string }>, {
            format: 'csv' | 'excel' | 'pdf';
            fromDate?: string;
            toDate?: string;
            type?: string;
            category?: string;
        }>({
            query: (params) => ({
                url: "/transactions/export",
                params,
            }),
            providesTags: ["Transactions"],
        }),

        // CREATE transaction
        createTransaction: builder.mutation<IQueryResponse<any>, Partial<any>>({
            query: (body) => ({
                url: "/transactions",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Transactions"],
        }),

        // UPDATE transaction
        updateTransaction: builder.mutation<IQueryResponse<any>,  Partial<any> >({
            query: ({ _id:id, ...body }) => ({
                url: `/transactions/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Transactions"],
        }),

        // DELETE transaction
        deleteTransaction: builder.mutation<IQueryResponse<any>, string>({
            query: (id) => ({
                url: `/transactions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transactions"],
        }),

    }),
});

export const {
    useGetTransactionsQuery,
    useGetTransactionByIdQuery,
    useGetTransactionsByTypeQuery,
    useGetTransactionsByCategoryQuery,
    useGetTransactionStatsQuery,
    useGetTransactionsSummaryQuery,
    useExportTransactionsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,

    // Lazy queries
    useLazyExportTransactionsQuery,
} = transactionApi;

export default transactionApi;
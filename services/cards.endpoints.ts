// card.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { ICard } from "@/types/card.interface";

const cardApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all cards
        getCards: builder.query<IQueryResponse<ICard[]>, string>({
            query: (params = "") => `/cards${params}`,
            providesTags: ["Cards"],
        }),

        // GET card by ID
        getCardById: builder.query<IQueryResponse<ICard>, string>({
            query: (id) => `/cards/${id}`,
            providesTags: ["Cards"],
        }),

        // GET cards by match
        getCardsByMatch: builder.query<IQueryResponse<ICard[]>, string>({
            query: (matchId) => `/cards/match/${matchId}`,
            providesTags: ["Cards"],
        }),

        // GET cards by player
        getCardsByPlayer: builder.query<IQueryResponse<ICard[]>, string>({
            query: (playerId) => `/cards/player/${playerId}`,
            providesTags: ["Cards"],
        }),

        // GET card statistics
        getCardStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/cards/stats",
            providesTags: ["Cards"],
        }),

        // CREATE card
        createCard: builder.mutation<IQueryResponse<ICard>, Partial<ICard>>({
            query: (body) => ({
                url: "/cards",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cards"],
        }),

        // UPDATE card
        updateCard: builder.mutation<IQueryResponse<ICard>, Partial<ICard>>({
            query: ({ _id, ...body }) => ({
                url: `/cards/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Cards"],
        }),

        // DELETE card
        deleteCard: builder.mutation<IQueryResponse<ICard>, string>({
            query: (id) => ({
                url: `/cards/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cards"],
        }),

    }),
});

export const {
    useGetCardsQuery,
    useGetCardByIdQuery,
    useGetCardsByMatchQuery,
    useGetCardsByPlayerQuery,
    useGetCardStatsQuery,
    useCreateCardMutation,
    useUpdateCardMutation,
    useDeleteCardMutation,
} = cardApi;

export default cardApi;
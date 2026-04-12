// sponsor.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { ISponsor } from "@/types/sponsor.interface";

const sponsorApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all sponsors
        getSponsors: builder.query<IQueryResponse<ISponsor[]>, string>({
            query: (paramsString = '') => `/sponsors?${paramsString}`,
            providesTags: ["Sponsors"],
        }),

        // GET sponsor by ID
        getSponsor: builder.query<IQueryResponse<ISponsor>, string>({
            query: (id) => `/sponsors/${id}`,
            providesTags: ["Sponsors"],
        }),

        // GET top sponsors (featured/highest tier)
        getTopSponsors: builder.query<IQueryResponse<ISponsor[]>, { limit?: number }>({
            query: (params) => ({
                url: "/sponsors/top",
                params: { limit: params?.limit || 5 },
            }),
            providesTags: ["Sponsors"],
        }),

        // GET sponsor statistics
        getSponsorStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/sponsors/stats",
            providesTags: ["Sponsors"],
        }),

        // CREATE sponsor
        createSponsor: builder.mutation<IQueryResponse<ISponsor>, Partial<ISponsor>>({
            query: (body) => ({
                url: "/sponsors",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Sponsors"],
        }),

        // UPDATE sponsor
        updateSponsor: builder.mutation<IQueryResponse<ISponsor>, Partial<ISponsor>>({
            query: ({ _id, ...body }) => ({
                url: `/sponsors/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Sponsors"],
        }),

        // TOGGLE sponsor status (active/inactive)
        toggleSponsorStatus: builder.mutation<IQueryResponse<ISponsor>, {
            id: string;
            isActive: boolean;
        }>({
            query: ({ id, isActive }) => ({
                url: `/sponsors/${id}/status`,
                method: "PATCH",
                body: { isActive },
            }),
            invalidatesTags: ["Sponsors"],
        }),

        // DELETE sponsor
        deleteSponsor: builder.mutation<IQueryResponse<ISponsor>, string>({
            query: (id) => ({
                url: `/sponsors/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Sponsors"],
        }),

    }),
});

export const {
    useGetSponsorsQuery,
    useGetSponsorQuery,
    useGetTopSponsorsQuery,
    useGetSponsorStatsQuery,
    useCreateSponsorMutation,
    useUpdateSponsorMutation,
    useToggleSponsorStatusMutation,
    useDeleteSponsorMutation,
} = sponsorApi;

export default sponsorApi;
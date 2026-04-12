// donation.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { IDonation } from "@/types/donation.interface";

const donationApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all donations
        getDonations: builder.query<IQueryResponse<IDonation[]>, string>({
            query: (paramsString='') => `/donations?${paramsString}`,
            providesTags: ["Donations"],
        }),

        // GET donation by ID
        getDonationById: builder.query<IQueryResponse<IDonation>, string>({
            query: (id) => `/donations/${id}`,
            providesTags: ["Donations"],
        }),

        // GET donation statistics
        getDonationStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/donations/stats",
            providesTags: ["Donations"],
        }),

        // CREATE donation
        createDonation: builder.mutation<IQueryResponse<IDonation>, Partial<IDonation>>({
            query: (body) => ({
                url: "/donations",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Donations"],
        }),

        // DELETE donation
        deleteDonation: builder.mutation<IQueryResponse<IDonation>, string>({
            query: (id) => ({
                url: `/donations/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Donations"],
        }),

    }),
});

export const {
    useGetDonationsQuery,
    useGetDonationByIdQuery,
    useGetDonationStatsQuery,
    useCreateDonationMutation,
    useDeleteDonationMutation,
} = donationApi;

export default donationApi;
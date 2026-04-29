// manager.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import { IStaff } from "@/types/staff.interface";



const staffMemberApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all staff
        getStaffMembers: builder.query<IQueryResponse<IStaff[]>, string>({
            query: (paramsString) => (`/staff?${paramsString}`),
            providesTags: ["Staff"],
        }),

        // GET active staff
        getActiveStaffMembers: builder.query<IQueryResponse<IStaff[]>, {
            page?: number;
            limit?: number;
        }>({
            query: (params) => ({
                url: "/staff/active",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                },
            }),
            providesTags: ["Staff"],
        }),

        // GET staff by role
        getStaffMemberByRole: builder.query<IQueryResponse<IStaff[]>, {
            role: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ role, page, limit }) => ({
                url: `/staff/role/${role}`,
                params: { page, limit },
            }),
            providesTags: ["Staff"],
        }),
        getStaffMember: builder.query<IQueryResponse<IStaff>, string>({

            // GET manager by ID
            query: (id) => `/staff/${id}`,
            providesTags: ["Staff"],
        }),

        // GET manager statistics
        getStaffMemberStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/staff/stats",
            providesTags: ["Staff"],
        }),

        // CREATE manager
        createStaff: builder.mutation<IQueryResponse<IStaff>, Partial<IStaff>>({
            query: (body) => ({
                url: "/staff",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Staff"],
        }),

        // UPDATE manager
        updateStaff: builder.mutation<IQueryResponse<IStaff>, Partial<IStaff>>({
            query: ({ _id, ...body }) => ({
                url: `/staff/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Staff"],
        }),

        // DEACTIVATE manager
        deactivateStaff: builder.mutation<IQueryResponse<IStaff>, {
            id: string;
            reason?: string;
        }>({
            query: ({ id, reason }) => ({
                url: `/staff/${id}/deactivate`,
                method: "PATCH",
                body: { reason },
            }),
            invalidatesTags: ["Staff"],
        }),

        // ACTIVATE manager
        activateStaff: builder.mutation<IQueryResponse<IStaff>, {
            id: string;
        }>({
            query: ({ id }) => ({
                url: `/staff/${id}/activate`,
                method: "PATCH",
            }),
            invalidatesTags: ["Staff"],
        }),

        // DELETE manager
        deleteStaff: builder.mutation<IQueryResponse<IStaff>, string>({
            query: (id) => ({
                url: `/staff/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Staff"],
        }),

    }),
});

export const {
    useGetStaffMembersQuery,
    useGetStaffMemberQuery,
    useGetActiveStaffMembersQuery,
    useGetStaffMemberByRoleQuery,
    useGetStaffMemberStatsQuery,
    useCreateStaffMutation,
    useUpdateStaffMutation,
    useDeactivateStaffMutation,
    useActivateStaffMutation,
    useDeleteStaffMutation,
} = staffMemberApi;

export default staffMemberApi;
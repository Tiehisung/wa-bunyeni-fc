import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { IUser, } from "@/types/user";

export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}

const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get all users with optional pagination/filtering
        getUsers: builder.query<IQueryResponse<IUser[]>, string | void>({
            query: (params) => `/users${params ? `?${params}` : ""}`,
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Users' as const, id: _id })),
                        { type: 'Users', id: 'LIST' },
                    ]
                    : [{ type: 'Users', id: 'LIST' }],
        }),

        // Get current authenticated user
        getMe: builder.query<IQueryResponse<IUser>, void>({
            query: () => "/users/me",
            providesTags: ["Me"],
        }),

        // Get single user by ID
        getUser: builder.query<IQueryResponse<IUser>, string>({
            query: (userId) => `/users/${userId}`,
            providesTags: (_result, _error, id) => [{ type: 'Users', id }],
        }),

        /**
         * Create/Add new user
         * Only admin is authorized to create a user unlike signup which is done by the user themselve
         *  */
        createUser: builder.mutation<IQueryResponse<IUser>, IUser>({
            query: (body) => ({
                url: `/users`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error,) => ['Users'],
        }),
        // Update user
        updateUser: builder.mutation<IQueryResponse<IUser>, Partial<IUser>>({
            query: ({ _id, ...body }) => ({
                url: `/users/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { _id: id }) => [
                { type: 'Users', id },
                { type: 'Users', id: 'LIST' },
                'Me',
            ],
        }),

        // Change user password
        changeUserPassword: builder.mutation<IQueryResponse<null>, ChangePasswordInput>({
            query: (body) => ({
                url: "/users/change-password",
                method: "POST",
                body,
            }),
            invalidatesTags: ['Me'],
        }),

        // Delete user
        deleteUser: builder.mutation<IQueryResponse<null>, string>({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
    }),
});

export const {
    // Query hooks
    useGetUsersQuery,
    useGetMeQuery,
    useGetUserQuery,

    useCreateUserMutation,
    
    // Mutation hooks
    useUpdateUserMutation,
    useChangeUserPasswordMutation,
    useDeleteUserMutation,
} = usersApi;
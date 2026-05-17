import { IQueryResponse } from "@/types";
import { api } from "./api";

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

const systenApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get single user by ID
    getShortUrl: builder.query<IQueryResponse<string>, string>({
      query: (longUrl) => `/shorten?longUrl=${longUrl}`,
      providesTags: ["App"],
    }),
  }),
});

export const { useGetShortUrlQuery } = systenApi;

// services/api.ts

 
import { ENV } from "@/lib/env";
import { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: [
        'Auth',
        'Captains',
        'Cards',
        'Documents',
        'Donations',
        'Features',
        'Files',
        'Folders',
        'Gallery',
        'Goals',
        'Highlights',
        'Injuries',
        'Logs',
        'Matches',
        'Me',
        'MVPs',
        'News',
        'Players',
        'Staff',
        'Teams',
        'Training',
        'Transactions',
        'Sponsors',
        'Squads',
        "Users",
        'Uploads',
        'Fans',
        'FanStats',

        // Dashboards
        'Metrics',

    ],
    // keepUnusedDataFor: 300, // Keep data for 5 minutes (in seconds)
    // refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
    endpoints: () => ({}),

});


// const baseQuery = fetchBaseQuery({
//     baseUrl:  ENV.API_URL,
//     credentials: "include",
//     prepareHeaders: async (headers) => {
//         const session = await getSession()

//         if (session?.accessToken) {
//             headers.set("Authorization", `Bearer ${session.accessToken}`)
//         }

//         return headers
//     },
// })


// export const baseApi = createApi({
//     reducerPath: "api",
//     baseQuery,
//     tagTypes: ["User", "Post"], tagTypes: [
//         'Auth',
//         'Captains',
//         'Cards',
//         'Documents',
//         'Donations',
//         'Features',
//         'Files',
//         'Folders',
//         'Gallery',
//         'Goals',
//         'Highlights',
//         'Injuries',
//         'Logs',
//         'Matches',
//         'Me',
//         'MVPs',
//         'News',
//         'Players',
//         'Staff',
//         'Teams',
//         'Training',
//         'Transactions',
//         'Sponsors',
//         'Squads',
//         "Users",
//         'Uploads',
//         'Fans',
//         'FanStats',

//         // Dashboards
//         'Metrics',

//     ],
//     endpoints: () => ({}),
// })


import { configureStore } from "@reduxjs/toolkit";
import { persistedReducer } from "./rootReducer";
import { api } from "../services/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { logout } from "./slices/auth.slice";

// Custom middleware to handle auth errors globally
const authErrorMiddleware = (store: any) => (next: any) => (action: any) => {
    // Check if this is a rejected RTK Query action with 401
    if (action?.type?.endsWith('/rejected')) {
        const errorPayload = action?.payload;

        // Check for 401 status and auth error codes
        if (errorPayload?.status === 401) {
            const errorCode = errorPayload?.data?.code;

            if (errorCode === 'INVALID_TOKEN' ||
                errorCode === 'TOKEN_EXPIRED' ||
                errorCode === 'NO_TOKEN') {

                console.log('🔐 Auth error detected, logging out...');
                store.dispatch(logout());
            }
        }
    }

    return next(action);
};
export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV == 'development',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(api.middleware).concat(authErrorMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
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
        }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
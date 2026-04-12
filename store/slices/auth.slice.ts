// store/slices/auth.slice.ts
import { IAuthResponse } from '@/types/auth';
import { IUser } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: IUser | null;
    accessToken: string | null;
    refreshToken?: string | null;
    isAuthenticated: boolean;
    lastLogin: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    lastLogin: null,
    refreshToken: null,
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<IAuthResponse['data']>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.lastLogin = new Date().toISOString();
        },
        logout: (state) => {
            Object.assign(state, initialState);
        },
        updateUser: (state, action: PayloadAction<Partial<AuthState['user']>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
         setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const { setCredentials, logout, updateUser,setAccessToken } = authSlice.actions;
export default authSlice.reducer;
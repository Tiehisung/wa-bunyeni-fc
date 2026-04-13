'use client'

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks/store';
import { useSigninMutation, useLogoutMutation, useRefreshTokenMutation,  } from '@/services/auth.endpoints';
import { ILoginCredentials } from '@/types/auth';
import { logout, setAccessToken, setCredentials, } from '../slices/auth.slice';
import { getErrorMessage } from '@/lib/error';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, accessToken, isAuthenticated, } = useAppSelector((state) => state.auth);

    const [signinMutation, { isLoading: isLoggingIn }] = useSigninMutation();
    const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
    const [refreshTokenMutation] = useRefreshTokenMutation();

    // Auto refresh token
    useEffect(() => {
        const refreshAuthToken = async () => {
            try {
                const response = await refreshTokenMutation().unwrap();
                dispatch(setAccessToken(response.data.accessToken));
            } catch (error) {
                dispatch(logout());
            }
        };

        // Refresh token every 14 minutes (slightly before 15m expiry)
        const interval = setInterval(refreshAuthToken, 14 * 60 * 1000);

        return () => clearInterval(interval);
    }, [dispatch, refreshTokenMutation]);

    const signin = async (credentials: ILoginCredentials) => {
        try {
            const result = await signinMutation(credentials).unwrap();

            dispatch(setCredentials({
                user: result.data.user,
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
            }));

            return { success: true, user: result.data.user, message: result.message };
        } catch (error: any) {
            return {
                success: false,
                message: getErrorMessage(error, 'Login failed')
            };
        }
    };

    const logoutUser = async () => {
        try {
            await logoutMutation().unwrap();
        } finally {
            dispatch(logout());
        }
    };

    return {
        user,
        accessToken,
        isAuthenticated,
        isLoading: isLoggingIn || isLoggingOut,
        signin,
        logout: logoutUser,
    };
};
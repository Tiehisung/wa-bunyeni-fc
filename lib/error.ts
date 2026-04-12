import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getErrorMessage(
    error: unknown,
    customMessage?: string
): string {
    if (!error) return "Unknown error occurred";

    const err = error as Record<string, unknown>;

    // 1. Fetch-based API errors
    if (error instanceof Response) {
        return `Request failed: ${error.status} ${error.statusText}`;
    }

    // 2. Server returned structured JSON { error, message }
    if (err.error && typeof err.error === "string") return err.error;

    if (err.message && typeof err.message === "string") return err.message;

    // 3. Axios errors
    if (err.response && typeof err.response === "object") {
        const response = err.response as Record<string, unknown>;
        if (response.data && typeof response.data === "object") {
            const data = response.data as Record<string, unknown>;
            if (data.message && typeof data.message === "string") return data.message;
            if (data.error && typeof data.error === "string") return data.error;
        }
    }

    // 4. Zod/Joi/Mongoose validation errors

    if (err.details && Array.isArray(err.details) && err.details.length) {
        return err.details.map((d: { message: string }) => d.message).join(", ");
    }

    // Zod v3 errors (ZodError)
    if (err.name === 'ZodError' && Array.isArray(err.issues)) {
        return (err.issues as Array<{ message: string }>)
            .map(i => i.message)
            .join(', ');
    }
    // Mongoose validation error
    if (err.name === "ValidationError" && err.errors && typeof err.errors === "object") {
        return Object.values(err.errors)
            .map((e: { message: string }) => e.message)
            .join(", ");
    }

    // 5. Network errors
    if (err.name === "NetworkError") {
        return "Network error — please check your connection.";
    }

    // 6. String errors
    if (typeof error === "string") return error;

    // 7. Default fallback
    return customMessage ?? "Something went wrong. Please try again.";
}



interface ErrorPayload {
    message?: string;
    error?: string;
}

/**RTK Query error formatting**/
export const formatError = (
    error: FetchBaseQueryError | SerializedError | undefined
): string => {
    if (!error) {
        return "An unknown error occurred.";
    }

    // RTK Query HTTP errors
    if ("status" in error) {
        // Network error
        if (error.status === "FETCH_ERROR") {
            return "Network error. Check your internet connection.";
        }

        // Timeout / parsing issues
        if (error.status === "PARSING_ERROR") {
            return "Server response error.";
        }

        // HTTP status handling
        if (typeof error?.status === "number") {
            if (error.status >= 500) {
                return "Something went wrong. Try again later.";
            }

            if (error.status === 401) {
                return "Session expired. Please login again.";
            }

            if (error.status === 403) {
                return "You are not allowed to perform this action.";
            }

            if (error.status === 404) {
                return "Requested resource not found.";
            }
        }

        // API response message
        if ("data" in error && error.data) {
            const data = error.data as ErrorPayload;

            return (
                data.message ||
                data.error ||
                "Request failed."
            );
        }
    }

    // JS/runtime errors
    if ("message" in error && error.message) {
        return error.message;
    }

    return "An unknown error occurred.";
};
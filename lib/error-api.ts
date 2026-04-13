 

export const getApiErrorMessage=(error: unknown, fallback?: string): string =>{
    if (!error) return "Unknown error occurred";
    const err = error as Record<string, unknown>;

    if (err.name === "ValidationError" && err.errors) {
        return Object.values(err.errors)
            .map((e: any) => e.message)
            .join(", ");
    }

    if (err.message && typeof err.message === "string") return err.message;
    if (typeof error === "string") return error;

    return fallback ?? "Something went wrong";
}
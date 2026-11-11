import type { ApiResponse } from "./types";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

/**
 * Universal fetch wrapper for Dr. Meow backend API.
 *
 * @param endpoint - Relative endpoint path (e.g. "/services" or "/health").
 * @param options - Standard RequestInit options.
 * @returns Promise resolving to the standard ApiResponse.
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                Accept: "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...options.headers
            }
        });

        const result: ApiResponse<T> = await response.json();

        if (!response.ok || !result.success) {
            const errorMsg =
                result.message || `Request failed with HTTP ${response.status}`;
            throw new Error(errorMsg);
        }

        return result;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error("Terjadi kesalahan jaringan atau server tidak merespons.", { cause: err });
    }
}

import { apiRequest } from "./api";
import type { ApiResponse, BackendService, ServiceInput } from "./types";

/**
 * Fetch all grooming services from the backend.
 *
 * @param activeOnly - If true, retrieves only services with active status.
 */
export const getServices = (activeOnly: boolean = true): Promise<ApiResponse<BackendService[]>> => {
    const query = activeOnly ? "?active=true" : "";
    return apiRequest<BackendService[]>(`/services${query}`);
};

/**
 * Fetch a single grooming service by ID.
 *
 * @param id - Unique service ID.
 */
export const getServiceById = (id: number): Promise<ApiResponse<BackendService>> => {
    return apiRequest<BackendService>(`/services/${id}`);
};

/**
 * Create a new service in backend storage.
 *
 * @param data - Service attributes payload.
 */
export const createService = (data: ServiceInput): Promise<ApiResponse<BackendService>> => {
    return apiRequest<BackendService>("/services", {
        method: "POST",
        body: JSON.stringify(data)
    });
};

/**
 * Update an existing service in backend storage.
 *
 * @param id - Service ID to update.
 * @param data - Updated service attributes.
 */
export const updateService = (
    id: number,
    data: ServiceInput
): Promise<ApiResponse<BackendService>> => {
    return apiRequest<BackendService>(`/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });
};

/**
 * Delete a service by ID.
 *
 * @param id - Service ID to delete.
 */
export const deleteService = (id: number): Promise<ApiResponse<null>> => {
    return apiRequest<null>(`/services/${id}`, {
        method: "DELETE"
    });
};

/**
 * Check backend health status.
 */
export const getHealth = (): Promise<ApiResponse<{ status: string }>> => {
    return apiRequest<{ status: string }>("/health");
};

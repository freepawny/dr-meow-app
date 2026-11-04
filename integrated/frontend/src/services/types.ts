/**
 * Standard API envelope format returned by the backend.
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: string[] | Record<string, string>;
}

/**
 * Service entity data model representing grooming services from backend.
 */
export interface BackendService {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
    category: string;
    is_active: boolean;
}

/**
 * Payload for creating or updating a service.
 */
export interface ServiceInput {
    name?: string;
    description?: string;
    price?: number;
    duration_minutes?: number;
    category?: string;
    is_active?: boolean;
}

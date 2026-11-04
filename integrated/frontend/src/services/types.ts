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
 * Normalized Service entity data model returned by the backend.
 */
export interface BackendService {
    id: string;
    name: string;
    badge_label: string;
    description: string;
    is_popular: boolean;
    base_price: number;
    tier_prices?: Record<string, number>;
    features: string[];
    is_active?: boolean;
}

/**
 * Payload for creating or updating a service.
 */
export type ServiceInput = Partial<BackendService>;

import type { PricingFeature, PricingCardVariant } from "@/pages/landing/_sections/Pricing/PricingCard";

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
 * Service entity data model matching PricingPlanItem 1-to-1.
 */
export interface BackendService {
    id: string;
    badgeLabel: string;
    variant?: PricingCardVariant;
    size: string;
    name: string;
    price: string;
    prices?: Record<string, string>;
    priceUnit?: string;
    description: string;
    features: PricingFeature[];
    buttonLabel: string;
    is_active?: boolean;
}

/**
 * Payload for creating or updating a service.
 */
export type ServiceInput = Partial<BackendService>;

/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { apiRequest } from "./api";
import type {
    ApiResponse,
    BackendCustomer,
    CustomerInput,
    BackendCat,
    CatInput,
    BackendReservation,
    ReservationInput
} from "./types";

/* ==========================================================================
   CUSTOMER ENDPOINTS
   ========================================================================== */
/**
 * Retrieve all registered customers from the backend.
 *
 * @returns Promise resolving to an API response containing an array of customer records.
 */
export const getCustomers = (): Promise<ApiResponse<BackendCustomer[]>> => {
    return apiRequest<BackendCustomer[]>("/customers");
};

/**
 * Create a new customer record in the backend.
 *
 * @param data - Customer registration attributes.
 * @returns Promise resolving to the newly created customer entity envelope.
 */
export const createCustomer = (
    data: CustomerInput
): Promise<ApiResponse<BackendCustomer>> => {
    return apiRequest<BackendCustomer>("/customers", {
        method: "POST",
        body: JSON.stringify(data)
    });
};

/* ==========================================================================
   CAT ENDPOINTS
   ========================================================================== */
/**
 * Retrieve all cats belonging to a specific customer.
 *
 * @param customerId - Customer identifier whose cats should be fetched.
 * @returns Promise resolving to an API response containing an array of cat entities.
 */
export const getCustomerCats = (
    customerId: string
): Promise<ApiResponse<BackendCat[]>> => {
    return apiRequest<BackendCat[]>(
        `/customers/${encodeURIComponent(customerId)}/cats`
    );
};

/**
 * Create a new cat record linked to an existing customer.
 *
 * @param data - Cat registration payload.
 * @returns Promise resolving to the newly created cat record envelope.
 */
export const createCat = (data: CatInput): Promise<ApiResponse<BackendCat>> => {
    return apiRequest<BackendCat>("/cats", {
        method: "POST",
        body: JSON.stringify(data)
    });
};

/* ==========================================================================
   RESERVATION ENDPOINTS
   ========================================================================== */
/**
 * Create a new reservation record in the backend.
 *
 * @param data - Reservation booking payload.
 * @returns Promise resolving to the persisted reservation record envelope.
 */
export const createReservation = (
    data: ReservationInput
): Promise<ApiResponse<BackendReservation>> => {
    return apiRequest<BackendReservation>("/reservations", {
        method: "POST",
        body: JSON.stringify(data)
    });
};

/* ==========================================================================
   API ENVELOPE
   ========================================================================== */
/**
 * Standard API envelope format returned by the backend.
 */
export interface ApiResponse<T> {
    /** Whether the request succeeded. */
    success: boolean;
    /** Server status or human-readable response message. */
    message: string;
    /** Returned payload data. */
    data: T;
    /** List of error messages or validation error map. */
    errors: string[] | Record<string, string>;
}

/* ==========================================================================
   SERVICE ENTITY TYPES
   ========================================================================== */
/**
 * Normalized Service entity data model returned by the backend.
 */
export interface BackendService {
    /** Unique identifier for the service. */
    id: string;
    /** Display name of the service. */
    name: string;
    /** Highlight badge text for the service. */
    badge_label: string;
    /** Clinical service description. */
    description: string;
    /** Flag indicating whether the service is highlighted as popular. */
    is_popular: boolean;
    /** Default base price in IDR. */
    base_price: number;
    /** Optional weight-tiered pricing lookup map. */
    tier_prices?: Record<string, number>;
    /** Included clinical feature checklist. */
    features: string[];
    /** Active status flag. */
    is_active?: boolean;
}

/**
 * Payload for creating or updating a service.
 */
export type ServiceInput = Partial<BackendService>;

/* ==========================================================================
   CUSTOMER ENTITY TYPES
   ========================================================================== */
/**
 * Normalized Customer entity data model returned by the backend.
 */
export interface BackendCustomer {
    /** Unique identifier for the customer record. */
    customer_id: string;
    /** Full name of the pet owner. */
    name: string;
    /** Customer phone/WhatsApp number. */
    phone_number: string;
    /** Preferred schedule timestamp in ISO format. */
    schedule: string;
    /** Home or delivery address. */
    address: string;
    /** Whether customer opted in for notification alerts. */
    preference_notification: boolean;
}

/**
 * Payload for creating a customer record.
 */
export interface CustomerInput {
    /** Optional customer identifier override. */
    customer_id?: string;
    /** Full name of the pet owner. */
    name: string;
    /** Customer phone/WhatsApp number. */
    phone_number: string;
    /** Preferred schedule timestamp in ISO format. */
    schedule: string;
    /** Home or delivery address. */
    address: string;
    /**
     * Whether customer opted in for notification alerts.
     * @defaultValue false
     */
    preference_notification?: boolean;
}

/* ==========================================================================
   CAT ENTITY TYPES
   ========================================================================== */
/**
 * Normalized Cat entity data model returned by the backend.
 */
export interface BackendCat {
    /** Unique identifier for the cat record. */
    cat_id: string;
    /** Foreign key linking to the customer record. */
    customer_id: string;
    /** Cat's name. */
    name: string;
    /** Body weight in kg. */
    weight: number;
    /** Cat breed or lineage. */
    breeds: string;
    /** Vital body temperature recorded during intake (°C). */
    vital_temperature: number | null;
    /** Temperament category descriptor. */
    tempramen: string;
    /** Clinical medical history and allergies. */
    medical_history: string;
    /** URL of the most recent profile picture asset. */
    last_picture: string | null;
}

/**
 * Payload for creating a cat record linked to a customer.
 */
export interface CatInput {
    /** Optional cat identifier override. */
    cat_id?: string;
    /** Foreign key linking to the customer record. */
    customer_id: string;
    /** Cat's name. */
    name: string;
    /** Body weight in kg. */
    weight: number;
    /** Cat breed or lineage. */
    breeds: string;
    /** Optional vital body temperature in °C. */
    vital_temperature?: number | null;
    /** Temperament category descriptor. */
    tempramen: string;
    /** Clinical medical history or pre-existing conditions. */
    medical_history?: string | null;
    /** URL of recent picture documentation. */
    last_picture?: string | null;
}

/* ==========================================================================
   RESERVATION ENTITY TYPES
   ========================================================================== */
/**
 * Before-and-after photo documentation structure on a reservation.
 */
export interface ReservationBeforeAfter {
    /** Image URL taken prior to treatment. */
    before?: string | null;
    /** Image URL taken following treatment. */
    after?: string | null;
}

/**
 * Normalized Reservation entity data model matching App\Entities\Reservation.
 */
export interface BackendReservation {
    /** Unique reservation reference code. */
    reservation_id: string;
    /** Foreign key referencing the selected service. */
    service_id: string;
    /** Foreign key referencing the booked customer. */
    customer_id: string;
    /** Foreign key referencing the booked cat. */
    cat_id: string;
    /** Chosen service delivery method. */
    service_method: string;
    /** Current operational workflow status. */
    work_status: string;
    /** Whether an automated H-1 notification reminder was requested. */
    notification_h1: boolean;
    /** Final calculated total fee in IDR. */
    total_bill: number;
    /** Payment clearance status. */
    paymen_status: string;
    /** Before-and-after photo documentation metadata. */
    before_after: ReservationBeforeAfter | never[];
}

/**
 * Payload for creating a reservation record in the backend.
 */
export interface ReservationInput {
    /** Optional reservation identifier. */
    reservation_id?: string;
    /** Foreign key referencing the selected service. */
    service_id: string;
    /** Foreign key referencing the booked customer. */
    customer_id: string;
    /** Foreign key referencing the booked cat. */
    cat_id: string;
    /** Chosen service delivery method. */
    service_method: string;
    /**
     * Initial operational workflow status.
     * @defaultValue "Pending"
     */
    work_status?: string;
    /**
     * Whether to schedule an H-1 reminder.
     * @defaultValue true
     */
    notification_h1?: boolean;
    /** Total calculated fee in IDR. */
    total_bill?: number;
    /**
     * Initial payment clearance status.
     * @defaultValue "Unpaid"
     */
    paymen_status?: string;
    /** Before-and-after photo documentation metadata. */
    before_after?: ReservationBeforeAfter;
}

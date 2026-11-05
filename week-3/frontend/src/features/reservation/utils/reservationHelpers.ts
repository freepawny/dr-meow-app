/* ==========================================================================
   IMPORTS & TYPES
   ========================================================================== */
import type { BackendService } from "@/services/types";
import type {
    ReservationFormErrors,
    ReservationFormValues,
    ReservationWeightTier,
    WhatsappMessagePayload
} from "../types";

/* ==========================================================================
   PRICING & FORMATTING HELPERS
   ========================================================================== */
/**
 * Maps numeric cat weight in kg to the backend pricing tier key.
 *
 * @param weight - Numeric body weight of the cat in kilograms.
 * @returns Matched pricing weight tier (`"<2"`, `">2"`, or `">5"`).
 */
export const resolveWeightTier = (weight: number): ReservationWeightTier => {
    if (weight < 2) return "<2";
    if (weight <= 5) return ">2";
    return ">5";
};

/**
 * Calculates integer total bill for a Reservation based on Service tier_prices and Cat weight.
 *
 * @param service - Selected backend service entity containing pricing tiers.
 * @param weight - Effective cat body weight in kilograms.
 * @returns Total bill amount rounded to the nearest integer.
 */
export const calculateReservationBill = (
    service: BackendService | undefined,
    weight: number
): number => {
    if (!service) return 0;
    const safeWeight = Number.isFinite(weight) && weight > 0 ? weight : 1.5;
    const tier = resolveWeightTier(safeWeight);
    const price = service.tier_prices?.[tier] ?? service.base_price;
    return Math.max(0, Math.round(price));
};

/**
 * Formats an integer amount into Indonesian Rupiah display format.
 *
 * @param amount - Currency amount to format.
 * @returns Formatted currency string without trailing decimal zeroes (e.g. "Rp 55.000").
 */
export const formatIdrCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    })
        .format(amount)
        .replace(",00", "");
};

/* ==========================================================================
   DATE & INPUT SANITIZATION HELPERS
   ========================================================================== */
/**
 * Returns the next open clinic date in YYYY-MM-DD format (skipping Friday holiday).
 *
 * @returns Date string formatted as YYYY-MM-DD for the next available clinic day.
 */
export const getNextOpenClinicDate = (): string => {
    const candidate = new Date();
    candidate.setDate(candidate.getDate() + 1);
    if (candidate.getDay() === 5) {
        candidate.setDate(candidate.getDate() + 1);
    }
    const year = candidate.getFullYear();
    const month = String(candidate.getMonth() + 1).padStart(2, "0");
    const day = String(candidate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * Checks whether a YYYY-MM-DD date string falls on Friday (clinic closed day).
 *
 * @param dateStr - Date string formatted as YYYY-MM-DD.
 * @returns True if the target date is a Friday, false otherwise.
 */
export const isFridayDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const parts = dateStr.split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return false;
    const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
    return localDate.getDay() === 5;
};

/**
 * Strips spaces, dashes, and parentheses from phone input to match backend regex.
 *
 * @param raw - Raw phone number input string.
 * @returns Sanitized phone number containing only numeric digits or optional leading `+`.
 */
export const sanitizePhoneNumber = (raw: string): string => {
    return raw.replace(/[\s\-()]/g, "").trim();
};

/* ==========================================================================
   BUSINESS VALIDATION & WHATSAPP URL BUILDER
   ========================================================================== */
/**
 * Validates reservation form inputs against backend Customer, Cat, and Reservation constraints.
 *
 * @param values - Current form values to validate.
 * @param requiresHomeAddress - Whether home address field is mandatory for the selected method.
 * @returns Object mapping invalid field names to human-readable error messages.
 */
export const validateReservationForm = (
    values: ReservationFormValues,
    requiresHomeAddress: boolean
): ReservationFormErrors => {
    const errors: ReservationFormErrors = {};

    if (values.bookingMode === "existing") {
        if (!values.selectedCustomerId) {
            errors.selectedCustomerId =
                "Pilih pelanggan terdaftar atau gunakan tab Pelanggan Baru.";
        }
        if (!values.selectedCatId) {
            errors.selectedCatId =
                "Pilih data kucing yang terdaftar pada pelanggan ini.";
        }
        return errors;
    }

    if (!values.customerName.trim()) {
        errors.customerName = "Nama lengkap wajib diisi.";
    }

    const cleanPhone = sanitizePhoneNumber(values.phoneNumber);
    if (!cleanPhone) {
        errors.phoneNumber = "Nomor WhatsApp wajib diisi.";
    } else if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
        errors.phoneNumber =
            "Gunakan 10–15 digit angka (contoh: 081234567890).";
    }

    if (!values.scheduleDate) {
        errors.scheduleDate = "Tanggal kedatangan wajib dipilih.";
    } else if (isFridayDate(values.scheduleDate)) {
        errors.scheduleDate =
            "Klinik libur rutin hari Jumat. Pilih hari Sabtu–Kamis.";
    }

    if (!values.address.trim()) {
        errors.address = requiresHomeAddress
            ? "Alamat penjemputan / kunjungan rumah wajib diisi."
            : "Pilih cabang klinik atau isi alamat Anda.";
    }

    if (!values.catName.trim()) {
        errors.catName = "Nama kucing wajib diisi.";
    }

    const parsedWeight = Number.parseFloat(values.catWeight);
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
        errors.catWeight = "Berat kucing harus lebih dari 0 kg.";
    }

    return errors;
};

/**
 * Builds a pre-formatted WhatsApp confirmation or fallback reservation URL.
 *
 * @param payload - Structured context including reservation code, client data, and pricing.
 * @returns Fully encoded `https://wa.me/` hyperlink with pre-filled message text.
 */
export const buildWhatsappConfirmationUrl = ({
    reservationCode,
    service,
    serviceMethod,
    bookingMode,
    values,
    existingCustomer,
    existingCat,
    effectiveWeight,
    totalBill
}: WhatsappMessagePayload): string => {
    const ownerLabel =
        bookingMode === "existing"
            ? (existingCustomer?.name ?? "-")
            : values.customerName.trim();
    const petLabel =
        bookingMode === "existing"
            ? `${existingCat?.name ?? "-"} (${effectiveWeight} kg)`
            : `${values.catName.trim()} - ${values.catBreed} (${effectiveWeight} kg)`;
    const scheduleText =
        bookingMode === "existing"
            ? (existingCustomer?.schedule ?? "-")
            : `${values.scheduleDate} pukul ${values.timeSlot} WIB`;

    const lines = [
        "Halo Admin DR. MEOWW! Saya ingin konfirmasi reservasi perawatan:",
        reservationCode ? `• Kode Reservasi: *${reservationCode}*` : null,
        `• Paket Layanan: *Grooming ${service?.name ?? ""}*`,
        `• Metode Layanan: *${serviceMethod}*`,
        `• Nama Pemilik: ${ownerLabel}`,
        `• Profil Anabul: ${petLabel}`,
        `• Jadwal: ${scheduleText}`,
        `• Estimasi Biaya: *${formatIdrCurrency(totalBill)}*`
    ]
        .filter(Boolean)
        .join("\n");

    return `https://wa.me/?text=${encodeURIComponent(lines)}`;
};

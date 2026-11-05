/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { useState } from "react";
import type { FormEvent } from "react";
import type {
    BackendCat,
    BackendCustomer,
    BackendReservation,
    BackendService
} from "@/services/types";
import {
    CAT_BREED_OPTIONS,
    FALLBACK_SERVICES,
    MEDICAL_CONDITION_OPTIONS,
    SERVICE_METHOD_OPTIONS,
    TEMPERAMENT_OPTIONS,
    WEIGHT_PRESET_OPTIONS
} from "../constants";
import type {
    ReservationFormErrors,
    ReservationFormValues,
    ReservationSuccessSummary,
    ReservationWeightTier,
    UpdateReservationFieldFn
} from "../types";
import {
    buildWhatsappConfirmationUrl,
    calculateReservationBill,
    getNextOpenClinicDate,
    resolveWeightTier,
    sanitizePhoneNumber,
    validateReservationForm
} from "../utils/reservationHelpers";

/* ==========================================================================
   LOCAL IN-MEMORY DATA (SPRINT 02 — CLIENT-SIDE INTERACTIVITY)
   ========================================================================== */
const INITIAL_LOCAL_CUSTOMERS: BackendCustomer[] = [
    {
        customer_id: "CUS-001",
        name: "Nadia Putri",
        phone_number: "081234567890",
        schedule: "2026-11-08T10:00:00",
        address: "Jl. Soekarno Hatta No. 15, Malang",
        preference_notification: true
    }
];

const INITIAL_LOCAL_CATS: BackendCat[] = [
    {
        cat_id: "CAT-001",
        customer_id: "CUS-001",
        name: "Mochi",
        weight: 1.8,
        breeds: "Persian",
        vital_temperature: 38.2,
        tempramen: "Friendly",
        medical_history: "Tidak memiliki riwayat penyakit",
        last_picture: null
    }
];

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface UseReservationFormOptions {
    isOpen: boolean;
    initialServiceId?: string;
    initialWeightTier?: ReservationWeightTier;
    onReservationSuccess?: (reservation: BackendReservation) => void;
}

/* ==========================================================================
   CUSTOM HOOK
   ========================================================================== */
/**
 * Client-side interactive reservation state, validation, and local booking simulation (Sprint 02).
 */
export const useReservationForm = ({
    isOpen,
    initialServiceId,
    initialWeightTier,
    onReservationSuccess
}: UseReservationFormOptions) => {
    const [services] = useState<BackendService[]>(FALLBACK_SERVICES);
    const [existingCustomers, setExistingCustomers] = useState<BackendCustomer[]>(
        INITIAL_LOCAL_CUSTOMERS
    );
    const [allLocalCats, setAllLocalCats] = useState<BackendCat[]>(INITIAL_LOCAL_CATS);

    const [values, setValues] = useState<ReservationFormValues>(() => ({
        bookingMode: "new",
        selectedServiceId: "complete",
        serviceMethod: SERVICE_METHOD_OPTIONS[0].value,
        notificationH1: true,
        customerName: "",
        phoneNumber: "",
        scheduleDate: getNextOpenClinicDate(),
        timeSlot: "10:00",
        address: "",
        catName: "",
        catBreed: CAT_BREED_OPTIONS[0].value,
        catWeight: "1.5",
        catTemperament: TEMPERAMENT_OPTIONS[0].value,
        medicalHistory: MEDICAL_CONDITION_OPTIONS[0].value,
        selectedCustomerId: INITIAL_LOCAL_CUSTOMERS[0].customer_id,
        selectedCatId: INITIAL_LOCAL_CATS[0].cat_id
    }));

    const [fieldErrors, setFieldErrors] = useState<ReservationFormErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successSummary, setSuccessSummary] =
        useState<ReservationSuccessSummary | null>(null);

    const [prevOpen, setPrevOpen] = useState<boolean>(false);
    if (isOpen !== prevOpen) {
        setPrevOpen(isOpen);
        if (isOpen) {
            setSubmitError(null);
            setFieldErrors({});
            setSuccessSummary(null);

            const nextServiceId =
                initialServiceId && !initialServiceId.startsWith("kandang-")
                    ? initialServiceId
                    : undefined;
            const nextWeight = initialWeightTier
                ? WEIGHT_PRESET_OPTIONS.find((p) => p.tier === initialWeightTier)
                      ?.defaultWeight
                : undefined;

            if (nextServiceId || nextWeight) {
                setValues((prev) => ({
                    ...prev,
                    ...(nextServiceId ? { selectedServiceId: nextServiceId } : {}),
                    ...(nextWeight ? { catWeight: nextWeight } : {})
                }));
            }
        }
    }

    const existingCats = allLocalCats.filter(
        (cat) => cat.customer_id === values.selectedCustomerId
    );

    const updateField: UpdateReservationFieldFn = (field, value) => {
        setValues((prev) => {
            const next = { ...prev, [field]: value };
            if (field === "selectedCustomerId") {
                const firstCat = allLocalCats.find((c) => c.customer_id === value);
                next.selectedCatId = firstCat?.cat_id ?? "";
            }
            return next;
        });
        setFieldErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const activeService =
        services.find((s) => s.id === values.selectedServiceId) ?? services[0];

    const selectedExistingCustomer = existingCustomers.find(
        (c) => c.customer_id === values.selectedCustomerId
    );
    const selectedExistingCat = existingCats.find(
        (cat) => cat.cat_id === values.selectedCatId
    );

    const effectiveWeight: number =
        values.bookingMode === "existing"
            ? (selectedExistingCat?.weight ?? 1.5)
            : Number.parseFloat(values.catWeight) || 1.5;

    const currentWeightTier = resolveWeightTier(effectiveWeight);
    const totalBill = calculateReservationBill(activeService, effectiveWeight);

    const activeMethodOption =
        SERVICE_METHOD_OPTIONS.find((m) => m.value === values.serviceMethod) ??
        SERVICE_METHOD_OPTIONS[0];

    const getWhatsappUrl = (reservationCode?: string): string =>
        buildWhatsappConfirmationUrl({
            reservationCode,
            service: activeService,
            serviceMethod: values.serviceMethod,
            bookingMode: values.bookingMode,
            values,
            existingCustomer: selectedExistingCustomer,
            existingCat: selectedExistingCat,
            effectiveWeight,
            totalBill
        });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);

        const validationErrors = validateReservationForm(
            values,
            activeMethodOption.requiresHomeAddress
        );
        setFieldErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0 || !activeService) {
            return;
        }

        setIsSubmitting(true);

        const randomSuffix = Math.random().toString(16).slice(2, 8).toUpperCase();
        let finalCustomerId = values.selectedCustomerId;
        let finalCatId = values.selectedCatId;
        let summaryCustomerName = selectedExistingCustomer?.name ?? "";
        let summaryCatName = selectedExistingCat?.name ?? "";
        let summarySchedule = selectedExistingCustomer?.schedule ?? "";

        if (values.bookingMode === "new") {
            const cleanPhone = sanitizePhoneNumber(values.phoneNumber);
            const isoSchedule = `${values.scheduleDate}T${values.timeSlot}:00`;
            const parsedWeight = Number(
                Number.parseFloat(values.catWeight).toFixed(2)
            );

            finalCustomerId = `CUS-${randomSuffix}`;
            finalCatId = `CAT-${randomSuffix}`;

            const newCustomer: BackendCustomer = {
                customer_id: finalCustomerId,
                name: values.customerName.trim(),
                phone_number: cleanPhone,
                schedule: isoSchedule,
                address: values.address.trim(),
                preference_notification: values.notificationH1
            };

            const newCat: BackendCat = {
                cat_id: finalCatId,
                customer_id: finalCustomerId,
                name: values.catName.trim(),
                weight: parsedWeight,
                breeds: values.catBreed,
                vital_temperature: null,
                tempramen: values.catTemperament,
                medical_history: values.medicalHistory,
                last_picture: null
            };

            setExistingCustomers((prev) => [...prev, newCustomer]);
            setAllLocalCats((prev) => [...prev, newCat]);

            summaryCustomerName = newCustomer.name;
            summaryCatName = newCat.name;
            summarySchedule = `${values.scheduleDate} • ${values.timeSlot} WIB`;
        }

        const localReservation: BackendReservation = {
            reservation_id: `RES-${randomSuffix}`,
            service_id: activeService.id,
            customer_id: finalCustomerId,
            cat_id: finalCatId,
            service_method: values.serviceMethod,
            work_status: "Pending",
            notification_h1: values.notificationH1,
            total_bill: totalBill,
            paymen_status: "Unpaid",
            before_after: {
                before: null,
                after: null
            }
        };

        setSuccessSummary({
            reservation: localReservation,
            customerName: summaryCustomerName,
            catName: summaryCatName,
            catWeight: effectiveWeight,
            serviceName: `Grooming ${activeService.name}`,
            scheduleLabel: summarySchedule
        });

        setIsSubmitting(false);
        onReservationSuccess?.(localReservation);
    };

    const resetTransientState = () => {
        setSuccessSummary(null);
        setSubmitError(null);
        setFieldErrors({});
    };

    return {
        services,
        values,
        updateField,
        setFieldErrors,
        existingCustomers,
        existingCats,
        loadingCustomers: false,
        loadingCats: false,
        activeService,
        effectiveWeight,
        currentWeightTier,
        totalBill,
        requiresHomeAddress: activeMethodOption.requiresHomeAddress,
        fieldErrors,
        submitError,
        isSubmitting,
        successSummary,
        getWhatsappUrl,
        handleSubmit,
        resetTransientState
    };
};

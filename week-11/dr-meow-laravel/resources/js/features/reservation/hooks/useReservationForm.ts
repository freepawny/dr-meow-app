/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getServices } from "@/services/serviceApi";
import {
    createCat,
    createCustomer,
    createReservation,
    getCustomerCats,
    getCustomers
} from "@/services/reservationApi";
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
   TYPES & INTERFACES
   ========================================================================== */
/** Configuration options passed into useReservationForm. */
export interface UseReservationFormOptions {
    /** Controls whether the modal window is open. */
    isOpen: boolean;
    /** Optional pre-selected service ID when launched from pricing card. */
    initialServiceId?: string;
    /** Optional pre-selected cat weight tier. */
    initialWeightTier?: ReservationWeightTier;
    /** Optional callback invoked upon successful booking creation. */
    onReservationSuccess?: (reservation: BackendReservation) => void;
}

/* ==========================================================================
   CUSTOM HOOK
   ========================================================================== */
/**
 * Encapsulates reservation form state, API synchronization, validation, and submission workflow.
 *
 * @param options - Hook configuration options including modal open state and pre-selected values.
 * @returns State properties, field updaters, pricing totals, and submit action handlers.
 */
export const useReservationForm = ({
    isOpen,
    initialServiceId,
    initialWeightTier,
    onReservationSuccess
}: UseReservationFormOptions) => {
    const [services, setServices] = useState<BackendService[]>(FALLBACK_SERVICES);
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
        selectedCustomerId: "",
        selectedCatId: ""
    }));

    const [existingCustomers, setExistingCustomers] = useState<BackendCustomer[]>(
        []
    );
    const [existingCats, setExistingCats] = useState<BackendCat[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState<boolean>(false);
    const [loadingCats, setLoadingCats] = useState<boolean>(false);

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

    const updateField: UpdateReservationFieldFn = (field, value) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    useEffect(() => {
        if (!isOpen) return;
        let isMounted = true;

        const fetchActiveServices = async () => {
            try {
                const res = await getServices(true);
                if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
                    setServices(res.data);
                    setValues((prev) => ({
                        ...prev,
                        selectedServiceId: res.data.some(
                            (item) => item.id === prev.selectedServiceId
                        )
                            ? prev.selectedServiceId
                            : res.data[0].id
                    }));
                }
            } catch {
                void 0;
            }
        };

        void fetchActiveServices();
        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || values.bookingMode !== "existing") return;
        let isMounted = true;

        const fetchCustomersList = async () => {
            setLoadingCustomers(true);
            try {
                const res = await getCustomers();
                if (isMounted && Array.isArray(res.data)) {
                    setExistingCustomers(res.data);
                    if (res.data.length > 0) {
                        setValues((prev) => ({
                            ...prev,
                            selectedCustomerId:
                                prev.selectedCustomerId || res.data[0].customer_id
                        }));
                    }
                }
            } catch {
                if (isMounted) {
                    setExistingCustomers([]);
                }
            } finally {
                if (isMounted) {
                    setLoadingCustomers(false);
                }
            }
        };

        void fetchCustomersList();
        return () => {
            isMounted = false;
        };
    }, [isOpen, values.bookingMode]);

    useEffect(() => {
        if (
            !isOpen ||
            values.bookingMode !== "existing" ||
            !values.selectedCustomerId
        ) {
            return;
        }
        let isMounted = true;

        const fetchCatsForCustomer = async () => {
            setLoadingCats(true);
            try {
                const res = await getCustomerCats(values.selectedCustomerId);
                if (isMounted && Array.isArray(res.data)) {
                    setExistingCats(res.data);
                    setValues((prev) => ({
                        ...prev,
                        selectedCatId: res.data[0]?.cat_id ?? ""
                    }));
                }
            } catch {
                if (isMounted) {
                    setExistingCats([]);
                    setValues((prev) => ({ ...prev, selectedCatId: "" }));
                }
            } finally {
                if (isMounted) {
                    setLoadingCats(false);
                }
            }
        };

        void fetchCatsForCustomer();
        return () => {
            isMounted = false;
        };
    }, [isOpen, values.bookingMode, values.selectedCustomerId]);

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

        try {
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

                const customerRes = await createCustomer({
                    name: values.customerName.trim(),
                    phone_number: cleanPhone,
                    schedule: isoSchedule,
                    address: values.address.trim(),
                    preference_notification: values.notificationH1
                });

                finalCustomerId = customerRes.data.customer_id;
                summaryCustomerName = customerRes.data.name;
                summarySchedule = `${values.scheduleDate} • ${values.timeSlot} WIB`;

                const catRes = await createCat({
                    customer_id: finalCustomerId,
                    name: values.catName.trim(),
                    weight: parsedWeight,
                    breeds: values.catBreed,
                    vital_temperature: null,
                    tempramen: values.catTemperament,
                    medical_history: values.medicalHistory,
                    last_picture: null
                });

                finalCatId = catRes.data.cat_id;
                summaryCatName = catRes.data.name;
            }

            const reservationRes = await createReservation({
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
            });

            setSuccessSummary({
                reservation: reservationRes.data,
                customerName: summaryCustomerName,
                catName: summaryCatName,
                catWeight: effectiveWeight,
                serviceName: `Grooming ${activeService.name}`,
                scheduleLabel: summarySchedule
            });

            onReservationSuccess?.(reservationRes.data);
        } catch (err: unknown) {
            const rawMessage =
                err instanceof Error
                    ? err.message
                    : "Terjadi kendala saat menyimpan reservasi.";
            const isNetworkOffline =
                rawMessage.toLowerCase().includes("failed to fetch") ||
                rawMessage.toLowerCase().includes("network");

            setSubmitError(
                isNetworkOffline
                    ? "Server backend belum aktif atau tidak terjangkau. Pastikan backend berjalan di port 8000, atau lanjutkan pemesanan instan via WhatsApp."
                    : rawMessage
            );
        } finally {
            setIsSubmitting(false);
        }
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
        loadingCustomers,
        loadingCats,
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

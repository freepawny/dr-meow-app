/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { AlertCircle, Bell, MessageCircle, Sparkles } from "lucide-react";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import SwitchField from "@/components/SwitchField";
import { TabContainer, TabPill } from "@/components/TabPill";
import type { BackendReservation } from "@/services/types";
import CatProfileFields from "./components/CatProfileFields";
import ExistingCustomerFields from "./components/ExistingCustomerFields";
import OwnerScheduleFields from "./components/OwnerScheduleFields";
import ReservationModalFooter from "./components/ReservationModalFooter";
import ReservationSuccessView from "./components/ReservationSuccessView";
import ServiceMethodSelector from "./components/ServiceMethodSelector";
import ServicePackageSelector from "./components/ServicePackageSelector";
import { useReservationForm } from "./hooks/useReservationForm";
import type { ReservationWeightTier } from "./types";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the ReservationModal feature component.
 */
export interface ReservationModalProps {
    /** Controls whether the reservation modal window is open. */
    isOpen: boolean;
    /** Callback invoked when the user closes the modal via X button, backdrop, or Escape. */
    onClose: () => void;
    /** Optional pre-selected service ID when triggered from a specific pricing card. */
    initialServiceId?: string;
    /** Optional pre-selected cat weight tier when triggered from the pricing filter. */
    initialWeightTier?: ReservationWeightTier;
    /** Optional callback fired after a reservation is successfully persisted. */
    onReservationSuccess?: (reservation: BackendReservation) => void;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const FORM_ID = "dr-meoww-reservation-form";

/**
 * Orchestrator modal assembling reservation sub-views and binding them to useReservationForm.
 */
export const ReservationModal: FC<ReservationModalProps> = ({
    isOpen,
    onClose,
    initialServiceId,
    initialWeightTier,
    onReservationSuccess
}) => {
    const form = useReservationForm({
        isOpen,
        initialServiceId,
        initialWeightTier,
        onReservationSuccess
    });

    const handleCloseModal = () => {
        form.resetTransientState();
        onClose();
    };

    const receiptWhatsappUrl = form.successSummary
        ? form.getWhatsappUrl(form.successSummary.reservation.reservation_id)
        : form.getWhatsappUrl();

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            badge={
                <Badge
                    size="small"
                    variantStyle="outline"
                    label="Standar Medis Veteriner"
                    leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                />
            }
            title={
                form.successSummary
                    ? "Reservasi Berhasil Dibuat!"
                    : "Reservasi Jadwal Perawatan"
            }
            description={
                form.successSummary
                    ? "Jadwal perawatan anabul Anda telah tercatat di sistem klinik DR. MEOWW."
                    : "Pilih paket dan lengkapi data singkat anabul Anda. Praktis kurang dari 1 menit!"
            }
            footer={
                <ReservationModalFooter
                    formId={FORM_ID}
                    totalBill={form.totalBill}
                    currentWeightTier={form.currentWeightTier}
                    isSubmitting={form.isSubmitting}
                    successSummary={form.successSummary}
                    whatsappReceiptUrl={receiptWhatsappUrl}
                    onClose={handleCloseModal}
                />
            }
        >
            {form.successSummary ? (
                <ReservationSuccessView summary={form.successSummary} />
            ) : (
                <form
                    id={FORM_ID}
                    onSubmit={(e) => void form.handleSubmit(e)}
                    noValidate
                    className="flex flex-col gap-6"
                >
                    {form.submitError && (
                        <div
                            role="alert"
                            className="flex flex-col gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
                        >
                            <div className="flex items-start gap-2.5">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-text-error" />
                                <p className="font-nunito text-b3 leading-5">
                                    {form.submitError}
                                </p>
                            </div>
                            <div>
                                <Button
                                    size="small"
                                    variantStyle="outline"
                                    href={form.getWhatsappUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    rightIcon={
                                        <MessageCircle className="h-4 w-4" />
                                    }
                                    className="border-red-300 bg-surface-white text-red-700 hover:bg-red-50"
                                >
                                    Reservasi via WhatsApp Sekarang
                                </Button>
                            </div>
                        </div>
                    )}

                    <ServicePackageSelector
                        services={form.services}
                        activeServiceId={form.activeService?.id}
                        effectiveWeight={form.effectiveWeight}
                        onSelectService={(id) =>
                            form.updateField("selectedServiceId", id)
                        }
                    />

                    <ServiceMethodSelector
                        selectedMethod={form.values.serviceMethod}
                        onSelectMethod={(method) =>
                            form.updateField("serviceMethod", method)
                        }
                    />

                    <div className="flex flex-col gap-4 rounded-xl border border-grey-200 bg-surface-grey/60 p-4">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <span className="font-nunito text-b1 font-black text-primary-700">
                                3. Data Paw Parent & Anabul
                            </span>

                            <TabContainer variant="capsule" className="p-1">
                                <TabPill
                                    label="Pelanggan Baru"
                                    isSelected={
                                        form.values.bookingMode === "new"
                                    }
                                    onClick={() => {
                                        form.updateField("bookingMode", "new");
                                        form.setFieldErrors({});
                                    }}
                                    className="h-8 px-2.5 py-1 text-c1"
                                />
                                <TabPill
                                    label="Sudah Terdaftar"
                                    isSelected={
                                        form.values.bookingMode === "existing"
                                    }
                                    onClick={() => {
                                        form.updateField(
                                            "bookingMode",
                                            "existing"
                                        );
                                        form.setFieldErrors({});
                                    }}
                                    className="h-8 px-2.5 py-1 text-c1"
                                />
                            </TabContainer>
                        </div>

                        {form.values.bookingMode === "existing" ? (
                            <ExistingCustomerFields
                                customers={form.existingCustomers}
                                cats={form.existingCats}
                                selectedCustomerId={
                                    form.values.selectedCustomerId
                                }
                                selectedCatId={form.values.selectedCatId}
                                loadingCustomers={form.loadingCustomers}
                                loadingCats={form.loadingCats}
                                errors={form.fieldErrors}
                                onUpdateField={form.updateField}
                            />
                        ) : (
                            <div className="flex flex-col gap-4">
                                <OwnerScheduleFields
                                    values={form.values}
                                    errors={form.fieldErrors}
                                    requiresHomeAddress={
                                        form.requiresHomeAddress
                                    }
                                    onUpdateField={form.updateField}
                                />

                                <div className="my-1 h-px w-full bg-grey-200" />

                                <CatProfileFields
                                    values={form.values}
                                    errors={form.fieldErrors}
                                    currentWeightTier={form.currentWeightTier}
                                    onUpdateField={form.updateField}
                                />
                            </div>
                        )}
                    </div>

                    <SwitchField
                        checked={form.values.notificationH1}
                        onCheckedChange={(checked) =>
                            form.updateField("notificationH1", checked)
                        }
                        icon={<Bell className="h-4 w-4" />}
                        label="Pengingat Jadwal H-1 via WhatsApp"
                        description="Kirim notifikasi pengingat otomatis sehari sebelum jadwal perawatan."
                    />
                </form>
            )}
        </Modal>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default ReservationModal;

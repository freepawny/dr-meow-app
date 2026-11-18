/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import Button from "@/components/Button";
import type {
    ReservationSuccessSummary,
    ReservationWeightTier
} from "../types";
import { formatIdrCurrency } from "../utils/reservationHelpers";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Props for the ReservationModalFooter sub-component. */
export interface ReservationModalFooterProps {
    /** Target HTML form ID triggered by the primary submit button. */
    formId: string;
    /** Current calculated bill in IDR. */
    totalBill: number;
    /** Current cat weight tier bracket string. */
    currentWeightTier: ReservationWeightTier;
    /** Whether form submission is actively in flight. */
    isSubmitting: boolean;
    /** Completed reservation summary if submission succeeded. */
    successSummary: ReservationSuccessSummary | null;
    /** WhatsApp receipt confirmation hyperlink. */
    whatsappReceiptUrl: string;
    /** Callback to close the modal dialog. */
    onClose: () => void;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Sticky modal footer displaying real-time bill estimation and form/receipt action buttons.
 */
export const ReservationModalFooter: FC<ReservationModalFooterProps> = ({
    formId,
    totalBill,
    currentWeightTier,
    isSubmitting,
    successSummary,
    whatsappReceiptUrl,
    onClose
}) => {
    if (successSummary) {
        return (
            <div className="flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
                <Button
                    size="large"
                    variantStyle="outline"
                    href={whatsappReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    rightIcon={<MessageCircle className="h-5 w-5" />}
                    className="w-full sm:w-auto"
                >
                    Kirim Bukti ke WhatsApp
                </Button>
                <Button
                    size="large"
                    variantStyle="filled"
                    onClick={onClose}
                    className="w-full sm:w-auto"
                >
                    Selesai
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
                <span className="font-quicksand text-c1 font-bold text-grey-500">
                    Estimasi Total Tagihan ({currentWeightTier} kg)
                </span>
                <div className="flex items-baseline gap-2">
                    <span className="font-nunito text-h5 font-black text-text-accent">
                        {formatIdrCurrency(totalBill)}
                    </span>
                    <span className="font-nunito text-c1 text-grey-500">
                        • Bayar usai perawatan
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2.5">
                <Button
                    size="large"
                    variantStyle="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial"
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    form={formId}
                    size="large"
                    variantStyle="filled"
                    disabled={isSubmitting}
                    leftIcon={
                        isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : undefined
                    }
                    showRightIcon={!isSubmitting}
                    className="flex-1 sm:flex-initial"
                >
                    {isSubmitting ? "Memproses..." : "Konfirmasi Reservasi"}
                </Button>
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default ReservationModalFooter;

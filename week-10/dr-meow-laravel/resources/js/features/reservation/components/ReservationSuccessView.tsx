/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { CheckCircle2 } from "lucide-react";
import type { ReservationSuccessSummary } from "../types";
import { formatIdrCurrency } from "../utils/reservationHelpers";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Props for the ReservationSuccessView sub-component. */
export interface ReservationSuccessViewProps {
    /** Structured reservation confirmation summary data. */
    summary: ReservationSuccessSummary;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Confirmation receipt view displaying generated reservation code and booking summary.
 */
export const ReservationSuccessView: FC<ReservationSuccessViewProps> = ({
    summary
}) => {
    return (
        <div className="flex flex-col items-center gap-5 py-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-text-success shadow-100">
                <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="flex flex-col items-center gap-1">
                <span className="font-quicksand text-c1 font-bold uppercase tracking-wider text-grey-500">
                    Kode Reservasi Resmi
                </span>
                <span className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-1.5 font-quicksand text-s1 font-bold text-primary-700">
                    {summary.reservation.reservation_id}
                </span>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 rounded-xl border border-grey-200 bg-surface-grey p-4 text-left sm:grid-cols-2">
                <div className="flex flex-col">
                    <span className="font-nunito text-c1 text-grey-500">
                        Paw Parent
                    </span>
                    <span className="font-nunito text-b3 font-extrabold text-primary-700">
                        {summary.customerName}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-nunito text-c1 text-grey-500">
                        Profil Anabul
                    </span>
                    <span className="font-nunito text-b3 font-extrabold text-primary-700">
                        {summary.catName} ({summary.catWeight} kg)
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-nunito text-c1 text-grey-500">
                        Paket & Metode
                    </span>
                    <span className="font-nunito text-b3 font-extrabold text-primary-700">
                        {summary.serviceName} •{" "}
                        {summary.reservation.service_method}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="font-nunito text-c1 text-grey-500">
                        Status & Estimasi Biaya
                    </span>
                    <span className="font-nunito text-b3 font-extrabold text-text-accent">
                        {formatIdrCurrency(summary.reservation.total_bill)} (
                        {summary.reservation.work_status})
                    </span>
                </div>
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default ReservationSuccessView;

/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BackendService } from "@/services/types";
import {
    calculateReservationBill,
    formatIdrCurrency
} from "../utils/reservationHelpers";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Props for the ServicePackageSelector sub-component. */
export interface ServicePackageSelectorProps {
    /** Catalog of available grooming services. */
    services: BackendService[];
    /** Currently active service identifier. */
    activeServiceId: string | undefined;
    /** Effective cat body weight in kg for calculating real-time pricing. */
    effectiveWeight: number;
    /** Callback fired when user selects a service card. */
    onSelectService: (serviceId: string) => void;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Renders selectable service package cards with live weight-adjusted pricing.
 */
export const ServicePackageSelector: FC<ServicePackageSelectorProps> = ({
    services,
    activeServiceId,
    effectiveWeight,
    onSelectService
}) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="font-nunito text-b1 font-black text-primary-700">
                    1. Pilih Paket Perawatan
                </span>
                <span className="font-nunito text-c1 text-grey-500">
                    Harga menyesuaikan berat kucing
                </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {services.map((service) => {
                    const isSelected = service.id === activeServiceId;
                    const dynamicPrice = calculateReservationBill(
                        service,
                        effectiveWeight
                    );

                    return (
                        <button
                            key={service.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => onSelectService(service.id)}
                            className={cn(
                                "relative flex cursor-pointer flex-col justify-between gap-2 rounded-xl border-2 p-3.5 text-left transition-all duration-200 outline-none select-none",
                                "active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-400",
                                isSelected
                                    ? "border-primary-400 bg-primary-50 shadow-200"
                                    : "border-grey-200 bg-surface-white shadow-100 hover:border-primary-300"
                            )}
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="font-quicksand text-[11px] font-bold text-primary-600">
                                        {service.badge_label}
                                    </span>
                                    {service.is_popular && (
                                        <span className="rounded-full bg-yellow-300 px-2 py-0.5 font-quicksand text-[10px] font-bold text-surface-white">
                                            Populer
                                        </span>
                                    )}
                                </div>
                                <span className="font-nunito text-b1 font-black text-primary-700">
                                    {service.name}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-grey-100 pt-2">
                                <span className="font-nunito text-b3 font-black text-text-accent">
                                    {formatIdrCurrency(dynamicPrice)}
                                </span>
                                {isSelected && (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-400 text-surface-white">
                                        <Check className="h-3 w-3" />
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default ServicePackageSelector;

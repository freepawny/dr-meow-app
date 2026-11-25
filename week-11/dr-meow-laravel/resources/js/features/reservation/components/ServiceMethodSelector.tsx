/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC, ReactNode } from "react";
import { Building2, Coffee, Home, Truck } from "lucide-react";
import ChoiceChip from "@/components/ChoiceChip";
import { SERVICE_METHOD_OPTIONS } from "../constants";
import type { ServiceMethodIconKey } from "../types";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Props for the ServiceMethodSelector sub-component. */
export interface ServiceMethodSelectorProps {
    /** Currently selected service fulfillment method string value. */
    selectedMethod: string;
    /** Callback fired when user selects a fulfillment method. */
    onSelectMethod: (methodValue: string) => void;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Renders the 2x2 single-click service fulfillment method selector.
 */
export const ServiceMethodSelector: FC<ServiceMethodSelectorProps> = ({
    selectedMethod,
    onSelectMethod
}) => {
    const renderIcon = (iconKey: ServiceMethodIconKey): ReactNode => {
        switch (iconKey) {
            case "pickup":
                return <Truck className="h-4 w-4" />;
            case "home":
                return <Home className="h-4 w-4" />;
            case "dropoff":
                return <Building2 className="h-4 w-4" />;
            case "wait":
                return <Coffee className="h-4 w-4" />;
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <span className="font-nunito text-b1 font-black text-primary-700">
                2. Metode Layanan
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SERVICE_METHOD_OPTIONS.map((method) => (
                    <ChoiceChip
                        key={method.value}
                        label={method.label}
                        subLabel={method.subLabel}
                        icon={renderIcon(method.iconKey)}
                        isSelected={selectedMethod === method.value}
                        onClick={() => onSelectMethod(method.value)}
                    />
                ))}
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default ServiceMethodSelector;

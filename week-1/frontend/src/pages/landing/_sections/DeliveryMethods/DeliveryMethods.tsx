/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import CardVertical from "@/components/CardVertical";
import SectionHeader from "../../_components/SectionHeader";
import {
    type DeliveryMethodItem,
    DEFAULT_METHODS,
    DEFAULT_HEADLINE,
    DEFAULT_SUBHEADLINE
} from "./constants";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type { DeliveryMethodItem };

/**
 * Props for the DeliveryMethods section component.
 */
export interface DeliveryMethodsProps {
    /**
     * Primary section headline text.
     * @defaultValue DEFAULT_HEADLINE
     */
    headline?: string;
    /**
     * Supporting sub-headline descriptive copy.
     * @defaultValue DEFAULT_SUBHEADLINE
     */
    subHeadline?: string;
    /**
     * List of delivery method entries to display.
     * @defaultValue DEFAULT_METHODS
     */
    methods?: DeliveryMethodItem[];
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Landing page section showcasing the four available service fulfillment methods.
 */
export const DeliveryMethods: React.FC<DeliveryMethodsProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    methods = DEFAULT_METHODS,
    className
}) => {
    return (
        <section
            aria-label="Delivery Methods Section"
            className={cn(
                "flex w-full flex-col items-center justify-center gap-8 ",
                className
            )}
        >
            {/* Header */}
            <SectionHeader
                headline={headline}
                subHeadline={subHeadline}
            />

            {/* Cards Grid */}
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {methods.map((method) => (
                    <CardVertical
                        key={method.id}
                        hasShadow={false}
                        borderStyle="none"
                        textAlignment="center"
                        showButtons={false}
                        showItems={false}
                        showImage={true}
                        imageSrc={method.imageSrc}
                        imageAlt={method.title}
                        title={method.title}
                        description={method.description}
                    />
                ))}
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { DeliveryMethods as FourMethodServices };
export default DeliveryMethods;

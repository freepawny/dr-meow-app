/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Alignment options for the section header text and container. */
export type SectionHeaderAlign = "left" | "center" | "right";

/**
 * Props for the SectionHeader component.
 */
export interface SectionHeaderProps {
    /**
     * Primary section headline text or React element.
     */
    headline?: React.ReactNode;
    /**
     * Supporting sub-headline descriptive copy text or React element.
     */
    subHeadline?: React.ReactNode;
    /**
     * Text alignment layout.
     * @defaultValue "center"
     */
    align?: SectionHeaderAlign;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Shared section header component rendering headline and supporting sub-headline copy.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
    headline,
    subHeadline,
    align = "center"
}) => {
    const alignContainerClasses: Record<SectionHeaderAlign, string> = {
        left: "items-start text-left flex-1 w-full lg:max-w-[490px]",
        center: "items-center text-center justify-center",
        right: "items-end text-right justify-center"
    };

    const alignTextClasses: Record<SectionHeaderAlign, string> = {
        left: "w-full",
        center: "max-w-[618px]",
        right: "max-w-[618px]"
    };

    return (
        <div className={cn("flex flex-col gap-4", alignContainerClasses[align])}>
            {headline && (
                <h2 className="font-nunito font-black text-3xl md:text-h1 text-primary-700 leading-tight whitespace-pre-line">
                    {headline}
                </h2>
            )}
            {subHeadline && (
                <p
                    className={cn(
                        "font-nunito font-normal text-b1 text-primary-700 leading-6",
                        alignTextClasses[align]
                    )}
                >
                    {subHeadline}
                </p>
            )}
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { SectionHeader as SectionHeading };
export default SectionHeader;

/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import SectionHeader from "../../_components/SectionHeader";
import {
    DEFAULT_HEADLINE,
    DEFAULT_SUBHEADLINE,
    DEFAULT_PLACEHOLDER_TEXT
} from "./constants";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the FAQ section component.
 */
export interface FAQProps {
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
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Landing page section providing answers to frequently asked customer questions.
 */
export const FAQ: React.FC<FAQProps> = ({
    headline = DEFAULT_HEADLINE,
    subHeadline = DEFAULT_SUBHEADLINE,
    className
}) => {
    return (
        <section
            aria-label="FAQ Section"
            className={cn(
                "flex w-full flex-col items-center justify-center gap-8 py-8 px-4 md:px-8",
                className
            )}
        >
            <SectionHeader
                headline={headline}
                subHeadline={subHeadline}
            />
            <div className="flex w-full items-center justify-center rounded-xl bg-surface-white p-8 shadow-200">
                <span className="font-nunito text-b1 text-grey-500">
                    {DEFAULT_PLACEHOLDER_TEXT}
                </span>
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default FAQ;

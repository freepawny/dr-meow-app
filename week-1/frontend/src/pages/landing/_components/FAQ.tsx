/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the FAQ section component.
 */
export interface FAQProps {
    /**
     * Primary section headline text.
     * @defaultValue "Pertanyaan yang Sering Diajukan (FAQ)"
     */
    headline?: string;
    /**
     * Supporting sub-headline descriptive copy.
     * @defaultValue "Punya pertanyaan seputar layanan dan fasilitas kami? Temukan jawabannya di sini."
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
    headline = "Pertanyaan yang Sering Diajukan (FAQ)",
    subHeadline = "Punya pertanyaan seputar layanan dan fasilitas kami? Temukan jawabannya di sini.",
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
                subHeadlineClassName="leading-normal"
            />
            <div className="flex w-full items-center justify-center rounded-xl bg-surface-white p-8 shadow-200">
                <span className="font-nunito text-b1 text-grey-500">
                    Daftar Pertanyaan & Jawaban Segera Hadir
                </span>
            </div>
        </section>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default FAQ;

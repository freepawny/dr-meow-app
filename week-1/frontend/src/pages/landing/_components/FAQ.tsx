/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface FAQProps {
    headline?: string;
    subHeadline?: string;
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
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
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <h2 className="font-nunito text-h2 font-black text-primary-700 leading-tight">
                    {headline}
                </h2>
                <p className="max-w-[618px] font-nunito text-b1 text-primary-700 leading-normal">
                    {subHeadline}
                </p>
            </div>
            <div className="flex w-full items-center justify-center rounded-xl bg-surface-white p-8 shadow-200">
                <span className="font-nunito text-b1 text-grey-500">
                    Daftar Pertanyaan & Jawaban Segera Hadir
                </span>
            </div>
        </section>
    );
};

export default FAQ;

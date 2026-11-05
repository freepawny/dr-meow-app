/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface FAQItemProps {
    itemNumber: number | string;
    question: string;
    answer: ReactNode;
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Semantic <article> card presenting a single FAQ question and answer (Sprint 01).
 */
export const FAQItem: FC<FAQItemProps> = ({
    itemNumber,
    question,
    answer,
    className
}) => {
    return (
        <article
            className={cn(
                "w-full overflow-hidden rounded-xl bg-surface-white border-[1.5px] border-grey-200 shadow-100 p-5 sm:px-6 sm:py-5",
                className
            )}
        >
            <div className="flex items-center gap-3.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 font-quicksand text-sm font-bold text-primary-600">
                    {itemNumber}
                </span>
                <h3 className="flex-1 font-nunito text-[17px] font-extrabold leading-snug text-primary-700 sm:text-s1">
                    {question}
                </h3>
            </div>
            <div className="mt-4 sm:pl-[46px]">
                <p className="border-t border-grey-100 pt-4 font-nunito text-[15px] leading-[26px] text-grey-600 sm:text-b1">
                    {answer}
                </p>
            </div>
        </article>
    );
};

export default FAQItem;

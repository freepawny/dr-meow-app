/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the FAQItem component.
 */
export interface FAQItemProps {
    /** Unique identifier for accessibility controls. */
    id: string | number;
    /** Number display inside the badge indicator. */
    itemNumber: number | string;
    /** The FAQ question text. */
    question: string;
    /** The FAQ answer text or node. */
    answer: ReactNode;
    /** Whether this item is currently expanded. */
    isOpen: boolean;
    /** Callback when user clicks the accordion trigger button. */
    onToggle: () => void;
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Single accordion item component for the FAQ section.
 */
export const FAQItem: FC<FAQItemProps> = ({
    id,
    itemNumber,
    question,
    answer,
    isOpen,
    onToggle,
    className
}) => {
    return (
        <div
            className={cn(
                "w-full overflow-hidden rounded-xl bg-surface-white border-[1.5px] transition-all duration-200",
                isOpen
                    ? "border-primary-400 shadow-300"
                    : "border-grey-200 shadow-100 hover:border-primary-300 hover:shadow-200",
                className
            )}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${id}`}
                id={`faq-trigger-${id}`}
                className="flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent p-5 text-left select-none outline-none transition-colors sm:px-6 sm:py-5"
            >
                <div className="flex flex-1 items-center gap-3.5">
                    <span
                        className={cn(
                            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-quicksand text-sm font-bold transition-colors duration-200",
                            isOpen
                                ? "bg-primary-400 text-surface-white"
                                : "bg-primary-50 text-primary-600"
                        )}
                    >
                        {itemNumber}
                    </span>
                    <span className="flex-1 font-nunito text-[17px] font-extrabold leading-snug text-primary-700 sm:text-s1">
                        {question}
                    </span>
                </div>
                <ChevronDown
                    className={cn(
                        "h-6 w-6 shrink-0 transition-transform duration-300",
                        isOpen ? "rotate-180 text-primary-600" : "text-primary-500"
                    )}
                    aria-hidden="true"
                />
            </button>
            {isOpen && (
                <div
                    id={`faq-answer-${id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${id}`}
                    className="px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-200 sm:px-0 sm:pr-6 sm:pb-5 sm:pl-[70px]"
                >
                    <p className="border-t border-grey-100 pt-4 font-nunito text-[15px] leading-[26px] text-grey-600 sm:text-b1">
                        {answer}
                    </p>
                </div>
            )}
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default FAQItem;
